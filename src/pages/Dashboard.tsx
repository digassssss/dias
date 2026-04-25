/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  TrendingUp, 
  ArrowRight,
  Clock,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../db';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    students: 0,
    exams: 0,
    questions: 0,
    results: 0,
    myResults: 0
  });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [students, exams, questions, results] = await Promise.all([
        db.getStudents(),
        db.getExams(),
        db.getQuestions(),
        db.getResults()
      ]);
      setCounts({
        students: students.length,
        exams: exams.length,
        questions: questions.length,
        results: results.length,
        myResults: results.filter(r => r.studentId === user.id).length
      });
    };
    load();
  }, [user]);
  
  if (!user) return null;

  const stats = {
    admin: [
      { label: 'Total Siswa', value: counts.students, icon: Users, color: 'text-slate-900', trend: '+12 minggu ini', trendColor: 'text-green-600' },
      { label: 'Ujian Aktif', value: counts.exams, icon: ClipboardCheck, color: 'text-brand-red', trend: '2 akan berakhir hari ini', trendColor: 'text-slate-400' },
      { label: 'Total Bank Soal', value: counts.questions, icon: BookOpen, color: 'text-slate-900', trend: 'Dari 12 mata pelajaran', trendColor: 'text-slate-400' },
      { label: 'Rata-rata Nilai', value: '78.4', icon: TrendingUp, color: 'text-slate-900', trend: '-2.1% dari bulan lalu', trendColor: 'text-brand-red' },
    ],
    guru: [
       { label: 'Soal Saya', value: counts.questions, icon: BookOpen, color: 'text-slate-900', trend: 'Bank soal aktif', trendColor: 'text-slate-400' },
       { label: 'Ujian Dibuat', value: counts.exams, icon: ClipboardCheck, color: 'text-brand-red', trend: 'Total jadwal ujian', trendColor: 'text-slate-400' },
       { label: 'Hasil Diperiksa', value: counts.results, icon: CheckCircle2, color: 'text-slate-900', trend: 'Laporan selesai', trendColor: 'text-green-600' },
       { label: 'Rata-rata Nilai', value: '82.5', icon: TrendingUp, color: 'text-slate-900', trend: 'Semua siswa', trendColor: 'text-slate-400' },
    ],
    siswa: [
      { label: 'Ujian Tersedia', value: counts.exams, icon: ClipboardCheck, color: 'text-brand-red', trend: 'Cek jadwal hari ini', trendColor: 'text-slate-400' },
      { label: 'Ujian Selesai', value: counts.myResults, icon: CheckCircle2, color: 'text-slate-900', trend: 'Hasil pengerjaan', trendColor: 'text-green-600' },
      { label: 'Skor Rata-rata', value: '85', icon: TrendingUp, color: 'text-slate-900', trend: 'Performa akademik', trendColor: 'text-slate-400' },
      { label: 'Peringkat', value: '#12', icon: GraduationCap, color: 'text-slate-900', trend: 'Dari seantero sekolah', trendColor: 'text-slate-400' },
    ]
  };

  const currentStats = stats[user.role] || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Halo, {user.name}!</h2>
          <p className="text-slate-500">Selamat datang di dashboard {user.role} SMK Prima Unggul.</p>
        </div>
        {user.role !== 'siswa' && (
          <Link to="/app/exams" className="bg-brand-red hover:bg-brand-red-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            + Buat Ujian Baru
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.value}</h3>
            {stat.trend && <p className={cn("text-xs font-bold mt-2", stat.trendColor)}>{stat.trend}</p>}
          </div>
        ))}
      </div>

      {user.role === 'siswa' ? (
        <SiswaQuickActions />
      ) : (
        <AdminGuruQuickActions role={user.role} />
      )}

      {/* Recent Activity placeholder with Design Table Look */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Clock className="text-brand-red" size={20} />
            Aktivitas Sistem Terbaru
          </h3>
          <button className="text-sm text-brand-red font-semibold hover:underline">Lihat Semua</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
               <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                 <ClipboardCheck size={20} />
               </div>
               <div className="flex-1">
                 <p className="font-semibold text-sm text-slate-700">Sistem diperbarui ke versi 2.1.0</p>
                 <p className="text-xs text-slate-400 font-medium">Update pada: Senin, 24 Mei 2024</p>
               </div>
               <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Info</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SiswaQuickActions = () => (
  <div className="grid md:grid-cols-2 gap-6">
    <Link to="/app/my-exams" className="group bg-white p-8 rounded-xl text-slate-900 border border-slate-200 shadow-sm hover:shadow-md transition-all flex justify-between items-center border-l-4 border-l-brand-red">
      <div>
        <h3 className="text-xl font-bold mb-2">Kerjakan Ujian</h3>
        <p className="text-slate-500">Lihat jadwal dan mulai ujian Anda.</p>
      </div>
      <div className="bg-slate-50 p-4 rounded-xl group-hover:bg-brand-red group-hover:text-white transition-all">
        <ArrowRight size={24} />
      </div>
    </Link>
    <Link to="/app/my-results" className="group bg-white p-8 rounded-xl text-slate-900 border border-slate-200 shadow-sm hover:shadow-md transition-all flex justify-between items-center border-l-4 border-l-blue-600">
      <div>
        <h3 className="text-xl font-bold mb-2">Lihat Hasil</h3>
        <p className="text-slate-500">Semua riwayat nilai ujian Anda.</p>
      </div>
      <div className="bg-slate-50 p-4 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
        <TrendingUp size={24} />
      </div>
    </Link>
  </div>
);

const AdminGuruQuickActions = ({ role }: { role: string }) => (
  <div className="grid md:grid-cols-3 gap-6">
    <Link to="/app/questions" className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-brand-red transition-all flex flex-col items-start group">
       <div className="bg-slate-50 p-3 rounded-lg text-slate-600 mb-4 group-hover:bg-brand-red group-hover:text-white transition-all">
         <BookOpen size={24} />
       </div>
       <h4 className="font-bold text-slate-900">Manajemen Bank Soal</h4>
       <p className="text-xs text-slate-500 mt-2 font-medium">Buat dan kelola butir soal ujian dari berbagai mata pelajaran.</p>
    </Link>
    <Link to="/app/exams" className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-brand-red transition-all flex flex-col items-start group">
       <div className="bg-slate-50 p-3 rounded-lg text-slate-600 mb-4 group-hover:bg-brand-red group-hover:text-white transition-all">
         <ClipboardCheck size={24} />
       </div>
       <h4 className="font-bold text-slate-900">Jadwalkan Ujian</h4>
       <p className="text-xs text-slate-500 mt-2 font-medium">Buat jadwal ujian baru dan atur durasi pengerjaan siswa.</p>
    </Link>
    <Link to="/app/results" className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-brand-red transition-all flex flex-col items-start group">
       <div className="bg-slate-50 p-3 rounded-lg text-slate-600 mb-4 group-hover:bg-brand-red group-hover:text-white transition-all">
         <CheckCircle2 size={24} />
       </div>
       <h4 className="font-bold text-slate-900">Laporan & Hasil</h4>
       <p className="text-xs text-slate-500 mt-2 font-medium">Analisis hasil ujian siswa secara otomatis dan akurat.</p>
    </Link>
  </div>
);
