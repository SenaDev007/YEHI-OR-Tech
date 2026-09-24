"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    FedaPay?: {
      init: (config: {
        public_key: string;
        transaction: {
          amount: number;
          description: string;
        };
        customer: {
          email: string;
          lastname: string;
          firstname?: string;
          phone_number?: string;
        };
        container: string;
        onComplete?: (transaction: unknown) => void;
        onError?: (error: unknown) => void;
      }) => void;
    };
  }
}

type FedaPayCheckoutProps = {
  publicKey: string;
  transaction: {
    amount: number;
    description: string;
  };
  customer: {
    email?: string;
    lastname?: string;
    firstname?: string;
    phone_number?: string;
  };
  onComplete?: (transaction: unknown) => void;
  onError?: (error: unknown) => void;
};

/**
 * FedaPay Checkout Component — adapté de Academia Helm.
 * Charge le script checkout.js depuis le CDN FedaPay et initialise le checkout intégré.
 * Dark theme YEHI OR Tech.
 */
export function FedaPayCheckout({
  publicKey,
  transaction,
  customer,
  onComplete,
  onError,
}: FedaPayCheckoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Charger le script checkout.js de FedaPay
  useEffect(() => {
    if (document.querySelector('script[src*="checkout.js"]')) {
      setScriptLoaded(true);
      setIsLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.fedapay.com/checkout.js?v=1.1.7";
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
      setIsLoading(false);
    };
    script.onerror = () => {
      setError("Impossible de charger le script FedaPay");
      setIsLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="checkout.js"]');
      if (existingScript) existingScript.remove();
    };
  }, []);

  // Initialiser le checkout FedaPay
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !publicKey) return;

    try {
      if (!window.FedaPay) {
        setError("FedaPay n'est pas disponible");
        return;
      }

      window.FedaPay.init({
        public_key: publicKey,
        transaction: {
          amount: transaction.amount,
          description: transaction.description,
        },
        customer: {
          email: customer?.email ?? "",
          lastname: customer?.lastname ?? "",
          ...(customer?.firstname && { firstname: customer.firstname }),
          ...(customer?.phone_number && { phone_number: customer.phone_number }),
        },
        container: "#fedapay-checkout-container",
        onComplete: (transactionData: unknown) => {
          if (onComplete) onComplete(transactionData);
        },
        onError: (errorData: unknown) => {
          const errMsg =
            errorData && typeof errorData === "object" && "message" in errorData
              ? String((errorData as { message: unknown }).message)
              : "Erreur lors du paiement";
          setError(errMsg);
          if (onError) onError(errorData);
        },
      });

      // Forcer la hauteur du conteneur
      const ensureFullHeight = () => {
        const container = document.getElementById("fedapay-checkout-container");
        if (!container) return;
        container.style.height = "auto";
        container.style.minHeight = "auto";
        container.style.maxHeight = "none";
        container.style.overflow = "visible";
        const iframe = container.querySelector("iframe");
        if (iframe) {
          (iframe as HTMLIFrameElement).style.height = "600px";
          (iframe as HTMLIFrameElement).style.minHeight = "600px";
        }
      };
      ensureFullHeight();
      const timer1 = setTimeout(ensureFullHeight, 300);
      const timer2 = setTimeout(ensureFullHeight, 1000);
      const observer = new MutationObserver(ensureFullHeight);
      const el = document.getElementById("fedapay-checkout-container");
      if (el) observer.observe(el, { childList: true, subtree: true });
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        observer.disconnect();
      };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Erreur d'initialisation";
      setError(errMsg);
      if (onError) onError(err);
    }
  }, [scriptLoaded, publicKey, transaction, customer, onComplete, onError]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-or/20 bg-noir-3">
        <Loader2 className="w-8 h-8 animate-spin text-or mb-4" />
        <p className="text-sm text-gris-light">Chargement du formulaire de paiement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-danger/30 bg-danger/5">
        <div className="flex items-center gap-2 text-danger text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        #fedapay-checkout-container {
          height: auto !important;
          min-height: auto !important;
          max-height: none !important;
          overflow: visible !important;
        }
        #fedapay-checkout-container iframe {
          min-height: 500px !important;
          max-height: none !important;
          overflow: visible !important;
        }
      `}</style>
      <div id="fedapay-checkout-container" ref={containerRef} className="w-full" />
    </>
  );
}
