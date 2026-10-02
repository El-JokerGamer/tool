import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onLoginSuccess }) => {
  const { login } = useAuth();
  const [gameId, setGameId] = useState('');
  const [serial, setSerial] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(gameId, serial);
    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'بيانات الدخول غير صحيحة.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md slide-in">
        <div className="glass-card rounded-2xl p-8 glow-border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center mb-4">
              <i className="fa-solid fa-chart-line text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold gradient-text mb-2">Eclesiar Economic Dashboard</h1>
            <p className="text-slate-400 text-sm">لوحة تحليل الاقتصاد - لعبة Eclesiar</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs text-emerald-400">متصل بـ Supabase</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <i className="fa-solid fa-gamepad ml-2 text-indigo-400"></i>
                ID اللعبة
              </label>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="أدخل ID حسابك في اللعبة"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <i className="fa-solid fa-key ml-2 text-amber-400"></i>
                السيريال
              </label>
              <input
                type="text"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono tracking-wider"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-l from-indigo-600 to-indigo-500 text-white font-bold text-sm hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>جاري التحقق من قاعدة البيانات...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-6 p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <i className="fa-solid fa-shield-halved text-emerald-400"></i>
              <span>محمي بثلاث طبقات أمان: ID + سيريال + بصمة الجهاز</span>
            </div>
          </div>

          {/* Switch to Signup */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              ليس لديك حساب؟{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                سجّل الآن
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
            <p className="text-xs text-indigo-300 text-center mb-1">
              <i className="fa-solid fa-info-circle ml-1"></i>
              بيانات تجريبية للدخول (بعد تشغيل SQL):
            </p>
            <p className="text-xs text-slate-400 text-center font-mono">
              ID: 10001 | السيريال: A1B2-C3D4-E5F6-G7H8
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
