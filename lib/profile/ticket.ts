/**
 * Opções do QR Code pessoal do aluno. Os módulos precisam ser escuros sobre
 * fundo claro e manter a zona de silêncio padrão (4 módulos): o leitor do
 * painel administrativo não reconhece de forma confiável um código invertido.
 */
export const TICKET_QR_OPTIONS = {
  width: 240,
  margin: 4,
  color: { dark: "#0f172a", light: "#ffffff" },
  errorCorrectionLevel: "M",
} as const;
