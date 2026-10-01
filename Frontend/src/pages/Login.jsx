import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, BarChart3, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSSOLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Panel - Deep teal brand panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 text-white" style={{ background: 'linear-gradient(160deg, #0a3d44 0%, #155e68 40%, #47A2B0 100%)' }}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {/* Logo on white background so it looks clean */}
        <div className="relative z-10 inline-block bg-white px-4 py-2 brand-corner" style={{ width: 'fit-content' }}>
          <img src="/emids-logo.png" alt="Emids" className="h-7 w-auto" />
        </div>

        <div className="relative z-10 max-w-lg">
          <p className="brand-plate text-xl lg:text-2xl text-[#ABC7CA] tracking-[0.15em] mb-4 font-bold">
            LEAVE MANAGEMENT PORTAL
          </p>
          <h1 className="text-5xl font-bold leading-[1.15] mb-6">
            Your time off,<br />
            managed with<br />
            <span className="text-[#ABC7CA]">precision.</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-md mb-10">
            A single destination to apply, track, and manage your leave balances. Built for employees who value clarity and speed.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-none brand-corner border border-white/20 flex items-center justify-center bg-white/5">
                <Clock className="w-5 h-5 text-[#ABC7CA]" strokeWidth={1.5} />
              </div>
              <span className="text-base">Apply and track time off in seconds</span>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-none brand-corner border border-white/20 flex items-center justify-center bg-white/5">
                <CheckCircle className="w-5 h-5 text-[#ABC7CA]" strokeWidth={1.5} />
              </div>
              <span className="text-base">Real-time leave balance visibility</span>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-none brand-corner border border-white/20 flex items-center justify-center bg-white/5">
                <BarChart3 className="w-5 h-5 text-[#ABC7CA]" strokeWidth={1.5} />
              </div>
              <span className="text-base">Policy compliance built right in</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/40 text-xs brand-plate">
          &copy; 2026 EMIDS TECHNOLOGIES. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#F2F2F0]">
        <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #9DC6CC 0%, #72B3BE 50%, #57A6B3 100%)' }}></div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            {/* Mobile logo */}
            <div className="lg:hidden mb-8">
              <img src="/emids-logo.png" alt="Emids" className="h-7 w-auto" />
            </div>

            <h2 className="text-3xl font-bold text-[#0E0E0E] mb-2">Welcome back.</h2>
            <p className="text-[#777] mb-8 text-base">Sign in to access your Leave Management Portal</p>

            <div className="space-y-5">
              <div>
                <label className="block brand-plate text-[10px] text-[#555] mb-2 tracking-widest">COMPANY EMAIL</label>
                <input 
                  type="email" 
                  placeholder="you@emids.com" 
                  disabled
                  className="w-full px-4 py-3 border border-[#DDD] bg-white focus:outline-none focus:border-[#47A2B0] text-[#0E0E0E] opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block brand-plate text-[10px] text-[#555] mb-2 tracking-widest">PASSWORD</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  disabled
                  className="w-full px-4 py-3 border border-[#DDD] bg-white focus:outline-none focus:border-[#47A2B0] text-[#0E0E0E] opacity-50 cursor-not-allowed"
                />
              </div>
              
              <button disabled className="w-full py-3 bg-[#47A2B0] text-white font-bold brand-plate text-xs opacity-50 cursor-not-allowed tracking-widest">
                SIGN IN
              </button>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#DDD]"></div>
                </div>
                <div className="relative flex justify-center text-xs brand-plate">
                  <span className="px-4 bg-[#F2F2F0] text-[#999]">OR CONTINUE WITH</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSSOLogin}
                disabled={isLoading}
                aria-busy={isLoading}
                className={`w-full flex items-center justify-center gap-3 py-3 border-2 border-[#47A2B0] font-bold transition-all brand-plate text-xs tracking-wider ${
                  isLoading
                    ? 'bg-[#47A2B0] text-white cursor-wait opacity-95'
                    : 'bg-transparent text-[#0E0E0E] hover:bg-[#47A2B0] hover:text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" strokeWidth={2} />
                    SIGNING IN...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 23 23" aria-hidden>
                      <rect x="0" y="0" width="11" height="11" fill="#F25022" />
                      <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
                      <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
                      <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
                    </svg>
                    SIGN IN WITH EMIDS SSO
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-[#999] text-xs mt-8">
              Need help? Contact <span className="text-[#47A2B0] font-medium">IT Support</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
