import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  compact?: boolean;
  light?: boolean;
}

export default function BrandLogo({ compact = false, light = false }: BrandLogoProps) {
  return (
    <Link href="/" aria-label="YEHI OR Tech — Accueil" className="group inline-flex items-center gap-3">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${light ? "border-white/15 bg-white" : "border-blue-100 bg-white"} shadow-sm`}>
        <Image src="/images/brand/logo-mark.png" alt="" width={34} height={34} className="h-8 w-8 object-contain" priority />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={`block font-sans text-[15px] font-extrabold tracking-[.12em] ${light ? "text-white" : "text-noir-profond"}`}>YEHI <b className="text-or">OR</b></span>
          <span className={`mt-1 block font-mono text-[8px] tracking-[.42em] ${light ? "text-white/55" : "text-gris-dark"}`}>TECH</span>
        </span>
      )}
    </Link>
  );
}
