// Interface for Student data
export interface StudentData {
  studentId: string;
  firstName: string;
  lastName: string;
  password: string;
  age: number;
  grade: number;
  gender: 'Male' | 'Female';
  role?: string;
}

// Interface for Teacher data
export interface TeacherData {
  teacherId: string;
  firstName: string;
  lastName: string;
  password: string;
  age: number;
  gender: 'Male' | 'Female';
  role?: string;
}

// Interface for Grade data
export interface GradeData {
  id: number;
  name: string;
  teachers: TeacherData[];
}

// Interface for Course data
export interface CourseData {
  courseCode: string;
  courseName: string;
  description?: string;
  instructorId?: string;
  contentType?: string;
  content?: string;     
}


// Interface for Admin data
export interface AdminData {
  adminId: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'ADMIN';
}

// Enum for Role (Student, Teacher, Admin)
export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

// Enum for Gender (Male, Female)
export type Gender = 'Male' | 'Female';
