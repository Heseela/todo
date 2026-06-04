import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const date   = searchParams.get('date');

  // Supervisors may filter by any userId; employees only see their own reports
  const filters: { userId?: string; date?: string } = {};

  if (session.user.role === 'supervisor') {
    if (userId) filters.userId = userId;
  } else {
    filters.userId = session.user.id;
  }

  if (date) filters.date = date;

  const reports = await db.getReports(filters);
  return NextResponse.json(reports);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'employee') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const newReport = await db.createReport({
    userId:          session.user.id,
    userName:        session.user.name ?? '',
    date:            new Date().toISOString().split('T')[0],
    submittedAt:     new Date().toISOString(),
    status:          'submitted',
    tasks:           body.tasks           ?? [],
    hoursWorked:     body.hoursWorked     ?? 0,
    accomplishments: body.accomplishments ?? [],
    challenges:      body.challenges      ?? '',
    tomorrowPlan:    body.tomorrowPlan    ?? [],
  });

  return NextResponse.json(newReport, { status: 201 });
}
