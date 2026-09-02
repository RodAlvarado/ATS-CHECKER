import React, { useState } from "react";
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  sendPasswordReset,
} from "../firebase";
import { X, Mail, Lock, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import AtsCheckerLogo from "./AtsCheckerLogo";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<"login" | "register" | "reset">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (mode === "register") {
        if (password.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres.");
        }
        await registerWithEmail(email.trim(), password);
        setInfoMessage(
          "¡Cuenta creada con éxito! Hemos enviado un correo de verificación a tu bandeja de entrada. Valídalo para comenzar a usar la plataforma."
        );
        onSuccess();
      } else if (mode === "login") {
        await loginWithEmail(email.trim(), password);
        onSuccess();
        onClose();
      } else if (mode === "reset") {
        await sendPasswordReset(email.trim());
        setInfoMessage(
          "Hemos enviado las instrucciones para restablecer tu contraseña a tu correo electrónico."
        );
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = err?.message || "Ocurrió un error al procesar tu solicitud.";
      if (msg.includes("auth/email-already-in-use")) {
        msg = "Ya existe una cuenta registrada con este correo. Inicia sesión.";
      } else if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password")) {
        msg = "Correo o contraseña incorrectos. Por favor verifica tus credenciales.";
      } else if (msg.includes("auth/user-not-found")) {
        msg = "No existe ninguna cuenta asociada a este correo.";
      } else if (msg.includes("auth/invalid-email")) {
        msg = "Por favor ingresa un correo electrónico válido.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Google login error:", err);
      setError("No se pudo iniciar sesión con Google. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header decoration */}
        <div className="bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-3">
            <AtsCheckerLogo size="md" showSubtitle={false} />
          </div>

          <h3 className="text-xl font-bold tracking-tight">
            {mode === "login" && "Iniciar Sesión"}
            {mode === "register" && "Crear Cuenta de Postulante"}
            {mode === "reset" && "Recuperar Contraseña"}
          </h3>
          <p className="text-xs text-blue-200/80 mt-1 max-w-xs mx-auto">
            Acceso profesional a evaluación y optimización de CVs para el mercado de Estados Unidos.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          {mode !== "reset" && (
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl font-medium text-xs text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                  <span className="bg-white px-2">o con tu correo</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {mode !== "reset" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Contraseña
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => { setMode("reset"); setError(null); }}
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>
                {mode === "register" && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Mínimo 6 caracteres. Te enviaremos un correo de verificación.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === "login" && "Iniciar Sesión"}
                    {mode === "register" && "Registrarme y Validar Correo"}
                    {mode === "reset" && "Enviar Enlace de Recuperación"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            {mode === "login" && (
              <p>
                ¿Aún no tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("register"); setError(null); }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            )}

            {mode === "register" && (
              <p>
                ¿Ya tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(null); }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Inicia sesión
                </button>
              </p>
            )}

            {mode === "reset" && (
              <p>
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(null); }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Volver al inicio de sesión
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
