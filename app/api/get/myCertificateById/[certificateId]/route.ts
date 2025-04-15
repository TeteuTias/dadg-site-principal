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
    return NextResponse.json({ "data": owners, })
}