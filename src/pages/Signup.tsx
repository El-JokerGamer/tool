import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface SignupProps {
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [gameId, setGameId] = useState('');
  const [serial, setSerial] = useState('');
  const [step, setStep] = useState<'input' | 'serial' | 'success'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await signup(gameId);
    if (result.success && result.serial) {
      setSerial(result.serial);
      setStep('serial');
    } else {
      setError(result.error || 'حدث خطأ أثناء التسجيل');
    }
    setLoading(false);
  };

  const handleConfirm = () => {
    setStep('success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md slide-in">
        <div className="glass-card rounded-2xl p-8 glow-border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-4">
              <i className="fa-solid fa-user-plus text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold gradient-text mb-2">إنشاء حساب جديد</h1>
            <p className="text-slate-400 text-sm">ربط حسابك في اللعبة بالأداة</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs text-emerald-400">متصل بـ Supabase</span>
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'input' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'}`}>
              {step === 'input' ? '1' : <i className="fa-solid fa-check"></i>}
            </div>
            <div className="w-8 h-0.5 bg-slate-600"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'serial' ? 'bg-indigo-500 text-white' : step === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
              {step === 'serial' ? '2' : step === 'success' ? <i className="fa-solid fa-check"></i> : '2'}
            </div>
            <div className="w-8 h-0.5 bg-slate-600"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
              3
            </div>
          </div>

          {/* Step 1: Input Game ID */}
          {step === 'input' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <i className="fa-solid fa-gamepad ml-2 text-indigo-400"></i>
                  ID حسابك في اللعبة
                </label>
                <input
                  type="text"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  placeholder="أدخل ID حسابك"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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
                className="w-full py-3 rounded-xl bg-gradient-to-l from-purple-600 to-indigo-500 text-white font-bold text-sm hover:from-purple-500 hover:to-indigo-400 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>جاري حفظ البيانات في Supabase...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>توليد السيريال</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Show Serial */}
          {step === 'serial' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <i className="fa-solid fa-circle-check text-emerald-400 text-2xl mb-2"></i>
                <p className="text-emerald-300 text-sm font-medium">تم حفظ بياناتك في قاعدة البيانات!</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <i className="fa-solid fa-key ml-2 text-amber-400"></i>
                  السيريال الخاص بك (محفوظ في Supabase)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={serial}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/30 text-amber-300 font-mono tracking-wider text-center text-lg"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(serial)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                  >
                    <i className="fa-solid fa-copy text-slate-300 text-sm"></i>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5"></i>
                  <div>
                    <p className="text-amber-300 text-sm font-medium mb-1">مهم جداً!</p>
                    <p className="text-amber-200/70 text-xs leading-relaxed">
                      احفظ هذا السيريال وأرسله للأدمن لتفعيل حسابك. السيريال مربوط ببصمة جهازك ولا يمكن استخدامه من جهاز آخر.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-3 rounded-xl bg-gradient-to-l from-emerald-600 to-emerald-500 text-white font-bold text-sm hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-check"></i>
                <span>حفظت السيريال - متابعة</span>
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center space-y-5">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center pulse-glow">
                <i className="fa-solid fa-check text-emerald-400 text-3xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">تم إنشاء الحساب بنجاح!</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  حسابك الآن في انتظار التفعيل من الأدمن.
                  <br />
                  سيتم إشعارك عند التفعيل.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">الحالة:</span>
                    <span className="text-amber-400 font-medium">في انتظار التفعيل</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID اللعبة:</span>
                    <span className="text-white font-mono">{gameId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">قاعدة البيانات:</span>
                    <span className="text-emerald-400 font-medium">Supabase ✓</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onSwitchToLogin}
                className="w-full py-3 rounded-xl bg-gradient-to-l from-indigo-600 to-indigo-500 text-white font-bold text-sm hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>الذهاب لتسجيل الدخول</span>
              </button>
            </div>
          )}

          {/* Switch to Login */}
          {step !== 'success' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                لديك حساب بالفعل؟{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  سجّل دخولك
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
