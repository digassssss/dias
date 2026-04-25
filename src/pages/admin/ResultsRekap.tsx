/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { ExamResult } from '../../types';
import { Search, Download, TrendingUp, UserCircle } from 'lucide-react';

export default function ResultsRekap() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    db.getResults().then(setResults);
  }, []);

  const filtered = results.filter(r => 
    r.studentName.toLowerCase().includes(search.toLowerCase()) || 
    r.subjects.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold">Rekap Hasil Ujian</h2><p className="text-gray-500">Pantau seluruh capaian nilai siswa secara realtime.</p></div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-900/10"><Download size={20} /> Export Excel</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Seluruh Hasil Ujian Siswa</h2>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Cari nama atau pelajaran..." className="bg-transparent outline-none text-sm text-slate-700 w-64" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="px-6 py-4">Nama Siswa</th>
                <th className="px-6 py-4">Mata Pelajaran</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Skor Nilai</th>
                <th className="px-6 py-4 text-right">Waktu Selesai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs">
                      {r.studentName.charAt(0)}
                    </div>
                    {r.studentName}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-600">{r.subjects}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${r.score >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-brand-red'}`}>
                      {r.score >= 75 ? 'Lulus' : 'Remedial'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-lg font-black text-slate-800">{r.score}</td>
                  <td className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-tight">
                    {new Date(r.submittedAt).toLocaleDateString('id-ID')} {new Date(r.submittedAt).getHours()}:{new Date(r.submittedAt).getMinutes().toString().padStart(2, '0')}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">Data hasil ujian belum tersedia.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
