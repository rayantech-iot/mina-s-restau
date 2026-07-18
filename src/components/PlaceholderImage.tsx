import Image from "next/image";

interface PlaceholderImageProps {
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: { w: 200, h: 200 },
  md: { w: 400, h: 400 },
  lg: { w: 600, h: 600 },
  xl: { w: 800, h: 600 },
};

export default function PlaceholderImage({
  alt,
  className = "",
  size = "md",
}: PlaceholderImageProps) {
  const { w, h } = sizeMap[size];

  return (
    <div
      className={`relative overflow-hidden bg-border-light flex items-center justify-center ${className}`}
      style={{ width: "100%", aspectRatio: `${w}/${h}` }}
    >
      <Image
        src="/images/placeholder-plat.svg"
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
