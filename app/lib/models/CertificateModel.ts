import mongoose, { Schema, Model } from 'mongoose';
import { ObjectId } from 'mongoose';

// Interface para o documento do certificado
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
    certificatePath: string;

    // Novos campos para o verso do certificado
    hasBackside?: boolean; // Indica se há um verso
    backsideText?: string; // Texto do verso, se houver
    backsidePath?: string; // Caminho do arquivo de imagem do verso, se houver
}

// Definição do esquema do certificado
const CertificateSchema: Schema<ICertificate> = new Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, required: true },
        ownerName: { type: String, required: true },
        ownerCpf: { type: String, required: true },
        eventName: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        frontTopperText: { type: String },
        frontBottomText: { type: String },
        certificateHours: { type: String, required: true },
        certificatePath: { type: String, required: true },

        // Campos adicionais para o verso
        hasBackside: { type: Boolean, default: false },
        backsideText: { type: String },
        backsidePath: { type: String },
    },
    { timestamps: true, collection: "certificates.details" }
);

// Criação do modelo no Mongoose
const CertificateModel: Model<ICertificate> = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);

export default CertificateModel;
