import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  darkMode?: boolean;
  children: React.ReactNode;
}

export default function SectionWrapper({
  id,
  className,
  darkMode = true,
  children,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "section-padding",
        darkMode ? "bg-background" : "bg-white text-black",
        className
      )}
    >
      <div className="container mx-auto">{children}</div>
    </section>
  );
}
