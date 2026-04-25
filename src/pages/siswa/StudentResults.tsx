/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { ExamResult } from '../../types';
import { useAuth } from '../../AuthContext';
import { TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';

export default function StudentResults() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      db.getResults().then(res => {
        setResults(res.filter(r => r.studentId === user.id));
      });
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Hasil Ujian Saya</h2>
        <p className="text-gray-500">Lihat riwayat nilai dan performa ujian Anda.</p>
      </div>

      <div className="grid gap-4">
        {results.length === 0 ? (
          <div className="py-24 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <TrendingUp size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-medium italic">Belum ada hasil ujian yang tersedia di sistem.</p>
          </div>
        ) : (
          results.map((result) => (
            <div key={result.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-6 group hover:border-brand-red transition-all">
               <div className="w-20 h-20 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 shadow-lg shadow-slate-200 group-hover:bg-brand-red transition-colors">
                 <span className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1 opacity-60 italic">SKOR</span>
                 <span className="text-3xl font-black">{result.score}</span>
               </div>
               
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                   <h3 className="text-lg font-bold text-slate-900 leading-none">{result.subjects}</h3>
                   <div className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                     <CheckCircle2 size={10} /> TERVERIFIKASI
                   </div>
                 </div>
                 <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                   <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                     <Calendar size={14} className="text-slate-300" />
                     {new Date(result.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </div>
                 </div>
               </div>

               <div className="shrink-0">
                  <div className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-[0.2em] shadow-sm ${result.score >= 75 ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-brand-red border border-red-200'}`}>
                    {result.score >= 75 ? 'Lulus' : 'Remedial'}
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
