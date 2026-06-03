// Mock database service
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'supervisor' | 'employee';
    department?: string;
    createdAt: Date;
  }
  
  export interface Report {
    id: string;
    userId: string;
    userName: string;
    date: string;
    tasks: string[];
    hoursWorked: number;
    accomplishments: string[];
    challenges: string;
    tomorrowPlan: string[];
    status: 'pending' | 'submitted' | 'reviewed';
    submittedAt: string;
    reviewedAt?: string;
    feedback?: string;
  }
  
  // Mock data store
  class Database {
    private users: User[] = [
      {
        id: '1',
        email: 'ruby@company.com',
        name: 'Michael Chen',
        role: 'supervisor',
        createdAt: new Date(),
      },
      {
        id: '2',
        email: 'john.doe@company.com',
        name: 'John Doe',
        role: 'employee',
        department: 'Engineering',
        createdAt: new Date(),
      },
      {
        id: '3',
        email: 'jane.smith@company.com',
        name: 'Jane Smith',
        role: 'employee',
        department: 'Design',
        createdAt: new Date(),
      },
    ];
  
    private reports: Report[] = [];
  
    async getUser(email: string): Promise<User | undefined> {
      return this.users.find(u => u.email === email);
    }
  
    async getUserById(id: string): Promise<User | undefined> {
      return this.users.find(u => u.id === id);
    }
  
    async createReport(report: Omit<Report, 'id'>): Promise<Report> {
      const newReport = {
        ...report,
        id: Date.now().toString(),
      };
      this.reports.unshift(newReport);
      return newReport;
    }
  
    async getReports(filters?: { userId?: string; date?: string }): Promise<Report[]> {
      let filtered = [...this.reports];
      
      if (filters?.userId) {
        filtered = filtered.filter(r => r.userId === filters.userId);
      }
      
      if (filters?.date) {
        filtered = filtered.filter(r => r.date === filters.date);
      }
      
      return filtered.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    }
  
    async getReportById(id: string): Promise<Report | undefined> {
      return this.reports.find(r => r.id === id);
    }
  
    async updateReport(id: string, updates: Partial<Report>): Promise<Report | undefined> {
      const index = this.reports.findIndex(r => r.id === id);
      if (index === -1) return undefined;
      
      this.reports[index] = { ...this.reports[index], ...updates };
      return this.reports[index];
    }
  
    async getAllEmployees(): Promise<User[]> {
      return this.users.filter(u => u.role === 'employee');
    }
  }
  
  export const db = new Database();