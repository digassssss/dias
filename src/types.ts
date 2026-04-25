/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'guru' | 'siswa';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: number;
}

export interface StudentProfile extends UserProfile {
  nis: string;
  class: string;
  major: string;
}

export interface Question {
  id: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  subject: string;
  createdBy: string;
  createdAt: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
  duration: number; // in minutes
  startTime: number; // timestamp
  endTime: number; // timestamp
  subject: string;
  createdBy: string;
  createdAt: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  subjects: string;
  score: number;
  answers: Record<string, string>; // questionId -> selectedOption
  submittedAt: number;
  isCompleted: boolean;
}
