/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../db';
import { Exam, Question, ExamResult } from '../../types';
import { useAuth } from '../../AuthContext';
import { Timer, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Loader2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const allExams = await db.getExams();
      const foundExam = allExams.find(e => e.id === examId);
      if (!foundExam) { navigate('/app/my-exams'); return; }

      const allQuestions = await db.getQuestions();
      let examQs = foundExam.questionIds.map(id => allQuestions.find(q => q.id === id)).filter(Boolean) as Question[];

      if (examQs.length === 0) {
        examQs = Array.from({ length: 5 }).map((_, i) => ({
          id: `q${i}`, text: `Contoh Pertanyaan ${i+1}: Apa ibukota Indonesia?`,
          options: { A: 'Jakarta', B: 'Bandung', C: 'Surabaya', D: 'Medan' },
          correctAnswer: 'A', subject: 'Umum', createdBy: 'admin', createdAt: Date.now()
        }));
      }
      setQuestions(examQs); setExam(foundExam); setTimeLeft(foundExam.duration * 60);
    };
    load();

    const handlePopState = () => { window.history.pushState(null, '', window.location.href); alert("Selesaikan ujian!"); };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [examId]);

  useEffect(() => {
    if (timeLeft <= 0 && exam) { handleSubmit(); return; }
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, exam]);

  const handleSubmit = async () => {
    if (!user || !exam) return;
    setIsSubmitting(true);
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correctAnswer) correct++; });
    const score = Math.round((correct / questions.length) * 100);
    await db.saveResult({
      id: `res_${Date.now()}`, examId: exam.id, studentId: user.id, studentName: user.name,
      subjects: exam.subject, score, answers, submittedAt: Date.now(), isCompleted: true
    });
    setTimeout(() => { setIsSubmitting(false); navigate('/app/my-results'); }, 1000);
  };

  if (!exam) return null;
  const currentQ = questions[currentIdx];
  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] -m-4 lg:-m-8">
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-16 z-20 shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-4">
           <div className="hidden sm:block p-1.5 bg-slate-50 border border-slate-200 rounded-lg shadow-inner"><BookOpen size={20} className="text-brand-red" /></div>
           <div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{exam.subject}</span>
             <h1 className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{exam.title}</h1>
           </div>
         </div>
         <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg border-2 transition-all", timeLeft < 300 ? "bg-red-50 border-brand-red text-brand-red animate-pulse shadow-[0_0_15px_rgba(215,35,46,0.1)]" : "bg-white border-slate-200 text-slate-700 shadow-sm shadow-slate-100")}>
           <Timer size={20} className={timeLeft < 300 ? "text-brand-red" : "text-slate-400"} />
           {formatTime(timeLeft)}
         </div>
         <button onClick={() => setShowConfirm(true)} className="hidden sm:flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all shadow-green-200/50">
           <CheckCircle2 size={16} /> Selesai
         </button>
      </div>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[450px]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pertanyaan Ke-{currentIdx + 1} Dari {questions.length}</span>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div key={i} className={cn("h-1 w-4 rounded-full transition-all", i === currentIdx ? "bg-brand-red w-8" : !!answers[questions[i].id] ? "bg-slate-300" : "bg-slate-100")} />
                ))}
              </div>
            </div>
            <div className="p-8 flex-1">
               <AnimatePresence mode="wait">
                 <motion.div key={currentIdx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }}>
                   <p className="text-xl text-slate-900 mb-10 font-bold leading-relaxed">{currentQ?.text}</p>
                   <div className="grid gap-4">{['A', 'B', 'C', 'D'].map(key => (
                     <button key={key} onClick={() => setAnswers(p => ({...p, [currentQ.id]: key}))} className={cn("flex items-center gap-5 p-4 rounded-xl border-2 text-left transition-all group", answers[currentQ?.id] === key ? "border-brand-red bg-brand-red/5 border-l-8" : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50")}>
                       <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm shrink-0 border transition-all", answers[currentQ?.id] === key ? "bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/20" : "bg-slate-50 text-slate-400 border-slate-200 group-hover:border-slate-300 shadow-inner")}>{key}</div>
                       <span className={cn("font-bold text-sm", answers[currentQ?.id] === key ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900")}>{(currentQ?.options as any)[key]}</span>
                     </button>
                   ))}</div>
                 </motion.div>
               </AnimatePresence>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-between bg-white items-center">
              <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(p => p - 1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 font-bold transition-colors text-sm uppercase tracking-widest"><ChevronLeft size={18} /> Sebelumnya</button>
              <button disabled={currentIdx === questions.length - 1} onClick={() => setCurrentIdx(p => p + 1)} className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold disabled:opacity-30 transition-all text-sm uppercase tracking-widest shadow-sm shadow-slate-200">Selanjutnya <ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigasi Soal</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-5 gap-2">{questions.map((q, i) => (
                <button key={q.id} onClick={() => setCurrentIdx(i)} className={cn("w-full aspect-square rounded-lg flex items-center justify-center text-sm font-black border-2 transition-all", i === currentIdx ? "border-brand-red shadow-lg shadow-brand-red/10 scale-105" : !!answers[q.id] ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-100 text-slate-300 hover:border-slate-200 hover:text-slate-400 font-bold")}>{i + 1}</button>
              ))}</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
             <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
               <span className="text-slate-400">Terjawab</span>
               <span className="text-brand-red">{Object.keys(answers).length} / {questions.length}</span>
             </div>
             <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
               <motion.div initial={{ width: 0 }} animate={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }} className="h-full bg-brand-red" />
             </div>
          </div>

          <button onClick={() => setShowConfirm(true)} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-green-200/50 transition-all active:scale-95 flex items-center justify-center gap-3">
             <CheckCircle2 size={20} /> Kirim Jawaban
          </button>
        </div>
      </div>
      <AnimatePresence>{showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isSubmitting && setShowConfirm(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl p-10 max-w-sm w-full relative z-10 text-center shadow-2xl border border-slate-200">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-amber-500/5"><AlertTriangle size={44} /></div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Selesai Ujian?</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">Harap periksa kembali jawaban Anda. Pastikan semua butir soal telah terjawab dengan benar sebelum dikumpulkan.</p>
            <div className="flex flex-col gap-3">
              <button disabled={isSubmitting} onClick={handleSubmit} className="w-full py-4 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 transition-all">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Ya, Akhiri Ujian"}
              </button>
              <button disabled={isSubmitting} onClick={() => setShowConfirm(false)} className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg font-black text-sm uppercase tracking-widest transition-all">Batalkan</button>
            </div>
          </motion.div>
        </div>
      )}</AnimatePresence>
    </div>
  );
}
