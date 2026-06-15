export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export function buildImageUrl(path?: string | null, cacheBuster?: number): string | undefined {
  if (!path) return undefined;

  const separator = path.includes("?") ? "&" : "?";
  if (cacheBuster === undefined) {
    return `${API_BASE_URL}${path}`;
  }

  return `${API_BASE_URL}${path}${separator}v=${cacheBuster}`;
}
