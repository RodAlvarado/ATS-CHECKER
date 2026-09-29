import React, { useState } from "react";
import { X, CheckCircle2, Zap, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { claimPaymentManually } from "../firebase";

interface SyncPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userEmail: string | null;
  onSuccess: (creditsAdded: number, planName: string) => void;
}

export const SyncPaymentModal: React.FC<SyncPaymentModalProps> = ({
  isOpen,
  onClose,
  userId,
  userEmail,
  onSuccess,
}) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSync = async (planKey: "basico" | "postulante" | "empleo_usa", planLabel: string) => {
    if (!userId) {
      setError("Debes haber iniciado sesión para sincronizar tus revisiones.");
      return;
    }

    setLoadingPlan(planKey);
    setError(null);

    try {
      const res = await claimPaymentManually(
        userId,
        planKey,
        `Sincronización confirmada por el usuario (${userEmail || "email"})`
      );

      // Clean pending local storage checkouts
      try {
        localStorage.removeItem("pending_stripe_checkout");
        localStorage.removeItem("pending_stripe_session");
      } catch (e) {
        // Ignore
      }

      onSuccess(res.creditsAdded, res.planName);
      onClose();
    } catch (err: any) {
      console.error("Error al sincronizar pago:", err);
      setError(err?.message || "Hubo un problema al conectar con la base de datos. Intenta nuevamente.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <RefreshCw className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Sincronizar y Acreditar Pago</h3>
              <p className="text-xs text-blue-200">Recarga inmediata de revisiones realizadas en Stripe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Si realizaste un pago a través de Stripe y aún no ves reflejado tu saldo de revisiones, selecciona el paquete que pagaste para acreditarlo de inmediato a tu cuenta ({userEmail}):
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            {/* Opción 1: Básico */}
            <button
              onClick={() => handleSync("basico", "Plan Básico")}
              disabled={loadingPlan !== null}
              className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between transition-all text-left cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-100 group-hover:bg-blue-100 rounded-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">Plan Básico ($1 USD)</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">+1 Revisión</span>
                  </div>
                  <p className="text-xs text-slate-500">1 Escaneo completo frente a filtros ATS de USA</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs font-bold text-blue-600">
                <span>{loadingPlan === "basico" ? "Acreditando..." : "Acreditar"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Opción 2: Postulante */}
            <button
              onClick={() => handleSync("postulante", "Plan Postulante")}
              disabled={loadingPlan !== null}
              className="w-full p-4 rounded-xl border-2 border-blue-300 hover:border-blue-600 bg-blue-50/30 hover:bg-blue-50/70 flex items-center justify-between transition-all text-left cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg text-blue-700 transition-colors">
                  <Zap className="w-5 h-5 fill-blue-500 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">Plan Postulante ($5 USD)</span>
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">+6 Revisiones</span>
                  </div>
                  <p className="text-xs text-slate-500">6 Escaneos completos frente a filtros ATS de USA</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs font-bold text-blue-700">
                <span>{loadingPlan === "postulante" ? "Acreditando..." : "Acreditar"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Opción 3: Empleo USA */}
            <button
              onClick={() => handleSync("empleo_usa", "Plan Empleo en USA")}
              disabled={loadingPlan !== null}
              className="w-full p-4 rounded-xl border-2 border-amber-300 hover:border-amber-500 bg-amber-50/30 hover:bg-amber-50/70 flex items-center justify-between transition-all text-left cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 group-hover:bg-amber-200 rounded-lg text-amber-800 transition-colors">
                  <Zap className="w-5 h-5 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">Plan Empleo en USA ($10 USD)</span>
                    <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded-full">+12 Revisiones</span>
                  </div>
                  <p className="text-xs text-slate-500">12 Escaneos completos frente a filtros ATS de USA</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs font-bold text-amber-700">
                <span>{loadingPlan === "empleo_usa" ? "Acreditando..." : "Acreditar"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <div className="pt-2 text-center text-xs text-slate-400">
            Tus revisiones se acumulan en tu saldo y nunca caducan.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncPaymentModal;
