export type ProfileSummary = {
  displayName: string;
  complete: boolean;
  privacyNoticeRequired: boolean;
};

export function normalizeCpf(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}
export function formatCpf(value: string) {
  return normalizeCpf(value)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}
export function isValidCpf(value: string) {
  const cpf = normalizeCpf(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const digit = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i += 1)
      sum += Number(cpf[i]) * (length + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}
export function validateProfileFields(input: {
  name: string;
  cpf: string;
  period: string;
  registrationNumber?: string;
  birthDate?: string;
  phone?: string;
  contactEmail?: string;
}, requireClamFields = false) {
  const errors: Partial<Record<keyof typeof input, string>> = {};
  const name = input.name.normalize("NFKC").replace(/\s+/gu, " ").trim();
  if (name.length < 5 || name.length > 120)
    errors.name = "Informe o nome completo com 5 a 120 caracteres.";
  else if (
    /[\p{N}\p{Cc}\p{Cf}]/u.test(name) ||
    !/^[\p{L}\p{M}'’ -]+$/u.test(name)
  )
    errors.name = "Use somente letras, espaços, apóstrofos e hífens.";
  if (!isValidCpf(input.cpf)) errors.cpf = "Informe um CPF válido.";
  const period = Number(input.period);
  if (!Number.isInteger(period) || period < 1 || period > 12)
    errors.period = "Selecione um período entre 1 e 12.";
  const registrationNumber = input.registrationNumber?.trim();
  const birthDate = input.birthDate?.trim();
  const phone = input.phone?.replace(/\D/g, '');
  const contactEmail = input.contactEmail?.trim();
  if (registrationNumber && !/^[A-Za-z0-9.-]{1,40}$/.test(registrationNumber)) errors.registrationNumber = 'Use até 40 letras, números, pontos ou hífens.';
  const civil = birthDate ? new Date(birthDate + 'T12:00:00Z') : null;
  if (birthDate && (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || !civil || !Number.isFinite(civil.getTime()) || civil.toISOString().slice(0, 10) !== birthDate || birthDate < '1900-01-01' || birthDate > new Date().toISOString().slice(0, 10))) errors.birthDate = 'Informe uma data de nascimento válida.';
  if (phone && !/^\d{10,13}$/.test(phone)) errors.phone = 'Informe o telefone com DDD.';
  if (contactEmail && (contactEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))) errors.contactEmail = 'Informe um e-mail válido.';
  if (requireClamFields) for (const [key, value] of Object.entries({ registrationNumber, birthDate, phone, contactEmail })) {
    if (!value) errors[key as keyof typeof input] = 'Campo obrigatório para a inscrição na CLAM.';
  }
  return {
    errors,
    data: Object.keys(errors).length
      ? null
      : { name, cpf: normalizeCpf(input.cpf), period, registrationNumber, birthDate, phone, contactEmail },
  };
}
