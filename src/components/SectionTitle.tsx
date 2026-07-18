interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionTitleProps) {
  return (
    <div
      className={`mb-8 lg:mb-12 ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      <h2
        className={`font-serif text-3xl font-bold sm:text-4xl lg:text-5xl ${
          light ? "text-creme" : "text-marine"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-lg ${
            light ? "text-creme/70" : "text-texte-light"
          } max-w-2xl ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-1 w-16 rounded bg-dore ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
