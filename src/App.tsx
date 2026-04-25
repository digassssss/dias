/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  LogOut, 
  UserCircle,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import StudentManagement from './pages/admin/StudentManagement';
import QuestionManagement from './pages/guru/QuestionManagement';
import ExamManagement from './pages/guru/ExamManagement';
import ResultsRekap from './pages/admin/ResultsRekap';
import ExamList from './pages/siswa/ExamList';
import TakeExam from './pages/siswa/TakeExam';
import StudentResults from './pages/siswa/StudentResults';

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = {
    admin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/app' },
      { name: 'Manajemen User', icon: UserCircle, path: '/app/users' },
      { name: 'Manajemen Siswa', icon: Users, path: '/app/students' },
      { name: 'Manajemen Soal', icon: BookOpen, path: '/app/questions' },
      { name: 'Manajemen Ujian', icon: ClipboardCheck, path: '/app/exams' },
      { name: 'Rekap Hasil', icon: GraduationCap, path: '/app/results' },
    ],
    guru: [
       { name: 'Dashboard', icon: LayoutDashboard, path: '/app' },
       { name: 'Bank Soal', icon: BookOpen, path: '/app/questions' },
       { name: 'Manajemen Ujian', icon: ClipboardCheck, path: '/app/exams' },
       { name: 'Hasil Ujian', icon: GraduationCap, path: '/app/results' },
    ],
    siswa: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/app' },
      { name: 'Ujian Saya', icon: ClipboardCheck, path: '/app/my-exams' },
      { name: 'Hasil Saya', icon: GraduationCap, path: '/app/my-results' },
    ]
  };

  const items = user ? navItems[user.role] || [] : [];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 w-64 transition-transform lg:translate-x-0",
          !isOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center text-white font-bold">P</div>
            <span className="font-bold text-lg tracking-tight text-slate-900">SMK Prima Unggul</span>
            <button onClick={toggle} className="lg:hidden ml-auto text-slate-400">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggle()}
                className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors group"
              >
                <item.icon size={20} className="group-hover:text-brand-red" />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3 text-slate-500">
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-slate-600 text-xs">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs truncate capitalize">{user?.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-brand-red hover:text-brand-red-dark transition-colors p-1"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="lg:ml-64 transition-all duration-300 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-50 rounded text-slate-600">
            <Menu size={24} />
          </button>
          
          <h1 className="text-lg font-bold text-slate-800 hidden md:block">System Dashboard</h1>
          
          <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 ml-auto">
            <ClipboardCheck className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </header>

        <main className="p-8 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="h-screen flex items-center justify-center text-brand-red">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/app" />;

  return <MainLayout>{children}</MainLayout>;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Admin Only */}
      <Route path="/app/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
      <Route path="/app/students" element={<ProtectedRoute roles={['admin']}><StudentManagement /></ProtectedRoute>} />
      
      {/* Guru & Admin */}
      <Route path="/app/questions" element={<ProtectedRoute roles={['admin', 'guru']}><QuestionManagement /></ProtectedRoute>} />
      <Route path="/app/exams" element={<ProtectedRoute roles={['admin', 'guru']}><ExamManagement /></ProtectedRoute>} />
      <Route path="/app/results" element={<ProtectedRoute roles={['admin', 'guru']}><ResultsRekap /></ProtectedRoute>} />
      
      {/* Siswa Only */}
      <Route path="/app/my-exams" element={<ProtectedRoute roles={['siswa']}><ExamList /></ProtectedRoute>} />
      <Route path="/app/my-results" element={<ProtectedRoute roles={['siswa']}><StudentResults /></ProtectedRoute>} />
      <Route path="/app/take-exam/:examId" element={<ProtectedRoute roles={['siswa']}><TakeExam /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
