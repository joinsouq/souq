type SouqLogoProps = {
  variant?: "black" | "white";
  className?: string;
};

export default function SouqLogo({
  variant = "black",
  className = "",
}: SouqLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={`/souq-block-logo-${variant}.svg`}
        alt="Souq"
        className="block w-[3.6rem] h-auto"
      />
      <span
        aria-hidden="true"
        className="text-[1.0625rem] font-semibold tracking-[-0.035em]"
      >
        Souq
      </span>
    </span>
  );
}