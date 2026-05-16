import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-noir-profond flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center container mx-auto px-6 py-40">
        <div className="text-center">
          <h1 className="text-[120px] md:text-[200px] font-display font-bold text-white/5 leading-none mb-4 select-none">
            404
          </h1>
          <div className="relative -mt-20 md:-mt-32">
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6">
              Page introuvable
            </h2>
            <p className="text-gris text-lg max-w-md mx-auto mb-10">
              Il semble que la lumière ne soit pas encore faite sur cette page.
              Retournons sur le chemin de l'innovation.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-or text-noir-profond font-bold clip-angular hover:bg-or-light transition-colors shadow-[0_0_20px_rgba(201,168,76,0.3)]"
            >
              <MoveLeft className="mr-2 w-5 h-5" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
