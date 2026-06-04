'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SupervisorDashboard from '@/components/dashboard/SupervisorDashboard';
import Card from '@/components/ui/Card';
import { DailyReport } from '@/types';

export default function SupervisorDashboardPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/reports');
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        setReports(data);
      } catch (err) {
        setError('Failed to load reports');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.role === 'supervisor') {
      fetchReports();
    }
  }, [session]);

  const handleSendEmail = async (reportId: string) => {
    try {
      setError('');
      const response = await fetch('/api/reports/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      setEmailSent(reportId);
      setTimeout(() => setEmailSent(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
      console.error(err);
    }
  };

  const todayReports = reports.filter(
    r => r.date === new Date().toISOString().split('T')[0]
  );
  const uniqueEmployees = [...new Map(reports.map(r => [r.userId, r.userName])).entries()];
  const avgHoursPerDay = reports.length > 0 
    ? (reports.reduce((sum, r) => sum + r.hoursWorked, 0) / reports.length).toFixed(1)
    : '0';

  return (
    <div>
      <div className="mb-6">
        <h2 className="dashboard-title">Team Reports Overview</h2>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            ✗ {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#0088D0' }}>
                {isLoading ? '...' : todayReports.length}
              </div>
              <div className="text-gray-600 text-sm mt-1">Reports Today</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#0088D0' }}>
                {uniqueEmployees.length}
              </div>
              <div className="text-gray-600 text-sm mt-1">Active Employees</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#0088D0' }}>
                {avgHoursPerDay}
              </div>
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

      {isLoading ? (
        <Card>
          <p className="text-gray-500 text-center py-8">Loading reports...</p>
        </Card>
      ) : (
        <SupervisorDashboard reports={reports} onSendEmail={handleSendEmail} />
      )}
    </div>
  );
}