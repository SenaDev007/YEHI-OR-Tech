"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/faqs";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return <div className="space-y-3">{faqs.map((faq, index) => <div key={faq.question} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)} className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left text-base font-bold text-noir-profond"><span>{faq.question}</span><ChevronDown className={`h-5 w-5 shrink-0 text-bleu-tech transition-transform ${open === index ? "rotate-180" : ""}`} /></button>{open === index && <p className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-7 text-gris">{faq.answer}</p>}</div>)}</div>;
}
