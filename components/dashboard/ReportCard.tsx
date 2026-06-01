'use client';

import { DailyReport } from '@/types';

interface ReportCardProps {
  report: DailyReport;
  onViewDetails?: (report: DailyReport) => void;
  onSendReminder?: (reportId: string) => void;
  isCompact?: boolean;
}

export default function ReportCard({ report, onViewDetails, onSendReminder, isCompact = false }: ReportCardProps) {
  if (isCompact) {
    return (
      <div 
        className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer"
        onClick={() => onViewDetails?.(report)}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-semibold text-gray-800">{report.userName}</h4>
            <p className="text-xs text-gray-500">{report.date}</p>
          </div>
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
            {report.status}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>📋 {report.tasks.length} tasks</span>
          <span>⏱ {report.hoursWorked}h</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-4 border-b border-gray-200" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: '#981E52' }}>{report.userName}</h3>
            <p className="text-sm text-gray-600">{report.date}</p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#0088D0', color: 'white', opacity: 0.9 }}>
              {report.hoursWorked} hours
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span>✅</span> Tasks Completed
          </h4>
          <ul className="space-y-1">
            {report.tasks.map((task, idx) => (
              <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                <span className="text-green-500">•</span>
                {task}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span>🏆</span> Key Accomplishments
          </h4>
          <ul className="space-y-1">
            {report.accomplishments.map((item, idx) => (
              <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                <span className="text-blue-500">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {report.challenges && report.challenges.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span>⚠️</span> Challenges
            </h4>
            <p className="text-gray-600 text-sm bg-gray-50 p-2 rounded">{report.challenges}</p>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span>📅</span> Tomorrow's Plan
          </h4>
          <ul className="space-y-1">
            {report.tomorrowPlan.map((plan, idx) => (
              <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                <span className="text-purple-500">★</span>
                {plan}
              </li>
            ))}
          </ul>
        </div>

        {onSendReminder && (
          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={() => onSendReminder(report.id)}
              className="text-sm px-3 py-1.5 rounded transition-all hover:opacity-90"
              style={{ backgroundColor: '#981E52', color: 'white' }}
            >
              Send Email Reminder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}