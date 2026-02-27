export function getSupportEmail(): string {
  const parts = window.location.hostname.split(".");
  const mainDomain = parts.length >= 2 ? parts.slice(-2).join(".") : null;
  return mainDomain ? `support@${mainDomain}` : "support@mittwald.de";
}
