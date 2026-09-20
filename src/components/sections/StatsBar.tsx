const stats = [
  { value: "08", label: "Expertises digitales" },
  { value: "05", label: "Projets présentés" },
  { value: "24/7", label: "Solutions disponibles" },
  { value: "48h", label: "Délai de réponse" },
];

export default function StatsBar() {
  return (
    <section className="bg-yehi-ink py-10 text-white md:py-14">
      <div className="site-container grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-0">
        {stats.map((stat, index) => (
          <div key={stat.label} className={`px-5 ${index > 0 ? "md:border-l md:border-white/15" : ""}`}>
            <p className="font-display text-4xl font-semibold text-or-light md:text-5xl">{stat.value}</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[.2em] text-white/50">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
