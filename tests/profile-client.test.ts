import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProfileFields } from '../lib/profile/client';
import { profileReturnTo } from '../lib/profile/return-to';
const base = { name: 'Ana de Teste', cpf: '52998224725', period: '3' };
test('return after profile accepts CLAM and existing events, rejects external redirects', () => {
  for (const path of ['/eventos/123', '/processos-seletivos/123/inscricao', '/processos-seletivos/123/painel?origem=perfil']) assert.equal(profileReturnTo(path, 'https://dadg.example'), path);
  for (const path of ['//evil.example', 'https://evil.example', '/eventos-externos', '/perfil']) assert.equal(profileReturnTo(path, 'https://dadg.example'), null);
});
test('new candidate fields are optional outside CLAM', () => {
  assert.ok(validateProfileFields(base).data);
  assert.deepEqual(Object.keys(validateProfileFields(base, true).errors), ['registrationNumber', 'birthDate', 'phone', 'contactEmail']);
});
test('CLAM keeps leading zeros and civil dates while normalizing contact', () => {
  const data = validateProfileFields({ ...base, registrationNumber: '000123', birthDate: '2000-02-29', phone: '(34) 99999-1234', contactEmail: ' aluno@example.invalid ' }, true).data;
  assert.equal(data?.registrationNumber, '000123'); assert.equal(data?.birthDate, '2000-02-29'); assert.equal(data?.phone, '34999991234'); assert.equal(data?.contactEmail, 'aluno@example.invalid');
});
test('candidate validation rejects invalid civil dates and malformed contact', () => {
  for (const birthDate of ['2001-02-29', '2026-02-31', '2099-01-01', '04/03/2000']) assert.ok(validateProfileFields({ ...base, birthDate }).errors.birthDate);
  assert.ok(validateProfileFields({ ...base, phone: '123', contactEmail: 'invalid' }).errors.phone);
  assert.ok(validateProfileFields({ ...base, registrationNumber: '=2+2' }).errors.registrationNumber);
});
