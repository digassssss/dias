/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, ArrowRight, ShieldCheck, Zap, Monitor } from 'lucide-react';

export default function LandingPage() {
  const majors = [
    { code: 'TKJ', name: 'Teknik Komputer & Jaringan' },
    { code: 'DKV', name: 'Desain Komunikasi Visual' },
    { code: 'AK', name: 'Akuntansi' },
    { code: 'BC', name: 'Broadcasting' },
    { code: 'MPLB', name: 'Manajemen Perkantoran & Layanan Bisnis' },
    { code: 'BD', name: 'Bisnis Digital' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200 ring-2 ring-slate-100 ring-offset-2">
              <GraduationCap size={22} className="text-brand-red" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-slate-900 leading-none tracking-tight">PRIMA <span className="text-brand-red">CBT</span></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">SMK Prima Unggul</span>
            </div>
          </div>
          <Link 
            to="/login" 
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-sm shadow-slate-200"
          >
            Masuk Sistem
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase bg-slate-50 border border-slate-200 rounded-full shadow-inner"
          >
            <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
            Empowering Digital Education
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]"
          >
            Sistem Evaluasi <br/> <span className="text-brand-red">Belajar Digital</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
             Computer Based Test (CBT) yang dirancang khusus untuk memenuhi standar kompetensi lulusan SMK Prima Unggul. Terintegrasi, transparan, dan akuntabel.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/login" className="flex items-center gap-3 bg-brand-red text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-red-dark transition-all shadow-xl shadow-brand-red/20 active:scale-95">
              Akses Portal Ujian <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
        
        {/* Background Grid Accent */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} 
        />
      </header>

      {/* Majors */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Pilih Kompetensi Keahlian</h2>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Jurusan Unggulan</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {majors.map((major, idx) => (
              <motion.div
                key={major.code}
                whileHover={{ y: -4, borderColor: '#d7232e' }}
                className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-2xl font-black text-slate-900 mb-1 group-hover:text-brand-red transition-colors">{major.code}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{major.name}</div>
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-brand-red group-hover:bg-brand-red/5 transition-all">
                  <Monitor size={24} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-brand-red rounded-xl flex items-center justify-center shadow-inner">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Integritas Terjamin</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Keamanan tingkat tinggi untuk memastikan setiap nilai yang dihasilkan adalah murni kecerdasan siswa.</p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-brand-red rounded-xl flex items-center justify-center shadow-inner">
                <Zap size={36} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Hasil Instan</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Siswa tidak perlu menunggu lama untuk melihat potret kemampuan mereka setelah menekan tombol selesai.</p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-brand-red rounded-xl flex items-center justify-center shadow-inner">
                <Zap size={36} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Kesiapan Industri</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Membiasakan siswa dengan platform digital untuk persiapan menghadapi dunia kerja yang serba teknologi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-10 pb-10 border-b border-slate-800 w-full justify-center">
             <GraduationCap className="text-brand-red" size={40} />
             <div className="text-left">
               <span className="text-3xl font-black block leading-none tracking-tighter">PRIMA <span className="text-brand-red">CBT</span></span>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Official School System</span>
             </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 text-sm text-slate-400 font-medium max-w-3xl mx-auto">
            <div className="space-y-4">
              <h4 className="text-white font-black uppercase text-xs tracking-widest">Kontak Sekolah</h4>
              <p>Jl. Raya Pendidikan Utama No. 88, Cluster Unggul. <br/> Kota Masa Depan, Indonesia.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-black uppercase text-xs tracking-widest">Informasi</h4>
              <p>Email: info@smkprimaunggul.sch.id<br/>Telp: (021) 8888 9999</p>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-slate-900 text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
            &copy; 2026 SMK Prima Unggul | Dedicated to Academic Excellence
          </div>
        </div>
      </footer>
    </div>
  );
}
