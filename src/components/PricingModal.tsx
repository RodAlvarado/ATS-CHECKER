import React, { useState } from "react";
import { X, Check, Zap, Shield, Sparkles, CreditCard, ArrowRight, Award } from "lucide-react";
import AtsCheckerLogo from "./AtsCheckerLogo";
import { addPlanCredits, UserProfile } from "../firebase";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any | null;
  userProfile: UserProfile | null;
  onPlanPurchased: (creditsAdded: number, planName: string) => void;
  onRequireAuth: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  user,
  userProfile,
  onPlanPurchased,
  onRequireAuth,
}) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const plans = [
    {
      id: "basico" as const,
      name: "Plan Básico",
      price: "$1",
      priceNum: 1,
      paymentType: "Pago único",
      credits: 1,
      creditsLabel: "1 Revisión de CV",
      stripeLink: "https://buy.stripe.com/aFa5kF3W2aDp6er8I32cg05",
      description: "Ideal para escanear y calibrar tu CV frente a una postulación puntual en USA.",
      badge: null,
      color: "border-slate-200 hover:border-slate-400",
      buttonBg: "bg-slate-900 hover:bg-slate-800 text-white",
      features: [
        "1 Escaneo completo frente a filtros ATS de USA",
        "Diagnóstico de alertas rojas y sesgos de formato",
        "Puntuación ATS sobre 100 y compatibilidad de keywords",
        "Descarga en formato Harvard ATS (Word & PDF)",
      ],
    },
    {
      id: "postulante" as const,
      name: "Plan Postulante",
      price: "$5",
      priceNum: 5,
      paymentType: "Pago único",
      credits: 6,
      creditsLabel: "6 Revisiones de CV",
      stripeLink: "https://buy.stripe.com/8x28wRbou4f1cCP1fB2cg07",
      description: "El paquete recomendado para postular a múltiples empresas remotas.",
      badge: "MÁS POPULAR",
      popular: true,
      color: "border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20",
      buttonBg: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20",
      features: [
        "6 Escaneos completos de CV independientes",
        "Reescritura completa al estándar Harvard Business",
        "Mejorador interactivo de viñetas con métricas de impacto",
        "Compatibilidad con PDF, Word DOCX y TXT",
        "Historial en la nube y ahorro del 17% vs básico",
      ],
    },
    {
      id: "empleo_usa" as const,
      name: "Plan Empleo en USA",
      price: "$10",
      priceNum: 10,
      paymentType: "Pago único",
      credits: 12,
      creditsLabel: "12 Revisiones de CV",
      stripeLink: "https://buy.stripe.com/3cI5kFdwCaDpeKX6zV2cg06",
      description: "Paquete intensivo para asegurar tu contratación en empresas de EE.UU.",
      badge: "MEJOR VALOR ($0.83 / CV)",
      bestValue: true,
      color: "border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/20",
      buttonBg: "bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md shadow-amber-600/20",
      features: [
        "12 Escaneos profundos de CV (Máxima cobertura)",
        "Adaptación quirúrgica por industria y descripción de cargo",
        "Optimización de logros cuantificables en dólares ($USD)",
        "Acceso preferente al mejorador de viñetas ilimitado",
        "El costo más bajo por revisión ($0.83 cada una)",
        "Soporte y acceso vitalicio al historial de revisiones",
      ],
    },
  ];

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    if (!user) {
      onRequireAuth();
      return;
    }

    if (!user.emailVerified) {
      setError("Por favor valida tu correo electrónico antes de adquirir un plan.");
      return;
    }

    setError(null);
    setLoadingPlan(plan.id);

    try {
      // Direct Stripe Payment Link navigation with customer tracking
      if (plan.stripeLink) {
        const stripeUrl = new URL(plan.stripeLink);
        stripeUrl.searchParams.set("client_reference_id", user.uid);
        if (user.email) {
          stripeUrl.searchParams.set("prefilled_email", user.email);
        }
        localStorage.setItem("pending_stripe_checkout", JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          credits: plan.credits,
          amount: plan.priceNum,
          timestamp: Date.now(),
        }));
        window.location.href = stripeUrl.toString();
        return;
      }

      // Fallback backend session creation
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          userId: user.uid,
          userEmail: user.email,
          returnUrl: window.location.origin + window.location.pathname,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al conectar con la pasarela de pagos.");
      }

      const sessionData = await response.json();

      if (sessionData.simulated) {
        // In preview sandbox: award credits immediately and record payment
        await addPlanCredits(user.uid, plan.id, plan.credits, plan.priceNum);
        onPlanPurchased(plan.credits, plan.name);
        onClose();
      } else if (sessionData.url) {
        // Real Stripe checkout redirect
        window.location.href = sessionData.url;
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err?.message || "No se pudo procesar la solicitud de pago.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-2">
            <AtsCheckerLogo size="md" showSubtitle={false} />
          </div>

          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold tracking-wider uppercase border border-blue-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema Oficial de Pagos por Stripe</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Elige tu Plan de Revisiones de CV
          </h2>
          <p className="text-xs sm:text-sm text-blue-200/90 max-w-xl mx-auto mt-1 leading-relaxed">
            Sin suscripciones mensuales recurrentes. Todos nuestros planes son de <span className="text-white font-bold underline decoration-amber-400">pago único</span> y tus revisiones no caducan.
          </p>

          {userProfile && (
            <div className="mt-4 inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/15 text-xs">
              <span className="text-slate-300">Tus revisiones actuales:</span>
              <span className="font-extrabold text-amber-400">{userProfile.credits} {userProfile.credits === 1 ? "revisión" : "revisiones"}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-rose-600 font-bold hover:underline ml-2">
                Cerrar
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-6 border-2 flex flex-col justify-between transition-all hover:scale-[1.01] ${plan.color}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-white shadow-xs ${
                      plan.bestValue ? "bg-amber-600" : "bg-blue-600"
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="text-center pb-4 border-b border-slate-100">
                    <h3 className="font-bold text-base text-slate-900">{plan.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{plan.description}</p>
                    
                    <div className="mt-3 flex items-baseline justify-center space-x-1">
                      <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                      <span className="text-xs font-semibold text-slate-500">USD</span>
                      <span className="text-[10px] text-slate-400 font-mono">/ {plan.paymentType}</span>
                    </div>

                    <div className="mt-2 inline-block bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold text-slate-800">
                      🎯 {plan.creditsLabel}
                    </div>
                  </div>

                  {/* Feature list */}
                  <ul className="py-5 space-y-2.5 text-xs text-slate-600">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan)}
                    disabled={loadingPlan !== null}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 ${plan.buttonBg}`}
                  >
                    {loadingPlan === plan.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pagar {plan.price} USD</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-2">
                    Procesado de forma segura con Stripe
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee / Trust footer */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-xs">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Pagos Seguros y Encriptados SSL (Stripe)</p>
                <p className="text-[11px] text-slate-500">Tus datos bancarios nunca se almacenan en nuestros servidores.</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-slate-400 text-xs font-mono">
              <span className="flex items-center space-x-1">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Pago Único</span>
              </span>
              <span className="flex items-center space-x-1">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sin Caducidad</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
