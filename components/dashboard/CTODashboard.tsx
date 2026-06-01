'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import { DailyReport } from '@/types';

interface CTODashboardProps {
  reports: DailyReport[];
  onSendEmail: (reportId: string) => void;
}

export default function CTODashboard({ reports, onSendEmail }: CTODashboardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  const filteredReports = reports.filter(report => {
    const dateMatch = report.date === selectedDate;
    const employeeMatch = selectedEmployee === 'all' || report.userId === selectedEmployee;
    return dateMatch && employeeMatch;
  });

  const uniqueEmployees = [...new Map(reports.map(r => [r.userId, r.userName])).entries()].map(([id, name]) => ({ id, name }));

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0088D0]"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-medium mb-1">Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0088D0]"
          >
            <option value="all">All Employees</option>
            {uniqueEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-8">No reports found for the selected criteria</p>
        </Card>
      ) : (
        filteredReports.map(report => (
          <Card key={report.id} title={`${report.userName}'s Report - ${report.date}`}>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Tasks Completed</h4>
                <ul className="list-disc list-inside space-y-1">
                  {report.tasks.map((task, idx) => (
                    <li key={idx} className="text-gray-600">{task}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Hours Worked</h4>
                <p className="text-gray-600">{report.hoursWorked} hours</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Key Accomplishments</h4>
                <ul className="list-disc list-inside space-y-1">
                  {report.accomplishments.map((item, idx) => (
                    <li key={idx} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>

              {report.challenges.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Challenges</h4>
                  <p className="text-gray-600">{report.challenges}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Tomorrow's Plan</h4>
                <ul className="list-disc list-inside space-y-1">
                  {report.tomorrowPlan.map((plan, idx) => (
                    <li key={idx} className="text-gray-600">{plan}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => onSendEmail(report.id)}
                  className="px-4 py-2 text-white rounded-md transition-all hover:opacity-90"
                  style={{ backgroundColor: '#981E52' }}
                >
                  Send Email Reminder
                </button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}