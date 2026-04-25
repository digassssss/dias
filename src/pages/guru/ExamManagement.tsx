/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { Exam } from '../../types';
import { useAuth } from '../../AuthContext';
import { Plus, ClipboardCheck, Calendar, Clock, Trash2, X } from 'lucide-react';

export default function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>([]);
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Exam>>({
    title: '', description: '', subject: '', duration: 60
  });

  useEffect(() => {
    db.getExams().then(setExams);
  }, []);

  const handleSave = async () => {
    if (!user) return;
    const allQs = await db.getQuestions();
    const newExam: Exam = {
      id: `ex_${Date.now()}`,
      title: form.title || '',
      description: form.description || '',
      subject: form.subject || '',
      duration: form.duration || 60,
      questionIds: allQs.map(q => q.id), // For demo, use all questions
      startTime: Date.now(),
      endTime: Date.now() + 86400000,
      createdBy: user.id,
      createdAt: Date.now()
    };
    await db.saveExam(newExam);
    const updated = await db.getExams();
    setExams(updated);
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus paket ujian ini?')) {
      await db.deleteExam(id);
      const updated = await db.getExams();
      setExams(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold">Manajemen Ujian</h2><p className="text-gray-500">Jadwalkan dan kelola ujian siswa.</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-2xl font-bold shadow-lg shadow-red-500/20"><Plus size={20} /> Buat Ujian</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <div key={exam.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col group hover:border-brand-red transition-all">
             <div className="absolute top-0 right-0 p-3">
                <button onClick={() => handleDelete(exam.id)} className="p-2 text-slate-300 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
             </div>
             <div className="mb-4">
               <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">{exam.subject}</span>
             </div>
             <h3 className="text-base font-bold text-slate-900 mb-2 leading-tight">{exam.title}</h3>
             <p className="text-xs text-slate-500 mb-6 line-clamp-2 leading-relaxed">{exam.description || 'Tidak ada deskripsi paket ujian.'}</p>
             <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
               <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                 <Clock size={14} className="text-slate-400" />
                 {exam.duration} Min
               </div>
               <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                 <ClipboardCheck size={14} className="text-slate-400" />
                 {exam.questionIds.length} Butir Soal
               </div>
             </div>
          </div>
        ))}
        {exams.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-400 italic text-sm font-medium">Belum ada paket ujian yang diterbitkan.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">Jadwalkan Paket Ujian</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Judul Ujian</label>
                  <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all text-sm" placeholder="Contoh: Penilaian Akhir Semester" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mata Pelajaran</label>
                  <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all text-sm" placeholder="Contoh: Administrasi Jaringan" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Waktu (Menit)</label>
                    <input type="number" className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all text-sm font-bold" value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instruksi / Deskripsi</label>
                  <textarea className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all text-sm" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Opsional: Tambahkan instruksi ujian..." />
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-slate-500 text-sm">Batalkan</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg text-sm font-bold shadow-sm transition-colors uppercase tracking-widest leading-none">Rilis Paket Ujian</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
