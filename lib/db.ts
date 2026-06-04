/**
 * lib/db.ts  –  SQLite backend for the WorkReport Dashboard
 *
 * Drop-in replacement for the previous in-memory mock.
 * Uses `better-sqlite3` (synchronous, zero-config, works in Next.js Route Handlers).
 *
 * The database file is stored at: <project-root>/data/workreport.db
 * (create the `data/` folder; add it to .gitignore if you don't want to commit it)
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcryptjs from 'bcryptjs';

// ---------------------------------------------------------------------------
// Types  (mirrors the previous interface exactly so callers need no changes)
// ---------------------------------------------------------------------------

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
  date: string;           // YYYY-MM-DD
  tasks: string[];        // stored as JSON in SQLite
  hoursWorked: number;
  accomplishments: string[];
  challenges: string;
  tomorrowPlan: string[];
  status: 'pending' | 'submitted' | 'reviewed';
  submittedAt: string;    // ISO string
  reviewedAt?: string;
  feedback?: string;
}

// ---------------------------------------------------------------------------
// DB bootstrap
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'workreport.db');

// Singleton – Next.js hot-reload can re-execute this module, so cache on global
declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function getDB(): Database.Database {
  if (!global.__db) {
    global.__db = new Database(DB_PATH);
    global.__db.pragma('journal_mode = WAL');   // better write concurrency
    global.__db.pragma('foreign_keys = ON');
    initSchema(global.__db);
  }
  return global.__db;
}

// ---------------------------------------------------------------------------
// Schema + seed data
// ---------------------------------------------------------------------------

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      email       TEXT UNIQUE NOT NULL,
      name        TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role        TEXT NOT NULL CHECK(role IN ('supervisor','employee')),
      department  TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reports (
      id             TEXT PRIMARY KEY,
      user_id        TEXT NOT NULL REFERENCES users(id),
      user_name      TEXT NOT NULL,
      date           TEXT NOT NULL,          -- YYYY-MM-DD
      tasks          TEXT NOT NULL,          -- JSON array
      hours_worked   REAL NOT NULL,
      accomplishments TEXT NOT NULL,         -- JSON array
      challenges     TEXT NOT NULL,
      tomorrow_plan  TEXT NOT NULL,          -- JSON array
      status         TEXT NOT NULL DEFAULT 'submitted',
      submitted_at   TEXT NOT NULL,
      reviewed_at    TEXT,
      feedback       TEXT
    );
  `);

  // Migration: Add password_hash column if it doesn't exist
  try {
    const tableInfo = db.prepare("PRAGMA table_info(users)").all() as Array<{cid: number; name: string}>;
    const hasPasswordColumn = tableInfo.some(col => col.name === 'password_hash');
    
    if (!hasPasswordColumn) {
      console.log('Migrating: Adding password_hash column to users table...');
      db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
      
      // Update existing users with a hashed version of a default password
      const hashedDefault = bcryptjs.hashSync('demo123', 10);
      db.prepare('UPDATE users SET password_hash = ? WHERE password_hash IS NULL').run(hashedDefault);
    }
  } catch (e) {
    console.error('Migration error:', e);
  }

  // Seed users only when the table is empty
  const count = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO users (id, email, name, password_hash, role, department)
      VALUES (@id, @email, @name, @passwordHash, @role, @department)
    `);

    const seed = db.transaction(() => {
      const hashedDemo = bcryptjs.hashSync('demo123', 10);
      insert.run({ id: '1', email: 'ruby@company.com',       name: 'Michael Chen', passwordHash: hashedDemo, role: 'supervisor', department: null });
      insert.run({ id: '2', email: 'john.doe@company.com',   name: 'John Doe',     passwordHash: hashedDemo, role: 'employee',   department: 'Engineering' });
      insert.run({ id: '3', email: 'jane.smith@company.com', name: 'Jane Smith',   passwordHash: hashedDemo, role: 'employee',   department: 'Design' });
    });

    seed();
  }
}

// ---------------------------------------------------------------------------
// Row → domain-object helpers
// ---------------------------------------------------------------------------

type UserRow = {
  id: string; email: string; name: string;
  role: string; department: string | null; created_at: string; password_hash: string;
};

type ReportRow = {
  id: string; user_id: string; user_name: string;
  date: string; tasks: string; hours_worked: number;
  accomplishments: string; challenges: string;
  tomorrow_plan: string; status: string;
  submitted_at: string; reviewed_at: string | null; feedback: string | null;
};

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role as User['role'],
    department: row.department ?? undefined,
    createdAt: new Date(row.created_at),
  };
}

function rowToReport(row: ReportRow): Report {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    date: row.date,
    tasks: JSON.parse(row.tasks),
    hoursWorked: row.hours_worked,
    accomplishments: JSON.parse(row.accomplishments),
    challenges: row.challenges,
    tomorrowPlan: JSON.parse(row.tomorrow_plan),
    status: row.status as Report['status'],
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at ?? undefined,
    feedback: row.feedback ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Database service class (same public API as the old mock)
// ---------------------------------------------------------------------------

class DbService {
  // — Users —

  async getUser(email: string): Promise<User | undefined> {
    const row = getDB()
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as UserRow | undefined;
    return row ? rowToUser(row) : undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const row = getDB()
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(id) as UserRow | undefined;
    return row ? rowToUser(row) : undefined;
  }

  async getAllEmployees(): Promise<User[]> {
    const rows = getDB()
      .prepare("SELECT * FROM users WHERE role = 'employee'")
      .all() as UserRow[];
    return rows.map(rowToUser);
  }

  async createUser(user: Omit<User, 'createdAt'> & { password: string }): Promise<User> {
    // Hash the password before storing
    const passwordHash = bcryptjs.hashSync(user.password, 10);
    
    getDB().prepare(`
      INSERT INTO users (id, email, name, password_hash, role, department)
      VALUES (@id, @email, @name, @passwordHash, @role, @department)
    `).run({
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash,
      role: user.role,
      department: user.department || null,
    });

    const created = await this.getUserById(user.id);
    if (!created) throw new Error('Failed to create user');
    return created;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const row = getDB()
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as UserRow | undefined;
    
    if (!row) return null;
    
    const isPasswordValid = bcryptjs.compareSync(password, row.password_hash);
    if (!isPasswordValid) return null;
    
    return rowToUser(row);
  }

  async getUserByEmail(email: string): Promise<(User & { passwordHash: string }) | undefined> {
    const row = getDB()
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as UserRow | undefined;
    
    if (!row) return undefined;
    
    return {
      ...rowToUser(row),
      passwordHash: row.password_hash,
    };
  }

  // — Reports —

  async createReport(report: Omit<Report, 'id'>): Promise<Report> {
    const id = Date.now().toString();
    getDB().prepare(`
      INSERT INTO reports
        (id, user_id, user_name, date, tasks, hours_worked, accomplishments,
         challenges, tomorrow_plan, status, submitted_at)
      VALUES
        (@id, @userId, @userName, @date, @tasks, @hoursWorked, @accomplishments,
         @challenges, @tomorrowPlan, @status, @submittedAt)
    `).run({
      id,
      userId: report.userId,
      userName: report.userName,
      date: report.date,
      tasks: JSON.stringify(report.tasks),
      hoursWorked: report.hoursWorked,
      accomplishments: JSON.stringify(report.accomplishments),
      challenges: report.challenges,
      tomorrowPlan: JSON.stringify(report.tomorrowPlan),
      status: report.status,
      submittedAt: report.submittedAt,
    });

    return { ...report, id };
  }

  async getReports(filters?: { userId?: string; date?: string }): Promise<Report[]> {
    let sql = 'SELECT * FROM reports WHERE 1=1';
    const params: unknown[] = [];

    if (filters?.userId) {
      sql += ' AND user_id = ?';
      params.push(filters.userId);
    }
    if (filters?.date) {
      sql += ' AND date = ?';
      params.push(filters.date);
    }

    sql += ' ORDER BY submitted_at DESC';

    const rows = getDB().prepare(sql).all(...params) as ReportRow[];
    return rows.map(rowToReport);
  }

  async getReportById(id: string): Promise<Report | undefined> {
    const row = getDB()
      .prepare('SELECT * FROM reports WHERE id = ?')
      .get(id) as ReportRow | undefined;
    return row ? rowToReport(row) : undefined;
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<Report | undefined> {
    const existing = await this.getReportById(id);
    if (!existing) return undefined;

    const merged = { ...existing, ...updates };

    getDB().prepare(`
      UPDATE reports SET
        status       = @status,
        reviewed_at  = @reviewedAt,
        feedback     = @feedback,
        tasks        = @tasks,
        hours_worked = @hoursWorked,
        accomplishments = @accomplishments,
        challenges   = @challenges,
        tomorrow_plan = @tomorrowPlan
      WHERE id = @id
    `).run({
      id,
      status: merged.status,
      reviewedAt: merged.reviewedAt ?? null,
      feedback: merged.feedback ?? null,
      tasks: JSON.stringify(merged.tasks),
      hoursWorked: merged.hoursWorked,
      accomplishments: JSON.stringify(merged.accomplishments),
      challenges: merged.challenges,
      tomorrowPlan: JSON.stringify(merged.tomorrowPlan),
    });

    return this.getReportById(id);
  }
}

export const db = new DbService();
