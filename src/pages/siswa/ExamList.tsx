/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { Exam } from '../../types';
import { useAuth } from '../../AuthContext';
import { Timer, ClipboardCheck, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ExamList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    db.getExams().then(setExams);
    db.getResults().then(res => {
      setResults(res.filter(r => r.studentId === user?.id));
    });
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ujian Berlangsung & Mendatang</h2>
          <p className="text-slate-500">Pilih ujian yang tersedia untuk dikerjakan sesuai jadwal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-slate-200">
            <ClipboardCheck size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">Belum ada jadwal ujian tersedia.</p>
          </div>
        ) : (
          exams.map((exam) => {
            const hasDone = results.find(r => r.examId === exam.id);
            return (
              <div key={exam.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full hover:border-brand-red transition-colors group">
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                     <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-wide">
                       {exam.subject}
                     </span>
                     {hasDone ? (
                       <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Selesai</span>
                     ) : (
                       <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Menunggu</span>
                     )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{exam.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">{exam.description || 'Tidak ada deskripsi ujian. Silakan tanyakan pada guru pengampu untuk detail lebih lanjut.'}</p>
                  
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {exam.duration} Min
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={14} />
                      {exam.questionIds.length} Soal
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  {hasDone ? (
                    <button disabled className="w-full py-3 bg-slate-200 text-slate-400 rounded-lg text-sm font-bold cursor-not-allowed">
                       Hasil Sudah Disimpan
                    </button>
                  ) : (
                    <Link 
                      to={`/app/take-exam/${exam.id}`}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                    >
                      Mulai Sekarang <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
