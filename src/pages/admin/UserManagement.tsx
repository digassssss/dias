/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { UserProfile, UserRole } from '../../types';
import { UserPlus, Shield, UserX, UserCircle, Trash2, X } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'guru' as UserRole });

  useEffect(() => {
    db.getUsers().then(setUsers);
  }, []);

  const handleCreate = async () => {
    const user: UserProfile = {
      id: `usr_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: Date.now()
    };
    await db.saveUser(user);
    const updated = await db.getUsers();
    setUsers(updated);
    setShowModal(false);
    setNewUser({ name: '', email: '', role: 'guru' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus user ini permanent?')) {
      await db.deleteUser(id);
      const updated = await db.getUsers();
      setUsers(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold">Manajemen User</h2><p className="text-gray-500">Kelola hak akses Admin, Guru, dan Siswa.</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-2xl font-bold shadow-lg shadow-red-500/20"><UserPlus size={20} /> User Baru</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:border-brand-red transition-all">
            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4 font-black text-2xl uppercase group-hover:bg-brand-red group-hover:text-white transition-colors shadow-inner">
              {u.name.charAt(0)}
            </div>
            <h3 className="font-bold text-slate-900 mb-1 leading-tight">{u.name}</h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">{u.email}</p>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-6 flex items-center gap-1.5 ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : u.role === 'guru' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
               <Shield size={10} /> {u.role}
            </div>
            <button onClick={() => handleDelete(u.id)} className="w-full py-2.5 text-slate-400 hover:text-brand-red text-xs font-bold hover:bg-red-50 rounded-lg transition-all flex items-center justify-center gap-2 border border-transparent hover:border-brand-red/10">
              <Trash2 size={14} /> Hapus Akses
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">Tambah Akun Baru</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                  <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all text-sm" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Masukkan nama..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alamat Email</label>
                  <input type="email" className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all text-sm" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="email@sekolah.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hak Akses</label>
                  <select className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 outline-none text-sm bg-white font-bold" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
                    <option value="admin">Administrator</option>
                    <option value="guru">Tenaga Pendidik (Guru)</option>
                    <option value="siswa">Peserta Didik (Siswa)</option>
                  </select>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-slate-500 text-sm">Batal</button>
                <button onClick={handleCreate} className="flex-1 py-3 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg text-sm font-bold shadow-sm transition-colors uppercase tracking-widest leading-none">Daftarkan</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
