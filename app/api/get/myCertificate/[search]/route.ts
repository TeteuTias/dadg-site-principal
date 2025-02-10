import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/mongodb";
import CertificateModel from "@/app/lib/models/CertificateModel";




// export async function GET(req: NextRequest, { params }: { params: { search: string } }) {
export async function GET(req: NextRequest, {
    params,
}: {
    params: Promise<{ search: string }>
}) {

    await connectToDatabase()
    const { search } = await params
    const searchValue = search
    if (!searchValue) {
        return Response.json({ message: "O parâmetro 'search' é obrigatório." }, { status: 500 });
    }

    // Verifica se a entrada é um ObjectId válido
    let searchCriteria = {};
    if (mongoose.Types.ObjectId.isValid(searchValue)) {
        searchCriteria = { _id: new mongoose.Types.ObjectId(searchValue) };
    } else {
        searchCriteria = {
            $or: [
                { ownerName: { $regex: searchValue, $options: "i" } }, // Case insensitive
                { ownerCpf: { $regex: searchValue, $options: "i" } },
                { eventName: { $regex: searchValue, $options: "i" } },
                { ownerEmail: { $regex: searchValue, $options: "i" } },
            ],
        };
    }

    // Executa a consulta no banco de dados
    const owners = await CertificateModel.find(searchCriteria);

    if (owners.length == 0) {
        return NextResponse.json({ "message": "Nenhum resultado encontrado." }, { status: 404 })
    }


    return NextResponse.json({ "data": owners })
}