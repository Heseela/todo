'use client';

import { useState } from 'react';
import DailyReportForm from '@/components/dashboard/DailyReportForm';
import Card from '@/components/ui/Card';
import { DailyReport } from '@/types';

export default function EmployeeDashboard() {
  const [submittedReports, setSubmittedReports] = useState<DailyReport[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmitReport = async (reportData: any) => {
    const newReport: DailyReport = {
      id: Date.now().toString(),
      userId: 'emp-1',
      userName: 'John Doe',
      date: new Date().toISOString().split('T')[0],
      ...reportData,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    setSubmittedReports([newReport, ...submittedReports]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          ✓ Report submitted successfully! Your manager has been notified.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DailyReportForm onSubmit={handleSubmitReport} />
        
        <div className="space-y-6">
          <Card title="Your Recent Reports">
            {submittedReports.length === 0 ? (
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