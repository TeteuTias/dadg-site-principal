
import { toast as originalToast, useToast as originalUseToast } from "@/src/hooks/use-toast";

export const toast = originalToast;
export const useToast = originalUseToast;
export type { Toast, ToasterToast } from "@/src/hooks/use-toast";
