
import { toast, useToast as originalUseToast } from "@/src/hooks/use-toast";

export { toast };
export const useToast = originalUseToast;
export type { Toast, ToasterToast } from "@/src/hooks/use-toast";
