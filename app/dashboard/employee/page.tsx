'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DailyReportForm from '@/components/dashboard/DailyReportForm';
import Card from '@/components/ui/Card';
import { DailyReport } from '@/types';

export default function EmployeeDashboard() {
  const { data: session } = useSession();
  const [submittedReports, setSubmittedReports] = useState<DailyReport[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        setSubmittedReports(data);
      } catch (err) {
        setError('Failed to load reports');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchReports();
    }
  }, [session]);

  const handleSubmitReport = async (reportData: any) => {
    try {
      setError('');
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit report');
      }

      const newReport = await response.json();
      setSubmittedReports([newReport, ...submittedReports]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    }
  };

  return (
    <div className="space-y-8">
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          ✓ Report submitted successfully! Your manager has been notified.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          ✗ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DailyReportForm onSubmit={handleSubmitReport} />
        
        <div className="space-y-6">
          <Card title="Your Recent Reports">
            {isLoading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : submittedReports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reports submitted yet</p>
            ) : (
              <div className="space-y-4 max-h-125 overflow-y-auto">
                {submittedReports.map(report => (
                  <div key={report.id} className="border border-gray-200 rounded-md p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold" style={{ color: '#0088D0' }}>{report.date}</h4>
                      <span className="text-xs text-gray-500">{new Date(report.submittedAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><strong>Tasks:</strong> {report.tasks.length} completed</p>
                      <p><strong>Hours:</strong> {report.hoursWorked}h</p>
                      <p><strong>Status:</strong> <span className="text-green-600">✓ Submitted</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}