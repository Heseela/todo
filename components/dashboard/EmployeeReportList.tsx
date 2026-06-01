'use client';

import { DailyReport } from '@/types';
import Card from '../ui/Card';

interface EmployeeReportListProps {
  reports: DailyReport[];
}

export default function EmployeeReportList({ reports }: EmployeeReportListProps) {
  if (reports.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">No reports submitted yet</p>
          <p className="text-sm text-gray-400 mt-1">Your submitted reports will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Your Report History">
      <div className="space-y-4 max-h-125 overflow-y-auto pr-2">
        {reports.map((report, index) => (
          <div 
            key={report.id} 
            className="border-l-4 rounded-md border-gray-200 bg-white p-4 hover:shadow-md transition-all duration-200"
            style={{ borderLeftColor: '#0088D0' }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium px-2 py-1 rounded-full" style={{ backgroundColor: '#0088D0', color: 'white', opacity: 0.9 }}>
                    Day {index + 1}
                  </span>
                  <h4 className="font-semibold text-gray-800">{report.date}</h4>
                </div>
                <p className="text-xs text-gray-500">
                  Submitted: {new Date(report.submittedAt).toLocaleString()}
                </p>
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                ✓ Submitted
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Tasks:</span>
                <span className="ml-2 font-medium text-gray-800">{report.tasks.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Hours:</span>
                <span className="ml-2 font-medium text-gray-800">{report.hoursWorked}h</span>
              </div>
            </div>

            <button className="text-xs mt-3 hover:underline" style={{ color: '#0088D0' }}>
              View Details →
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}