"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "+22901413608"; // Update with real number
const WHATSAPP_MSG = encodeURIComponent(
  "Bonjour YEHI OR Tech, je souhaite en savoir plus sur vos services."
);

const WhatsAppButton = () => {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_8px_40px_rgba(37,211,102,0.6)] transition-all duration-300"
    >
      <MessageCircle className="w-8 h-8 text-white" />
    </a>
  );
};

export default WhatsAppButton;
