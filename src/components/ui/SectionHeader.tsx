import AccentTag from "./AccentTag";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  tone?: "light" | "dark";
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
  tone = "light",
}: SectionHeaderProps) {
  const alignment =
    align === "center"
      ? "text-center items-center mx-auto"
      : "text-left items-start";
  const titleColor =
    tone === "dark"
      ? "text-white"
      : "text-gray-900 dark:text-white";
  const descriptionColor =
    tone === "dark"
      ? "text-gray-300"
      : "text-gray-600 dark:text-gray-300";

  return (
    <div
      className={[
        "flex flex-col gap-4 max-w-3xl",
        alignment,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow && <AccentTag>{eyebrow}</AccentTag>}
      <div className="space-y-3">
        <h2
          className={[
            "text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]",
            titleColor,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {title}
        </h2>
        {description && (
          <p
            className={[
              "text-lg md:text-xl",
              descriptionColor,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
