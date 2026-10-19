import blackLogo from "@/assets/souq-wordmark-black.png";
import whiteLogo from "@/assets/souq-wordmark-white.png";

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