export function sql(strings: TemplateStringsArray): string {
  return strings.raw[0];
}
