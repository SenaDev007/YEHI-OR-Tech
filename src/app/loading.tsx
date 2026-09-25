/**
 * Loading state pour la racine du site public.
 * Affiche un spinner élégant pendant le routing.
 */
export default function PublicLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-or/20" />
        <div className="h-12 w-12 rounded-full border-2 border-or border-t-transparent animate-spin absolute inset-0" />
      </div>
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-or animate-pulse">
        Chargement…
      </p>
    </div>
  );
}
