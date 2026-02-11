/* eslint-disable */
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/mongodb";
import CertificateModel from "@/app/lib/models/CertificateModel";
import ScanTemplateModel from "@/app/lib/models/ScanTemplate";
import AWS from "aws-sdk";
import { IEventCertificate } from "@/app/lib/models/EventCertificateModel";
import { PDFDocument, PDFPage, rgb, StandardFonts } from "pdf-lib";
import { ObjectId } from "bson";
import { ICertificateWithEventIdPopulate } from "@/app/lib/models/CertificateModel";

export const dynamic = 'force-dynamic'

// Configuração do cliente R2
const s3 = new AWS.S3({
    endpoint: process.env.R2_ENDPOINT,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
});

const getSignedUrl = async (bucket: string, key: string): Promise<string | undefined> => {
    const params = { Bucket: bucket, Key: key };

    try {
        await s3.headObject(params).promise();
        return s3.getSignedUrlPromise("getObject", { ...params, Expires: 60 });
    } catch (error) {
        if (error instanceof Error) {
            if ((error as any).code === "NotFound" || (error as any).code === "NoSuchKey") {
                return undefined;
            }
            throw error;
        } else {
            throw new Error("Erro desconhecido ocorreu ao tentar gerar URL assinada.");
        }
    }
};

const getBufferByImageUrl = async (url: string): Promise<ArrayBuffer> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Falha ao baixar o template");
    return await response.arrayBuffer();
};

// Converte cor CSS (hex ou rgb) para RGB do pdf-lib
const parseColor = (color?: string): ReturnType<typeof rgb> => {
    if (!color) return rgb(0, 0, 0); // Preto por padrão
    
    // Remove espaços
    color = color.trim();
    
    // Hex color (#RRGGBB)
    if (color.startsWith('#')) {
        const hex = color.slice(1);
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        return rgb(r, g, b);
    }
    
    // RGB/RGBA
    if (color.startsWith('rgb')) {
        const match = color.match(/\d+/g);
        if (match && match.length >= 3) {
            return rgb(
                parseInt(match[0]) / 255,
                parseInt(match[1]) / 255,
                parseInt(match[2]) / 255
            );
        }
    }
    
    // Nome de cor comum
    const colorMap: { [key: string]: ReturnType<typeof rgb> } = {
        black: rgb(0, 0, 0),
        white: rgb(1, 1, 1),
        red: rgb(1, 0, 0),
        blue: rgb(0, 0, 1),
        green: rgb(0, 1, 0),
    };
    
    return colorMap[color.toLowerCase()] || rgb(0, 0, 0);
};

// Converte fontSize CSS para pontos
const parseFontSize = (fontSize?: string | number, defaultSize: number = 12): number => {
    if (!fontSize) return defaultSize;
    if (typeof fontSize === 'number') return fontSize;
    
    const match = fontSize.toString().match(/(\d+\.?\d*)/);
    if (match) {
        const value = parseFloat(match[1]);
        // Se for px, mantém o valor; se for em, multiplica por 12; se for rem, multiplica por 12
        if (fontSize.includes('em')) return value * 12;
        if (fontSize.includes('rem')) return value * 12;
        return value;
    }
    return defaultSize;
};

