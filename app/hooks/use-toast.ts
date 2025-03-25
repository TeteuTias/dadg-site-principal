
// Importaremos e reexportaremos do componente original
// Isso mantém a compatibilidade com o código existente

import { useToast as originalUseToast } from "@/hooks/use-toast";

export const useToast = originalUseToast;
export type { Toast, ToasterToast } from "@/hooks/use-toast";
