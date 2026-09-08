export type SelectionProcessSummary = {
  id: string;
  registrationStartDate: string;
  registrationEndDate: string;
  maxExamsPerApplication: number;
  maxCapacity: number;
  paidCount: number;
  remainingCapacity: number;
  examsCount: number;
  hasStarted: boolean;
  hasEnded: boolean;
  isRegistrationOpen: boolean;
};

export type SelectionProcessExam = {
  id: string;
  name: string;
  examStartDate: string;
  examEndDate: string;
};

export type SelectionProcessPricingTier = {
  examsCount: number;
  unitTotalPrice: number;
};

export type SelectionProcessDetail = SelectionProcessSummary & {
  exams: SelectionProcessExam[];
  pricingTiers: SelectionProcessPricingTier[];
};

export type StudentApplicationStatus =
  | "PAYMENT_PROCESSING"
  | "PAYMENT_REVIEW_REQUIRED"
  | "PAYMENT_REVERSED"
  | "REGISTRATION_NOT_OPEN"
  | "REGISTRATION_CLOSED"
  | "SOLD_OUT"
  | "NOT_REGISTERED"
  | "PAYMENT_PENDING"
  | "PAID_PENDING_LEAGUES"
  | "ENROLLED";

export type StudentApplicationState = {
  process: SelectionProcessDetail;
  status: StudentApplicationStatus;
  canCheckout: boolean;
  canSelectLeagues: boolean;
  application: { id: string; finalStatus: string } | null;
  ticket: {
    id: string;
    paymentStatus: "PENDING" | "PAID" | "CANCELED" | "REVIEW_REQUIRED";
    totalAmount: number;
    leagueAllowanceCount: number;
  } | null;
  payment: { sessionId: string; init_point: string | null; expiresAt: string; examsCount: number | null; totalAmount: number | null; status: string; canReplace: boolean } | null;
  selectedExamIds: string[];
  remainingSelections: number;
};

export const STATUS_LABELS: Record<StudentApplicationStatus, string> = {
  PAYMENT_PROCESSING: "Estamos processando seu pagamento",
  PAYMENT_REVIEW_REQUIRED: "Seu pagamento precisa de verificação pela equipe",
  PAYMENT_REVERSED: "Pagamento estornado ou contestado",
  REGISTRATION_NOT_OPEN: "Inscrições ainda não abriram",
  REGISTRATION_CLOSED: "Inscrições encerradas",
  SOLD_OUT: "Vagas esgotadas",
  NOT_REGISTERED: "Inscrições abertas",
  PAYMENT_PENDING: "Pagamento pendente",
  PAID_PENDING_LEAGUES: "Pagamento confirmado — escolha suas ligas",
  ENROLLED: "Inscrição concluída",
};

const CHECKOUT_ERROR_MESSAGES: Record<string, string> = {
  PAYMENT_REPLACEMENT_REQUIRED: "Cancele a cobrança atual antes de gerar outra quantidade.",
  PAYMENT_CANCELLATION_PENDING: "Ainda não foi possível confirmar o cancelamento. Nenhuma nova cobrança foi gerada. Peça à equipe para verificar o pagamento.",
  PAYMENT_PROCESSING: "Há uma operação em andamento. Aguarde e atualize sua inscrição.",
  PAYMENT_REVIEW_REQUIRED: "Precisamos verificar seu pagamento. Não pague outra cobrança; entre em contato com a equipe.",
  LEGACY_PAYMENT_REVIEW_REQUIRED: "Esta inscrição anterior precisa ser verificada pela equipe.",
  SELECTIVE_PROCESS_SETUP_REQUIRED: "As inscrições estão sendo preparadas. Tente novamente mais tarde.",
  PAYMENT_SESSION_CHANGED: "Sua cobrança foi atualizada em outra janela. Atualize a inscrição.",
  PROCESS_CHANGED_OR_SOLD_OUT: "A disponibilidade ou os valores foram atualizados. Recarregue sua inscrição.",
  IDEMPOTENCY_CONFLICT: "Os dados desta tentativa mudaram. Atualize a página para tentar novamente.",
  PAYMENT_PROVIDER_UNAVAILABLE: "Não foi possível confirmar a situação no Mercado Pago. Aguarde antes de tentar novamente.",
  REGISTRATION_CLOSED: "O período de inscrições deste processo seletivo não está aberto.",
  SOLD_OUT: "As vagas deste processo seletivo se esgotaram.",
  ALREADY_ENROLLED: "Você já possui inscrição neste processo seletivo.",
  EXAMS_EXCEED_MAX_PER_APPLICATION: "Você escolheu mais ligas do que este processo seletivo permite.",
  PRICING_NOT_CONFIGURED: "A tabela de preços ainda não foi publicada pela CLAM. Tente novamente mais tarde.",
  INVALID_PAYER: "Confira os dados de cobrança: algum campo obrigatório está vazio.",
  INVALID_EXAMS_COUNT: "Escolha ao menos uma liga para se inscrever.",
  PAYMENT_NOT_CONFIRMED: "Seu pagamento ainda não foi confirmado pelo Mercado Pago.",
  LEAGUE_ALLOWANCE_EXCEEDED: "Você selecionou mais ligas do que pagou.",
  LEAGUES_ALREADY_SELECTED: "Essas ligas já foram registradas na sua inscrição.",
  EXAMS_INVALID_FOR_PROCESS: "Alguma das ligas escolhidas não pertence a este processo seletivo.",
  NOT_AUTHENTICATED: "Entre na sua conta para continuar.",
  AUTH_SESSION_EXPIRED: "Sua sessão expirou. Entre novamente.",
};

export function describeError(code: string | undefined, fallback: string) {
  if (!code) return fallback;
  return CHECKOUT_ERROR_MESSAGES[code] || fallback;
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// As datas do processo seletivo sao gravadas a meia-noite UTC. Formatar no fuso
// local jogaria "2026-01-01" para 31/12/2025 no Brasil, entao tudo aqui e lido
// em UTC.
export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function processYear(value: string) {
  return new Date(value).getUTCFullYear();
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
