export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  college: string;
  department: string;
  year: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  subjectType: string;
  pages: number;
  deadline: string;
  budget: number;
  college: string;
  department: string;
  status: string;
  student: any;
  writer?: any;
  mediator?: any;
  adminNotes?: string;
  writerNotes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}