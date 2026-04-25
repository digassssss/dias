/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { Question } from '../../types';
import { useAuth } from '../../AuthContext';
import { Plus, BookOpen, Trash2, Edit3, Search, X } from 'lucide-react';

export default function QuestionManagement() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Question>>({
     text: '',
     options: { A: '', B: '', C: '', D: '' },
     correctAnswer: 'A',
     subject: ''
  });

  useEffect(() => {
    db.getQuestions().then(setQuestions);
  }, []);

  const handleSave = async () => {
    if (!user) return;
    const newQ: Question = {
      id: form.id || `q_${Date.now()}`,
      text: form.text || '',
      options: form.options as any,
      correctAnswer: form.correctAnswer as any,
      subject: form.subject || 'Umum',
      createdBy: user.id,
      createdAt: Date.now()
    };
    await db.saveQuestion(newQ);
    const updated = await db.getQuestions();
    setQuestions(updated);
    setShowModal(false);
    setForm({ text: '', options: { A: '', B: '', C: '', D: '' }, correctAnswer: 'A', subject: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus soal ini?')) {
      await db.deleteQuestion(id);
      const updated = await db.getQuestions();
      setQuestions(updated);
    }
  };

  const filtered = questions.filter(q => q.text.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bank Soal</h2>
          <p className="text-gray-500">Kelola kumpulan soal ujian sekolah.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-2xl font-bold shadow-lg shadow-red-500/20"
        >
          <Plus size={20} /> Tambah Soal
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Bank Soal Sekolah</h2>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari butir soal..." 
              className="bg-transparent outline-none text-sm text-slate-700 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="px-6 py-4">Mata Pelajaran</th>
                <th className="px-6 py-4">Butir Pertanyaan</th>
                <th className="px-6 py-4">Kunci</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wide">{q.subject}</span>
                  </td>
                  <td className="px-6 py-4 max-w-md truncate font-semibold text-slate-700">{q.text}</td>
                  <td className="px-4 py-4">
                    <div className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center font-black text-xs">{q.correctAnswer}</div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button onClick={() => { setForm(q); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={16} /></button>
                    <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Belum ada butir soal yang dibuat.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">Input Data Soal</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="p-8 overflow-y-auto space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mata Pelajaran</label>
                  <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all text-sm" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Contoh: Teknologi Jaringan" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Teks Pertanyaan</label>
                  <textarea rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all text-sm" value={form.text} onChange={e => setForm({...form, text: e.target.value})} placeholder="Tuliskan pertanyaan ujian di sini..." />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {['A','B','C','D'].map(opt => (
                    <div key={opt} className="flex gap-2 items-center">
                      <div className="w-10 h-10 rounded bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-400 shrink-0">{opt}</div>
                      <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all text-sm" value={(form.options as any)[opt]} onChange={e => setForm({...form, options: {...form.options, [opt]: e.target.value} as any})} placeholder={`Pilihan ${opt}`} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kunci Jawaban</label>
                  <select className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all text-sm bg-white" value={form.correctAnswer} onChange={e => setForm({...form, correctAnswer: e.target.value as any})}>
                    <option value="A">Pilihan A</option>
                    <option value="B">Pilihan B</option>
                    <option value="C">Pilihan C</option>
                    <option value="D">Pilihan D</option>
                  </select>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700">Batalkan</button>
                <button onClick={handleSave} className="px-8 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg text-sm font-bold shadow-sm transition-colors">Simpan Butir Soal</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
