import React, { useState } from 'react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('S36231');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    } else {
      setError('Invalid User ID or Password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8" style={{ backgroundColor: '#C0182A' }}>
      
      <div className="w-full max-w-[1000px] bg-white rounded shadow-xl flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        
        {/* Left Side: Image (Tawau MRCS) */}
        <div className="w-full md:w-[55%] relative hidden md:block">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Tawau_sabah_Malaysian-Red-Crescent-01.jpg/1280px-Tawau_sabah_Malaysian-Red-Crescent-01.jpg" 
            alt="MRCS Tawau Building" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-[45%] bg-white flex flex-col relative px-8 py-10 sm:px-12">
          
          <div className="flex justify-center mb-8 w-full">
            <div className="flex gap-4 items-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/9/91/Malaysian_Red_Crescent_Society_logo.svg" 
                alt="MRCS Logo" 
                className="h-[60px] object-contain"
              />
               <div className="flex flex-col text-[#C0182A] font-bold leading-tight border-l-2 border-[#C0182A] pl-3">
                 <span className="text-[14px]">SISTEM </span>
                 <span className="text-[20px] font-black">EASY</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col flex-grow pt-4">
            <h2 className="text-[22px] text-gray-800 mb-6 font-sans">Sign in EASY</h2>

            <div className="flex justify-end mb-4">
              <span className="text-[#C0182A] text-[13px] font-medium flex items-center gap-1.5 cursor-pointer hover:underline">
                Sign in with QR 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h7v7H3z"></path>
                  <path d="M14 3h7v7h-7z"></path>
                  <path d="M14 14h7v7h-7z"></path>
                  <path d="M3 14h7v7H3z"></path>
                </svg>
              </span>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Username Box */}
              <div className="relative border-[1.5px] border-[#16445B] rounded-[3px] pt-[7px]">
                <label className="absolute -top-[11px] left-3 bg-white px-1 text-[13px] text-[#16445B]">EASY Username:</label>
                <div className="bg-[#EAF1FA] m-[2px] mt-0 h-10 flex items-center">
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent px-3 text-[15px] text-gray-800 outline-none border-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Password Box */}
              <div className="flex items-end pt-2">
                <div className="relative border border-gray-300 border-r-0 rounded-l-[3px] rounded-r-none pt-[7px] flex-grow">
                  <label className="absolute -top-[11px] left-3 bg-white px-1 text-[14px] text-gray-800 tracking-wide">Password:</label>
                  <div className="bg-[#EAF1FA] m-[2px] mt-0 mr-0 h-10 flex items-center">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent px-3 text-lg font-mono text-gray-800 outline-none border-none focus:ring-0 pb-1"
                    />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-[#16445B] w-[60px] h-[45px] flex items-center justify-center rounded-r-[3px] -ml-[1px] relative z-10 border border-[#16445B] hover:bg-[#0e2c3b] transition-colors"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                    {showPassword && (
                      <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" />
                    )}
                  </svg>
                </button>
              </div>

              {error && (
                <p className="text-brand-red text-sm mt-2 font-medium">{error}</p>
              )}

              <div className="pt-4 flex justify-center">
                <button 
                  type="submit"
                  className="bg-[#16445B] hover:bg-[#0B2536] text-white tracking-[0.08em] font-medium py-2.5 px-10 rounded-[3px] transition-colors"
                >
                  LOGIN
                </button>
              </div>
            </form>
          </div>
          
          {/* Footer Logo */}
          <div className="flex justify-end mt-12">
            <span className="text-[12px] font-bold text-brand-red uppercase tracking-wider flex items-center justify-end w-full opacity-80 gap-1">
              Malaysian Red Crescent
            </span>
          </div>

        </div>
        
      </div>
    </div>
  );
};

