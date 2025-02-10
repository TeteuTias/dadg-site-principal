import { NextResponse } from "next/server";
import CertificateModel from "@/app/lib/models/CertificateModel";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {


    await connectToDatabase()

    const newData = await new CertificateModel({
        ownerId: new ObjectId(),
        ownerName: "Mateus Rosa Marints",
        ownerCpf: "713.140.661-96",
        eventName: "EVENTO TESTE",
        ownerEmail: "mateus2.0@icloud.com",
        certificateHours: "10",
        certificatePath: "/certificates/templates/template01.png",
    })
    await newData.save()

    const data = await CertificateModel.find({})

    return NextResponse.json({
        "ola": data
    })
}