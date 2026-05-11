// Tagged-template helper for readable multi-line SQL strings.
export function sql(strings: TemplateStringsArray): string {
  return strings.raw[0];
}