// Renderiza texto na frente do certificado
const drawCertificateText = async (
    page: PDFPage,
    certificate: ICertificateWithEventIdPopulate,
    width: number,
    height: number
) => {
    try {
        const font = await page.doc.embedFont(StandardFonts.TimesRoman);
        const boldFont = await page.doc.embedFont(StandardFonts.TimesRomanBold);
        
        // Se é onlyImage ou certificatePath (scan template), não renderiza texto
        if (certificate.onlyImage || (certificate.certificatePath && ObjectId.isValid(String(certificate.certificatePath)))) {
            console.log('Certificado é onlyImage ou scan template, não renderiza texto');
            console.log('onlyImage:', certificate.onlyImage, 'certificatePath:', certificate.certificatePath);
            return;
        }
        
        console.log('Renderizando texto para certificado normal');
        console.log('ownerName:', certificate.ownerName);
        console.log('frontTopperText:', certificate.frontTopperText);
        console.log('frontBottomText:', certificate.frontBottomText);
        
        // No PDF, o sistema de coordenadas é de baixo para cima (y=0 é a parte inferior)
        // Vamos calcular as posições a partir do topo e converter para coordenadas PDF
        const pdfCenterX = width / 2;
        
        // Calcula a posição Y inicial (do topo da página)
        // A página HTML usa flexbox com items-center, então o texto fica aproximadamente no centro vertical
        // Mas há um margin-bottom de 8% ou 115px, então o texto fica um pouco acima do centro
        let startYFromTop: number;
        const hasCustomText = certificate.frontTopperText || certificate.frontBottomText;
        
        if (!hasCustomText) {
            // Caso simples: texto centralizado com margem inferior
            // Na página HTML: mb-[8%] sm:mb-[115px], com altura de 1414px
            // Isso coloca o texto aproximadamente a 40-45% do topo
            startYFromTop = height * 0.42; // 42% do topo
        } else {
            // Caso com texto customizado
            const containerStyle = certificate.eventId.styleContainer || {};
            let topPercent = 0.35; // 35% do topo por padrão
            
            if (containerStyle.top) {
                const topValue = String(containerStyle.top);
                if (topValue.includes('%')) {
                    topPercent = parseFloat(topValue.replace('%', '')) / 100;
                } else if (topValue.includes('px')) {
                    // Se for em px, converte para porcentagem
                    const pxValue = parseFloat(topValue.replace('px', ''));
                    topPercent = pxValue / height;
                }
            }
            
            startYFromTop = height * topPercent;
        }
        
        // Converte para coordenadas PDF (y=0 é na parte inferior)
        let currentY = height - startYFromTop;
        const lineSpacing = 30;
        
        console.log(`Renderizando texto no certificado. Width: ${width}, Height: ${height}, StartY: ${currentY}`);
        
        // Texto superior (frontTopperText)
        if (certificate.frontTopperText) {
            const topperStyle = certificate.eventId.styleFrontTopperText || {};
            const fontSize = parseFontSize(topperStyle.fontSize as string, 14);
            const color = parseColor(topperStyle.color as string);
            const textFont = String(topperStyle.fontWeight || '').includes('bold') ? boldFont : font;
            
            const text = certificate.frontTopperText;
            const textWidth = textFont.widthOfTextAtSize(text, fontSize);
            const textX = Math.max(0, pdfCenterX - (textWidth / 2));
            
            console.log(`Desenhando frontTopperText: "${text}" em x:${textX}, y:${currentY}`);
            
            page.drawText(text, {
                x: textX,
                y: currentY,
                size: fontSize,
                font: textFont,
                color: color,
            });
            
            currentY -= (fontSize + lineSpacing);
        }
        
        // Nome do dono (ownerName) - sempre renderizado
        const nameStyle = certificate.eventId.styleNameText || {};
        const nameFontSize = parseFontSize(nameStyle.fontSize as string, 20);
        const nameColor = parseColor(nameStyle.color as string);
        const nameFont = String(nameStyle.fontWeight || '').includes('bold') ? boldFont : font;
        
        const ownerName = certificate.ownerName.toUpperCase();
        const nameWidth = nameFont.widthOfTextAtSize(ownerName, nameFontSize);
        const nameX = Math.max(0, pdfCenterX - (nameWidth / 2));
        
        console.log(`Desenhando ownerName: "${ownerName}" em x:${nameX}, y:${currentY}`);
        
        page.drawText(ownerName, {
            x: nameX,
            y: currentY,
            size: nameFontSize,
            font: nameFont,
            color: nameColor,
        });
        
        currentY -= (nameFontSize + lineSpacing);
        
        // Código de verificação - sempre renderizado
        const codeText = `Código de Verificação: ${String(certificate._id)}`;
        const codeFontSize = 11;
        const codeWidth = font.widthOfTextAtSize(codeText, codeFontSize);
        const codeX = Math.max(0, pdfCenterX - (codeWidth / 2));
        
        console.log(`Desenhando código: "${codeText}" em x:${codeX}, y:${currentY}`);
        
        page.drawText(codeText, {
            x: codeX,
            y: currentY,
            size: codeFontSize,
            font: font,
            color: rgb(0, 0, 0),
        });
        
        currentY -= (codeFontSize + lineSpacing);
        
        // Texto inferior (frontBottomText)
        if (certificate.frontBottomText) {
            const bottomStyle = certificate.eventId.styleFrontBottomText || {};
            const bottomFontSize = parseFontSize(bottomStyle.fontSize as string, 12);
            const bottomColor = parseColor(bottomStyle.color as string);
            const bottomFont = String(bottomStyle.fontWeight || '').includes('bold') ? boldFont : font;
            
            // Processa quebras de linha
            const lines = certificate.frontBottomText.replace(/\\n/g, '\n').split('\n');
            
            for (const line of lines) {
                if (line.trim()) {
                    const lineWidth = bottomFont.widthOfTextAtSize(line, bottomFontSize);
                    const lineX = Math.max(0, pdfCenterX - (lineWidth / 2));
                    
                    console.log(`Desenhando linha do frontBottomText: "${line}" em x:${lineX}, y:${currentY}`);
                    
                    page.drawText(line, {
                        x: lineX,
                        y: currentY,
                        size: bottomFontSize,
                        font: bottomFont,
                        color: bottomColor,
                    });
                    
                    currentY -= (bottomFontSize + 15); // Espaçamento menor entre linhas
                }
            }
        }
        
        console.log('Texto renderizado com sucesso');
    } catch (error) {
        console.error('Erro ao renderizar texto no certificado:', error);
        // Não lança erro, apenas loga, para que o PDF seja gerado mesmo se houver problema com o texto
    }
};

