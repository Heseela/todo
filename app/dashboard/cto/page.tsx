'use client';

import { useState } from 'react';
import CTODashboard from '@/components/dashboard/CTODashboard';
import Card from '@/components/ui/Card';
import { DailyReport } from '@/types';

// Mock data for demonstration
const mockReports: DailyReport[] = [
  {
    id: '1',
    userId: 'emp-1',
    userName: 'John Doe',
    date: new Date().toISOString().split('T')[0],
    tasks: ['Completed user authentication', 'Fixed login bug', 'Updated documentation'],
    hoursWorked: 7.5,
    accomplishments: ['Implemented OAuth2', 'Reduced load time by 20%'],
    challenges: ['API rate limiting issues'],
    tomorrowPlan: ['Review pull requests', 'Start API integration'],
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'emp-2',
    userName: 'Jane Smith',
    date: new Date().toISOString().split('T')[0],
    tasks: ['Designed dashboard UI', 'Created wireframes', 'Client meeting'],
    hoursWorked: 8,
    accomplishments: ['Got design approval', 'Completed user flows'],
    challenges: ['Tight deadline', 'Design feedback iterations'],
    tomorrowPlan: ['Start frontend development', 'Create component library'],
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  },
];

export default function CTODashboardPage() {
  const [reports] = useState<DailyReport[]>(mockReports);
  const [emailSent, setEmailSent] = useState<string | null>(null);

  const handleSendEmail = async (reportId: string) => {
    // Mock email sending
    setEmailSent(reportId);
    setTimeout(() => setEmailSent(null), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="dashboard-title">Team Reports Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#0088D0' }}>{reports.length}</div>
              <div className="text-gray-600 text-sm mt-1">Reports Today</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#0088D0' }}>2</div>
              <div className="text-gray-600 text-sm mt-1">Active Employees</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#0088D0' }}>7.8</div>
              <div className="text-gray-600 text-sm mt-1">Avg Hours/Day</div>
            </div>
          </Card>
        </div>
      </div>

      {emailSent && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
          ✓ Email reminder sent successfully!
        </div>
      )}

      <CTODashboard reports={reports} onSendEmail={handleSendEmail} />
    </div>
  );
}