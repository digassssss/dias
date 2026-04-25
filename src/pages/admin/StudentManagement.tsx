/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { StudentProfile } from '../../types';
import { Search, UserPlus, Users, X } from 'lucide-react';

export default function StudentManagement() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<StudentProfile>>({ nis: '', name: '', class: 'XII', major: 'TKJ' });

  useEffect(() => {
    db.getStudents().then(setStudents);
  }, []);

  const handleSave = async () => {
    const s: StudentProfile = {
      id: `std_${Date.now()}`,
      name: form.name || '',
      email: `${form.nis}@smk.sch.id`,
      nis: form.nis || '',
      class: form.class || '',
      major: form.major || '',
      role: 'siswa',
      createdAt: Date.now()
    };
    await db.saveStudent(s);
    const updated = await db.getStudents();
    setStudents(updated);
    setShowModal(false);
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold">Manajemen Siswa</h2><p className="text-gray-500">Kelola basis data siswa dan informasi akademik.</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-2xl font-bold"><UserPlus size={20} /> Siswa Baru</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Data Master Siswa</h2>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Cari NIS atau Nama..." className="bg-transparent outline-none text-sm text-slate-700 w-64" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="px-6 py-4">Nomor Induk (NIS)</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">Kompetensi Keahlian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-brand-red">{s.nis}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{s.name}</td>
                  <td className="px-6 py-4 font-semibold text-slate-600">{s.class}</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wide">{s.major}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">Registrasi Siswa</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nomor Induk Siswa</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all text-sm" value={form.nis} onChange={e => setForm({...form, nis: e.target.value})} placeholder="Contoh: 2122001" /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Masukkan nama siswa..." /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tingkat</label>
                    <select className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 outline-none text-sm bg-white" value={form.class} onChange={e => setForm({...form, class: e.target.value})}>
                      <option>X</option><option>XI</option><option>XII</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jurusan</label>
                    <select className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 outline-none text-sm bg-white" value={form.major} onChange={e => setForm({...form, major: e.target.value})}>
                      <option>TKJ</option><option>DKV</option><option>AK</option><option>BC</option><option>MPLB</option><option>BD</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-200"><button onClick={handleSave} className="w-full py-3.5 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg text-sm font-bold shadow-sm transition-colors uppercase tracking-widest leading-none">Simpan Data Siswa</button></div>
           </div>
        </div>
      )}
    </div>
  );
}
