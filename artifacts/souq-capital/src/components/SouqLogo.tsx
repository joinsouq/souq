type SouqLogoProps = {
  variant?: "black" | "white";
  className?: string;
};

export default function SouqLogo({
  variant = "black",
  className = "",
}: SouqLogoProps) {
  return (
    <img
      src={`/souq-block-logo-${variant}.svg`}
      alt="Souq"
      className={`block h-auto ${className}`}
    />
  );
}