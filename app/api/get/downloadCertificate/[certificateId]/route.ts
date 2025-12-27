import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/mongodb";
import CertificateModel from "@/app/lib/models/CertificateModel";
import ScanTemplateModel from "@/app/lib/models/ScanTemplate";
import AWS from "aws-sdk";
import { IEventCertificate } from "@/app/lib/models/EventCertificateModel";
import { PDFDocument } from "pdf-lib";
import { ObjectId } from "bson";

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
        }).populate<{ eventId: IEventCertificate }>("eventId");

        if (!certificate) {
            return Response.json({ message: "Certificado não encontrado." }, { status: 404 });
        }

        // Busca a imagem da frente
        const frontTemplateLink = await getSignedUrl(
            process.env.R2_BUCKET_NAME ?? "",
            certificate.eventId.templatePath
        );

        if (!frontTemplateLink) {
            return Response.json({ message: "Erro ao acessar template do certificado." }, { status: 500 });
        }

        const frontImageBuffer = await getBufferByImageUrl(frontTemplateLink);

        // Cria o PDF
        const pdfDoc = await PDFDocument.create();
        
        // Tenta embed como JPG, se falhar tenta PNG
        let frontImage;
        let width: number;
        let height: number;
        
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
            }
        }

        const pdfBytes = await pdfDoc.save();
        const fileName = `${certificate.eventName} - ${certificate.ownerName}.pdf`.replace(/[^a-z0-9]/gi, '_');

        return new Response(pdfBytes, {
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

