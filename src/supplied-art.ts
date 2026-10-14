export type SuppliedArtStatus = "loading" | "ready" | "error";

export function suppliedArtStatus(requiredImagesReady: readonly boolean[], failedPaths: readonly string[]): SuppliedArtStatus {
  if (failedPaths.length > 0) return "error";
  return requiredImagesReady.every(Boolean) ? "ready" : "loading";
}
