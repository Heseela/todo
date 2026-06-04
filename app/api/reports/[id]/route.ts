import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: { id: string };
}

// GET /api/reports/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const report = await db.getReportById(params.id);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  // Employees can only read their own reports
  if (session.user.role === 'employee' && report.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(report);
}

// PATCH /api/reports/[id]  – supervisor adds feedback / changes status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'supervisor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const allowedKeys = ['status', 'feedback', 'reviewedAt'] as const;
  const updates: Partial<Record<(typeof allowedKeys)[number], unknown>> = {};

  for (const key of allowedKeys) {
    if (key in body) updates[key] = body[key];
  }

  if ('status' in updates) {
    updates.reviewedAt = new Date().toISOString();
  }

  const updated = await db.updateReport(params.id, updates as any);
  if (!updated) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
