/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, StudentProfile, Question, Exam, ExamResult } from './types';
import { supabase } from './lib/supabase';

const STORAGE_KEYS = {
  AUTH: 'cbt_auth_user'
};

class SupabaseService {
  // Auth Local (State is handled by AuthContext, this is for persistence only)
  setAuthUser(user: UserProfile | null) {
    if (user) localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.AUTH);
  }

  getAuthUser(): UserProfile | null {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  }

  // Users
  async getUsers(): Promise<UserProfile[]> {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    return data || [];
  }
  
  async saveUser(user: UserProfile) {
    const { error } = await supabase.from('users').upsert(user);
    if (error) console.error('Error saving user:', error);
  }

  async deleteUser(id: string) {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) console.error('Error deleting user:', error);
  }

  // Students
  async getStudents(): Promise<StudentProfile[]> {
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }
    return data || [];
  }

  async saveStudent(student: StudentProfile) {
    // First save to users table because of FK dependency
    await this.saveUser({
      id: student.id,
      email: student.email,
      name: student.name,
      role: 'siswa',
      createdAt: student.createdAt
    });
    
    const { error } = await supabase.from('students').upsert(student);
    if (error) console.error('Error saving student:', error);
  }

  // Questions
  async getQuestions(): Promise<Question[]> {
    const { data, error } = await supabase.from('questions').select('*');
    if (error) {
       console.error('Error fetching questions:', error);
       return [];
    }
    return data || [];
  }

  async saveQuestion(q: Question) {
    const { error } = await supabase.from('questions').upsert(q);
    if (error) console.error('Error saving question:', error);
  }

  async deleteQuestion(id: string) {
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) console.error('Error deleting question:', error);
  }

  // Exams
  async getExams(): Promise<Exam[]> {
    const { data, error } = await supabase.from('exams').select('*');
    if (error) {
      console.error('Error fetching exams:', error);
      return [];
    }
    return data || [];
  }

  async saveExam(e: Exam) {
    const { error } = await supabase.from('exams').upsert(e);
    if (error) console.error('Error saving exam:', error);
  }

  async deleteExam(id: string) {
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (error) console.error('Error deleting exam:', error);
  }

  // Results
  async getResults(): Promise<ExamResult[]> {
    const { data, error } = await supabase.from('results').select('*');
    if (error) {
      console.error('Error fetching results:', error);
      return [];
    }
    return data || [];
  }

  async saveResult(r: ExamResult) {
    const { error } = await supabase.from('results').upsert(r);
    if (error) console.error('Error saving result:', error);
  }
}

export const db = new SupabaseService();

