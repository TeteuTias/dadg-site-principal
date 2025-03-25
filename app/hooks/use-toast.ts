
// Importamos e reexportamos do componente original
// Isso mantém a compatibilidade com o código existente

import { useToast as originalUseToast } from "@/app/hooks/use-toast";

export const useToast = originalUseToast;
export type { Toast, ToasterToast } from "@/app/hooks/use-toast";
