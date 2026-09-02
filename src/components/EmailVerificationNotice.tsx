import React, { useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { resendVerificationEmail, logoutUser, syncUserProfile } from "../firebase";
import { Mail, RefreshCw, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import AtsCheckerLogo from "./AtsCheckerLogo";

interface EmailVerificationNoticeProps {
  user: FirebaseUser;
  onVerified: () => void;
}

export const EmailVerificationNotice: React.FC<EmailVerificationNoticeProps> = ({
  user,
  onVerified,
}) => {
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckStatus = async () => {
    setChecking(true);
    setError(null);
    setMessage(null);
    try {
      await user.reload();
      if (user.emailVerified) {
        await syncUserProfile(user);
        onVerified();
      } else {
        setError(
          "Tu correo aún no figura como verificado. Por favor abre el enlace que te enviamos a tu bandeja de entrada o carpeta de spam y vuelve a presionar este botón."
        );
      }
    } catch (err: any) {
      console.error(err);
      setError("Error al comprobar el estado. Intenta nuevamente en unos segundos.");
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    setMessage(null);
    try {
      await resendVerificationEmail(user);
      setMessage("¡Correo de verificación reenviado con éxito! Por favor revisa tu bandeja de entrada y spam.");
    } catch (err: any) {
      console.error(err);
      if (err?.code === "auth/too-many-requests") {
        setError("Por favor espera unos momentos antes de solicitar otro correo de verificación.");
      } else {
        setError("No se pudo reenviar el correo. Por favor intenta más tarde.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 bg-white border border-amber-200 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
      <div className="bg-linear-to-r from-amber-500 via-amber-600 to-amber-700 p-6 text-white text-center">
        <div className="flex justify-center mb-2">
          <AtsCheckerLogo size="md" showSubtitle={false} />
        </div>
        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3 backdrop-blur-xs">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">
          Validación de Correo Requerida
        </h3>
        <p className="text-xs text-amber-100 mt-1 max-w-sm mx-auto">
          Para garantizar la seguridad de tus análisis y créditos, debes validar tu correo electrónico antes de usar la plataforma.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-5 text-center">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500 mb-1">Hemos enviado un enlace de confirmación a:</p>
          <p className="text-sm font-bold text-slate-900 font-mono">{user.email}</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs text-left">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2 text-emerald-800 text-xs text-left">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {checking ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>Ya hice clic en el enlace (Comprobar estado)</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-xs text-slate-600 hover:text-blue-600 font-semibold underline flex items-center space-x-1 cursor-pointer disabled:opacity-50"
            >
              {resending ? (
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
              ) : null}
              <span>Reenviar correo de verificación</span>
            </button>

            <button
              type="button"
              onClick={logoutUser}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center space-x-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión / Cambiar correo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationNotice;
