import React, { useState } from 'react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === '1111' && password === '0000') {
      onLogin();
    } else {
      setError('Invalid User ID or Password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8" style={{ backgroundColor: '#DADBDF' }}>
      
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden min-h-[500px] relative">
        
        {/* Left Side: Image with Welcome text */}
        <div className="w-full md:w-1/2 relative bg-[#020D20] hidden md:block">
          <img 
            src="https://api.mrcscommunity.org.my/uploads/event/20230929-d06uyi-ipk.jpg" 
            alt="MRCS Event" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">
          
          {/* Small corner detail mimicking the image's bottom right arrow icon */}
          <div className="absolute bottom-4 right-4 bg-[#F5F5F5] p-3 rounded-xl cursor-pointer hover:bg-gray-200 transition">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M5 19L19 5"></path><path d="M5 5h14v14"></path>
             </svg>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-sm mx-auto"
          >
            <h2 className="text-4xl font-medium text-center text-charcoal mb-12">Login</h2>
            
            <form onSubmit={handleLogin} className="space-y-8">
              
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder=" "
                  className="peer w-full bg-transparent border-0 border-b-2 border-gray-300 py-2 text-charcoal focus:outline-none focus:ring-0 focus:border-[#020B2F] transition-colors"
                />
                <label className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#020B2F] -top-4 text-xs font-medium">
                  User Id
                </label>
              </div>

              <div className="relative mt-10">
                <div className="flex justify-between items-end absolute right-0 -top-6">
                  <a href="#" className="text-[#020B2F] hover:text-blue-800 text-[11px] font-bold">
                    Forgot password?
                  </a>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="peer w-full bg-transparent border-0 border-b-2 border-gray-300 py-2 text-charcoal focus:outline-none focus:ring-0 focus:border-[#020B2F] transition-colors"
                />
                <label className="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#020B2F] -top-4 text-xs font-medium">
                  Password
                </label>
              </div>

              {error && (
                <p className="text-brand-red text-sm mt-2 font-medium">{error}</p>
              )}

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-[#020B2F] hover:bg-[#0A1945] text-white font-medium py-3.5 rounded-xl transition-all shadow-md"
                >
                  Login
                </button>
              </div>

              <div className="text-center pt-8">
                <p className="text-[13px] text-gray-600 font-medium">
                  Don't have an account? <a href="#" className="text-[#020B2F] hover:underline hover:text-blue-800 ml-1">Sign up</a>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
        
      </div>
    </div>
  );
};
