import mongoose, { Schema, Document, models } from 'mongoose';
import { ObjectId } from 'bson';
// 1. A Interface TypeScript (Tipagem)
export interface ISubscriptionEvents {
  _id: ObjectId;
  title: string;
  description: string;
  eventDate: Date;
  location: string;
  type: 'Prática' | 'Teórica' | 'Congresso'; // Ex: Workshop de Intubação, Simulado...
  status: 'open' | 'closed';
  registeredUsers: ObjectId[]; // Lista de IDs dos usuários inscritos
  maxParticipants: number; // Opcional: limite de vagas
  registeredUsersCounter: number
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. O Schema do Mongoose
const SubscriptionEventsSchema = new Schema<ISubscriptionEvents>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    eventDate: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'closed'
    },
    // Aqui é o pulo do gato para saber em quais eventos o usuário está inscrito
    registeredUsers: [{
      type: ObjectId,
      ref: 'User' // Assumindo que sua collection de usuários chama 'User'
    }],
    registeredUsersCounter: {
      type: Number,
      required: true,
    },
    maxParticipants: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true, // Cria automaticamente os campos createdAt e updatedAt
    collection: 'subscription_events' // Nome da coleção no MongoDB
  }
  
);

// Evita erro de sobrescrita de model ao usar no Next.js
export const SubscriptionEventsModel = models.SubscriptionEventsModel || mongoose.model<ISubscriptionEvents>('SubscriptionEventsModel', SubscriptionEventsSchema);