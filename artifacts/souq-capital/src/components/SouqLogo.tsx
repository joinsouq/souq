import blackLogo from "@assets/Sou_Logo-Text_(Black)_1787879812675.png";
import whiteLogo from "@assets/Souq_Logo-_Text_(White)_1787879812675.png";

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
      src={variant === "white" ? whiteLogo : blackLogo}
      alt="Souq"
      className={`block max-w-full ${className}`}
    />
  );
}