export interface User {
    id: string;
    name: string;
    email: string;
    role: 'supervisor' | 'employee';
    department?: string;
  }
  
  export interface DailyReport {
    id: string;
    userId: string;
    userName: string;
    date: string;
    tasks: string[];
    hoursWorked: number;
    accomplishments: string[];
    challenges: string[];
    tomorrowPlan: string[];
    status: 'pending' | 'submitted' | 'reviewed';
    submittedAt: string;
  }
  
  export interface AuthResponse {
    user: User | null;
    error?: string;
  }

  export const DEPARTMENTS = [
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations'
  ] as const;
  
  export type Department = typeof DEPARTMENTS[number];