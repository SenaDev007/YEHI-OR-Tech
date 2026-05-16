"use client";

import React, { useEffect, useRef } from "react";
import gsap from "@/lib/gsap";

const stats = [
  { value: 8, suffix: "+", label: "Services couverts" },
  { value: 5, suffix: "+", label: "Produits SaaS actifs" },
  { value: 100, suffix: "%", label: "Orienté résultats" },
  { value: 48, suffix: "h", label: "Délai de réponse" },
];

const StatsBar = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: barRef.current,
          start: "top 85%",
        },
      });

      // Animated counters
      stats.forEach((_, i) => {
        const target = document.querySelector(`.counter-${i}`);
        if (!target) return;
        
        const val = stats[i].value;
        const obj = { n: 0 };
        
        gsap.to(obj, {
          n: val,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: barRef.current,
            start: "top 85%",
          },
          onUpdate: () => {
            target.textContent = Math.round(obj.n).toString();
          }
        });
      });
    }, barRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={barRef} className="bg-noir-2 border-y border-or/10 py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-item flex flex-col items-center justify-center text-center px-4 relative"
            >
              {/* Separator */}
              {index !== 0 && (
                <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-or/20" />
              )}
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`counter-${index} text-4xl md:text-5xl font-display font-bold text-or`}>
                  0
                </span>
                <span className="text-2xl md:text-3xl font-display font-bold text-or">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-xs md:text-sm font-mono text-gris uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
