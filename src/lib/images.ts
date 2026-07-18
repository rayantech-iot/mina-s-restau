export const PLATS_IMAGES: string[] = Array.from(
  { length: 112 },
  (_, i) => `/images/plats/plat-${String(i + 1).padStart(2, "0")}.png`
);

export function getPlatImage(index: number): string {
  return PLATS_IMAGES[index % PLATS_IMAGES.length];
}

export function getPlatImages(start: number, count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    getPlatImage(start + i)
  );
}

export function getFeaturedImages(): string[] {
  return [getPlatImage(0), getPlatImage(4), getPlatImage(8), getPlatImage(12)];
}

export function getHeroImage(): string {
  return getPlatImage(0);
}

export function getGalerieImages(count: number): string[] {
  return Array.from({ length: count }, (_, i) => getPlatImage(i * 3));
}
