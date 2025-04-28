import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/mongodb";
import CertificateModel from "@/app/lib/models/CertificateModel";
import AWS from "aws-sdk";
import { IEventCertificate } from "@/app/lib/models/EventCertificateModel";
//  export async function GET(req: NextRequest, { params }: { params: { certificateId: string } }) {

export const dynamic = 'force-dynamic'

// Configuração do cliente R2
const s3 = new AWS.S3({
    endpoint: process.env.R2_ENDPOINT, // Substitua pelo endpoint do seu bucket
    accessKeyId: process.env.R2_ACCESS_KEY_ID, // Defina isso no .env.local
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
});

const getSignedUrl = async (bucket: string, key: string): Promise<string | undefined> => {
    const params = { Bucket: bucket, Key: key }; // coloca a key aqui dps

    try {
        // Verifica se o arquivo existe
        await s3.headObject(params).promise();

        // Gera a URL assinada se o arquivo existir
        return s3.getSignedUrlPromise("getObject", { ...params, Expires: 60, });
    } catch (error) {
        // Verifica se o erro é uma instância de Error
        if (error instanceof Error) {
            // Trata erros específicos do S3
            if ((error as any).code === "NotFound" || (error as any).code === "NoSuchKey") {
                // console.warn(`Objeto não encontrado: bucket=${bucket}, key=${key}`);
                return undefined;
            }
            // Lança outros erros
            throw error;
        } else {
            // Lança erros desconhecidos
            throw new Error("Erro desconhecido ocorreu ao tentar gerar URL assinada.");
        }
    }
};

const getBufferByImageUrl = async (url: string): Promise<ArrayBuffer> => {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Falha ao baixar o template");
    const buffer = await response.arrayBuffer()
    return buffer
};


export async function GET(req: NextRequest, {
    params,
}: {
    params: Promise<{ certificateId: string }>
}) {

    await connectToDatabase()
    const { certificateId } = await params
    const searchValue = certificateId
    if (!searchValue || !mongoose.Types.ObjectId.isValid(searchValue)) {
        return Response.json({ message: "O parâmetro 'certificateId' é obrigatório." }, { status: 500 });
    }


    const owners = await CertificateModel.findOne({
        _id: certificateId
    }).populate<{ eventId: IEventCertificate }>("eventId");
    if (!owners) {
        return Response.json({ message: "Seu Certificado não foi encontrado. Entre em contato com o Suporte." }, { status: 500 });
    }
    const templateLink = await getSignedUrl(process.env.R2_BUCKET_NAME ?? "", owners?.eventId.templatePath)
    if (!templateLink) {
        throw new Error("Erro ao baixar seu Certificado")
    }

    const arrayBuffer = await getBufferByImageUrl(`${templateLink.split('?')[0]}?t=${Date.now()}&${templateLink.split('?')[1]}`)
    return new Response(arrayBuffer, {
        headers: {
            'Content-Type': 'image/jpeg', // ou o tipo correto da sua imagem
            'Cache-Control': 'public, max-age=86400' // cache de 1 dia
        }
    })
}