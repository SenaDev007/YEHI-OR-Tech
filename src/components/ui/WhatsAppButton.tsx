"use client";

import React from "react";

const WHATSAPP_NUMBER = "2290141360803";
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
      {/* Official WhatsApp SVG Icon */}
      <svg
        viewBox="0 0 48 48"
        className="w-9 h-9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 4C13 4 4 13 4 24C4 27.8 5.1 31.3 7 34.3L4.1 44L14.1 41.2C17 42.9 20.4 43.9 24 43.9C35 43.9 44 35 44 24C44 13 35 4 24 4ZM24 40.3C20.6 40.3 17.4 39.3 14.7 37.6L14.1 37.2L8.4 38.8L10 33.2L9.5 32.6C7.6 29.8 6.5 26.5 6.5 24C6.5 14.9 13.9 7.5 23 7.5C32.1 7.5 39.5 14.9 39.5 24C39.5 33.1 32.1 40.3 24 40.3Z"
          fill="white"
        />
        <path
          d="M34.5 28.8C34 28.5 31.5 27.3 31.1 27.1C30.6 26.9 30.3 26.9 30 27.4C29.7 27.9 28.8 29 28.5 29.3C28.2 29.6 27.9 29.7 27.5 29.4C26.1 28.7 24.7 27.9 23.5 26.9C22.4 25.9 21.4 24.7 20.6 23.4C20.3 22.9 20.6 22.6 20.9 22.3C21.1 22.1 21.4 21.8 21.6 21.5C21.8 21.3 21.9 21.1 22 20.8C22.1 20.6 22.1 20.3 22 20.1C21.8 19.9 21 17.9 20.6 17C20.2 16.2 19.8 16.3 19.5 16.3H18.7C18.4 16.3 18 16.4 17.6 16.8C17.2 17.2 16 18.3 16 20.3C16 22.3 17.6 24.2 17.8 24.5C18 24.8 20.6 29 24.8 30.8C28.5 32.4 29 32.1 29.6 32C30.2 31.9 31.7 31 32 30.1C32.4 29.2 32.4 28.4 32.3 28.2C32.1 28 31.8 27.9 31.4 27.8L34.5 28.8Z"
          fill="white"
        />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
