import mongoose, { Schema, Model, Types } from "mongoose";

export interface IProfile {
  _id: Types.ObjectId;
  name?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Nome informado no onboarding do site do aluno.
 *
 * Esta coleção é exclusiva do site. O perfil completo (CPF, matrícula, período,
 * aceite de privacidade) pertence ao backend de certificados, que grava em
 * `users.profiles` com uma chave lógica totalmente diferente
 * (`authIssuer` + `authSubject`) e índices únicos sobre ela e sobre `cpfLookup`.
 *
 * Enquanto este modelo apontava para `users.profiles`, cada onboarding criava
 * ali um documento sem `authIssuer`, `authSubject` nem `cpfLookup`: o backend
 * nunca encontrava esse perfil (todo aluno ficava "cadastro incompleto" e o
 * CLAM respondia PROFILE_INCOMPLETE) e o segundo aluno a concluir o onboarding
 * colidia em `profile_identity_unique`, que indexa os campos ausentes como
 * nulos, derrubando a tela de informações iniciais com E11000.
 */
const ProfileSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: false, default: null },
  },
  {
    timestamps: true,
    collection: "users.onboardingNames",
    _id: false,
  },
);

export const ProfileModel: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