export async function GET(req: NextRequest, {
    params,
}: {
    params: Promise<{ certificateId: string }>
}) {
    try {
        await connectToDatabase();
        const { certificateId } = await params;

        if (!certificateId || !mongoose.Types.ObjectId.isValid(certificateId)) {
            return Response.json({ message: "O parâmetro 'certificateId' é obrigatório." }, { status: 400 });
        }

        const certificate = await CertificateModel.findOne({
            _id: certificateId,
            isReady: true,
        }).populate<{ eventId: IEventCertificate }>("eventId") as ICertificateWithEventIdPopulate | null;

        if (!certificate) {
            return Response.json({ message: "Certificado não encontrado." }, { status: 404 });
        }

        // Cria o PDF
        const pdfDoc = await PDFDocument.create();
        let frontImageBuffer: ArrayBuffer;
        let width: number;
        let height: number;

        // Verifica se é certificado com certificatePath (scan template)
        if (certificate.certificatePath && ObjectId.isValid(String(certificate.certificatePath))) {
            // Usa templateScanProxy
            if (!process.env.R2_SUBFOLDER) {
                return Response.json(
                    { message: "Configuração do servidor incompleta. R2_SUBFOLDER não está definido." },
                    { status: 500 }
                );
            }

            const template = await ScanTemplateModel.findOne({ _id: new ObjectId(String(certificate.certificatePath)) }).lean();
            if (!template) {
                return Response.json({ message: "Template não encontrado." }, { status: 404 });
            }
            
            const templateLink = await getSignedUrl(
                process.env.R2_BUCKET_NAME ?? "",
                `${process.env.R2_SUBFOLDER}/${template._id}.${template.templateExtension}`
            );
            
            if (!templateLink) {
                return Response.json({ message: "Erro ao acessar template do certificado." }, { status: 500 });
            }
            
            frontImageBuffer = await getBufferByImageUrl(templateLink);
        } else {
            // Certificado normal com templatePath
            const frontTemplateLink = await getSignedUrl(
                process.env.R2_BUCKET_NAME ?? "",
                certificate.eventId.templatePath
            );

            if (!frontTemplateLink) {
                return Response.json({ message: "Erro ao acessar template do certificado." }, { status: 500 });
            }

            frontImageBuffer = await getBufferByImageUrl(frontTemplateLink);
        }

        // Tenta embed como JPG, se falhar tenta PNG
        let frontImage;
        
        try {
            frontImage = await pdfDoc.embedJpg(frontImageBuffer);
            const scaled = frontImage.scale(1);
            width = scaled.width;
            height = scaled.height;
        } catch {
            // Se não for JPG, tenta PNG
            frontImage = await pdfDoc.embedPng(frontImageBuffer);
            const scaled = frontImage.scale(1);
            width = scaled.width;
            height = scaled.height;
        }

        const frontPage = pdfDoc.addPage([width, height]);
        frontPage.drawImage(frontImage, {
            x: 0,
            y: 0,
            width,
            height,
        });

        // Renderiza texto no certificado (apenas para certificados normais, não scan template ou onlyImage)
        try {
            await drawCertificateText(frontPage, certificate, width, height);
        } catch (error) {
            console.error('Erro ao renderizar texto, mas continuando com o PDF:', error);
            // Continua gerando o PDF mesmo se houver erro no texto
        }

        // Se houver verso, adiciona ao PDF
        if (certificate.verse?.showVerse && certificate.eventId.templateVersePath) {
            const verseTemplateLink = await getSignedUrl(
                process.env.R2_BUCKET_NAME ?? "",
                certificate.eventId.templateVersePath
            );

            if (verseTemplateLink) {
                const verseImageBuffer = await getBufferByImageUrl(verseTemplateLink);
                let verseImage;
                try {
                    verseImage = await pdfDoc.embedJpg(verseImageBuffer);
                } catch {
                    verseImage = await pdfDoc.embedPng(verseImageBuffer);
                }
                const versePage = pdfDoc.addPage([width, height]);
                versePage.drawImage(verseImage, {
                    x: 0,
                    y: 0,
                    width,
                    height,
                });

                // TODO: Renderizar texto do verso (tabela) se necessário
                // Por enquanto, o verso geralmente é apenas uma tabela que pode ser complexa de renderizar
            }
        }

        const pdfBytes = await pdfDoc.save();
        const fileName = `${certificate.eventName} - ${certificate.ownerName}.pdf`.replace(/[^a-z0-9]/gi, '_');

        return new Response(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Cache-Control': 'no-cache',
            },
        });
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        return Response.json(
            { message: error instanceof Error ? error.message : "Erro ao gerar PDF do certificado." },
            { status: 500 }
        );
    }
}

