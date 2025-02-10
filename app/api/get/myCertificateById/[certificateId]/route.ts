import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/mongodb";
import CertificateModel from "@/app/lib/models/CertificateModel";


//  export async function GET(req: NextRequest, { params }: { params: { certificateId: string } }) {

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
    });


    return NextResponse.json({ "data": owners })
}