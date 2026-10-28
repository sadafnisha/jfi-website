type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ eyebrow, title, description, align = "center" }: Props) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="font-serif text-3xl font-bold sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-ink/80">{description}</p>}
    </div>
  );
}
