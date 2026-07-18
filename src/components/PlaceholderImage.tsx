import Image from "next/image";

interface PlaceholderImageProps {
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  src?: string;
}

export default function PlaceholderImage({
  alt,
  className = "",
  size = "md",
  src,
}: PlaceholderImageProps) {
  const imageSrc = src || "/images/placeholder-plat.svg";

  return (
    <div
      className={`relative overflow-hidden bg-border-light ${className}`}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
