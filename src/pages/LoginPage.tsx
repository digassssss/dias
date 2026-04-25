/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { GraduationCap, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Gagal login. Periksa kembali email dan password Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-brand-red rounded flex items-center justify-center text-white font-bold text-xl mb-4 shadow-sm">
              P
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">SMK Prima Unggul</h1>
            <p className="text-slate-500 text-sm text-center mt-1">Computer Based Test System</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-brand-red/5 text-brand-red p-4 rounded-lg flex items-start gap-3 mb-6 text-sm border border-brand-red/10 animate-shake"
            >
              <AlertCircle size={20} className="shrink-0" />
              <span className="font-semibold">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email Sekolah</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@smk.sch.id"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 outline-none transition-all placeholder:text-slate-300 text-sm"
              />
            </div>
            <div className="pb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Kata Sandi</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 outline-none transition-all placeholder:text-slate-300 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3.5 rounded-lg font-bold text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  MEMPROSES...
                </>
              ) : (
                <>
                  MASUK KE SYSTEM <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Hubungi Administrator jika kendala login berlanjut.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center space-y-4">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Akun Demo Tersedia:</div>
           <div className="flex flex-wrap justify-center gap-2">
             <button onClick={() => {setEmail('admin@smk.sch.id'); setPassword('123456');}} className="px-3 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-500 hover:border-brand-red hover:text-brand-red transition-colors">ADMIN</button>
             <button onClick={() => {setEmail('guru@smk.sch.id'); setPassword('123456');}} className="px-3 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-500 hover:border-brand-red hover:text-brand-red transition-colors">GURU</button>
             <button onClick={() => {setEmail('siswa@smk.sch.id'); setPassword('123456');}} className="px-3 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-500 hover:border-brand-red hover:text-brand-red transition-colors">SISWA</button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
