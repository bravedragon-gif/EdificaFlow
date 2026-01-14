
export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
  QUINQUENNIAL = 'QUINQUENNIAL'
}

export enum Priority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
  CRITICAL = 'Crítica'
}

export enum Category {
  ELECTRICAL = 'Elétrica',
  PLUMBING = 'Hidráulica',
  STRUCTURAL = 'Estrutural',
  FIRE_SAFETY = 'Combate a Incêndio',
  ELEVATORS = 'Elevadores',
  HVAC = 'HVAC',
  LEISURE = 'Lazer',
  CLEANING = 'Limpeza',
  SECURITY = 'Segurança',
  GAS = 'Gás',
  GENERAL = 'Geral'
}

export interface Attachment {
  name: string;
  url: string;
  type: 'image' | 'document';
}

export interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  frequency: Frequency;
  priority: Priority;
  lastPerformed?: string;
  nextDate: string;
  responsible?: string;
  responsibleEmail?: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  documentationLink?: string; // Novo campo
}

export interface HistoryEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  category: string;
  location: string;
  completedAt: string;
  executedBy: string;
  workDescription: string;
  attachments: Attachment[];
  documentationLink?: string; // Novo campo
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'UPCOMING' | 'OVERDUE';
  date: string;
  read: boolean;
}

export interface BuildingStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingTasks: number;
}
