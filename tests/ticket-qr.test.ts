import assert from "node:assert/strict";
import test from "node:test";
import { TICKET_QR_OPTIONS } from "../lib/profile/ticket";

function luminance(hex: string) {
  const value = hex.replace("#", "");
  const [red, green, blue] = [0, 2, 4]
    .map((index) => parseInt(value.slice(index, index + 2), 16) / 255)
    .map((channel) =>
      channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

test("QR pessoal usa módulos escuros sobre fundo claro com zona de silêncio", () => {
  const dark = luminance(TICKET_QR_OPTIONS.color.dark);
  const light = luminance(TICKET_QR_OPTIONS.color.light);
  assert.ok(dark < light, "os módulos devem ser mais escuros que o fundo");
  assert.ok((light + 0.05) / (dark + 0.05) >= 7, "contraste insuficiente");
  assert.ok(TICKET_QR_OPTIONS.margin >= 4);
});
