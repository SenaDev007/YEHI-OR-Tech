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
    <div ref={barRef} className="py-20 md:py-32 bg-noir-profond relative overflow-hidden">
      {/* Side Label */}
      <div className="absolute top-1/2 left-12 -translate-y-1/2 hidden xl:block">
        <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-24">
          <span>Trust us</span>
          <div className="w-px h-full bg-gris-dark/20" />
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-item flex flex-col items-center lg:items-start justify-center px-4 relative"
            >
              {/* Vertical Divider for Desktop */}
              {index !== 0 && (
                <div className="hidden lg:block absolute left-0 top-0 w-px h-full bg-white/5" />
              )}
              
              <div className="flex items-baseline gap-1 mb-4 lg:pl-12">
                <span className={`counter-${index} text-6xl md:text-8xl font-display font-medium text-white tracking-tighter`}>
                  0
                </span>
                <span className="text-3xl md:text-4xl font-display font-medium text-or">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-[10px] lg:pl-12 font-mono text-gris-dark uppercase tracking-[0.3em]">
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
