// 'use client';
// import React, { useState } from 'react';
// import { Lang } from '@/lib/types';
// import { DICT } from '@/lib/i18n';

// interface AuthModalProps {
//   isOpen: boolean;
//   initialTab: 'guest' | 'account';
//   lang: Lang;
//   onClose: () => void;
//   onSuccess: (user: { name: string } | null, type: 'guest' | 'account') => void;
// }

// export default function AuthModal({ isOpen, initialTab, lang, onClose, onSuccess }: AuthModalProps) {
//   const t = DICT[lang];
//   const [activeTab, setActiveTab] = useState<'guest' | 'account'>(initialTab);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [guestName, setGuestName] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     // Simulating smooth premium server animation validation delays
//     setTimeout(() => {
//       setIsLoading(false);
//       if (activeTab === 'guest') {
//         const username = guestName.trim() || (lang === 'en' ? 'Anonymous Scout' : 'Éclaireur Anonyme');
//         onSuccess({ name: username }, 'guest');
//       } else {
//         const username = name.trim() || email.split('@')[0];
//         onSuccess({ name: username }, 'account');
//       }
//       onClose();
//     }, 900);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* Premium backdrop blur ring mask */}
//       <div 
//         onClick={onClose} 
//         className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-opacity duration-300"
//       />

//       {/* Main Authentication Card */}
//       <div className="relative w-full max-w-md bg-white/95 rounded-3xl border border-zinc-200/80 shadow-2xl overflow-hidden z-10 flex flex-col transform transition-transform duration-300 scale-100 max-h-[90vh]">
        
//         {/* Subtle accent header graphic element */}
//         <div className="h-2 w-full bg-gradient-to-right bg-[#166534]" />

//         {/* Modal Body Container */}
//         <div className="p-6 md:p-8 overflow-y-auto">
//           {/* Close Action Control */}
//           <button 
//             onClick={onClose}
//             className="absolute top-5 right-5 w-8 h-8 rounded-full border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 shadow-sm flex items-center justify-center text-xs transition duration-200 cursor-pointer"
//           >
//             ✕
//           </button>

//           {/* Identity Branding Header */}
//           <div className="flex flex-col items-center text-center mb-6 mt-2">
//             <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#166534] grid place-items-center font-black text-xl shadow-inner mb-3">
//               🌱
//             </div>
//             <h2 className="text-xl font-bold tracking-tight text-zinc-900">
//               Join ParcPlay MTL
//             </h2>
//             <p className="text-xs text-zinc-500 mt-1 max-w-[260px]">
//               Contribute data, verify active crowdsourced conditions, and log ecosystem milestones.
//             </p>
//           </div>

//           {/* Premium Tab Bar Segment */}
//           <div className="grid grid-cols-2 p-1 bg-zinc-100/80 rounded-xl border border-zinc-200/40 mb-6">
//             <button
//               type="button"
//               onClick={() => setActiveTab('guest')}
//               className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition duration-200 cursor-pointer ${
//                 activeTab === 'guest'
//                   ? 'bg-white text-zinc-900 shadow-sm'
//                   : 'text-zinc-500 hover:text-zinc-800'
//               }`}
//             >
//               🚀 {t.guestContinue || "Guest Access"}
//             </button>
//             <button
//               type="button"
//               onClick={() => setActiveTab('account')}
//               className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition duration-200 cursor-pointer ${
//                 activeTab === 'account'
//                   ? 'bg-[#166534] text-white shadow-sm'
//                   : 'text-zinc-500 hover:text-zinc-800'
//               }`}
//             >
//               🔒 {t.createAccount || "Verified Account"}
//             </button>
//           </div>

//           {/* Contextual Form Content Block */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {activeTab === 'guest' ? (
//               /* Guest Form Field */
//               <div className="space-y-1.5 animate-fadeIn">
//                 <label className="text-[11px] uppercase tracking-wide font-bold text-zinc-500">
//                   {lang === 'en' ? "Your Nickname" : "Votre pseudonyme"}
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     required
//                     placeholder="e.g., StrikeGreen_514"
//                     value={guestName}
//                     onChange={(e) => setGuestName(e.target.value)}
//                     className="w-full border border-zinc-200/80 rounded-xl px-4 py-3 text-sm bg-white placeholder-zinc-400 font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition"
//                   />
//                   <span className="absolute right-4 top-3.5 text-sm opacity-40">⚽</span>
//                 </div>
//                 <p className="text-[11px] text-zinc-400 pt-1 leading-normal">
//                   Guest accounts bypass passwords to log quick data fields locally, stored instantly onto your machine’s cache memory.
//                 </p>
//               </div>
//             ) : (
//               /* Premium Verified Member Registration Fields */
//               <div className="space-y-4 animate-fadeIn">
//                 <div className="space-y-1.5">
//                   <label className="text-[11px] uppercase tracking-wide font-bold text-zinc-500">
//                     {lang === 'en' ? "Full Name" : "Nom complet"}
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="Gilbert ..."
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="w-full border border-zinc-200/80 rounded-xl px-4 py-3 text-sm bg-white placeholder-zinc-400 font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition"
//                   />
//                 </div>
                
//                 <div className="space-y-1.5">
//                   <label className="text-[11px] uppercase tracking-wide font-bold text-zinc-500">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     required
//                     placeholder="scout@parcplay.ca"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full border border-zinc-200/80 rounded-xl px-4 py-3 text-sm bg-white placeholder-zinc-400 font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition"
//                   />
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="text-[11px] uppercase tracking-wide font-bold text-zinc-500">
//                     Secure Password
//                   </label>
//                   <input
//                     type="password"
//                     required
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full border border-zinc-200/80 rounded-xl px-4 py-3 text-sm bg-white placeholder-zinc-400 font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Primary Multi-State Processing Action Button Control */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full mt-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
//                 isLoading 
//                   ? 'bg-zinc-100 border border-zinc-200 text-zinc-400 shadow-none cursor-not-allowed'
//                   : activeTab === 'account'
//                     ? 'bg-[#166534] hover:bg-[#115329] text-white shadow-emerald-900/10'
//                     : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/10'
//               }`}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="w-4 h-4 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin" />
//                   {lang === 'en' ? "Authenticating Grid..." : "Authentification..."}
//                 </>
//               ) : activeTab === 'guest' ? (
//                 "Explore as Guest ➔"
//               ) : (
//                 "Create Verified Account ✓"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
