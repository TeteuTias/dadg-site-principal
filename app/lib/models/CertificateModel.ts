import mongoose, { Schema, Model } from 'mongoose';
import { IEventCertificate } from './EventCertificateModel';
import { ObjectId } from 'mongoose';

// Interface para o documento do usuário
export interface ICertificate {
    _id: ObjectId;
    ownerId: ObjectId;
    ownerName: string;
    ownerCpf: string;
    eventName: string;
    ownerEmail: string;
    frontTopperText?: string;
    frontBottomText?: string;
    certificateHours: string;
    eventId: ObjectId;
}

export interface ICertificateWithEventIdPopulate extends Omit<ICertificate, "eventId"> {
    eventId: IEventCertificate
}

// Definição do schema do usuário
const CertificateSchema: Schema<ICertificate> = new Schema(
    {
        ownerId: { type: Schema.Types.ObjectId },
        ownerName: { type: String, required: true },
        ownerCpf: { type: String, required: true },
        eventName: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        certificateHours: { type: String, required: true },
        eventId: { type: Schema.Types.ObjectId, required: true, ref: "EventCertificate" },


    },
    { timestamps: true, collection: "certificates.datails" }
);

// Criação do modelo com Mongoose
const CertificateModel: Model<ICertificate> = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);

export default CertificateModel;

