
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Plus, 
  Settings, 
  Menu, 
  X,
  Building,
  Clock,
  History
} from 'lucide-react';
// Added Priority to the imports to resolve the missing reference
import { MaintenanceTask, Frequency, Priority, HistoryEntry, AppNotification, Attachment } from './types';
import Dashboard from './components/Dashboard';
import ScheduleTable from './components/ScheduleTable';
import TaskModal from './components/TaskModal';
import AIAdvisor from './components/AIAdvisor';
import HistoryView from './components/HistoryView';
import NotificationCenter from './components/NotificationCenter';
import CalendarView from './components/CalendarView';
import TaskExecutionModal from './components/TaskExecutionModal';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([
    'Elétrica', 'Hidráulica', 'Estrutural', 'Combate a Incêndio', 'Segurança', 'Geral'
  ]);
  const [view, setView] = useState<'dashboard' | 'schedule' | 'history' | 'calendar'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);
  const [executingTask, setExecutingTask] = useState<MaintenanceTask | null>(null);

  // Persistence
  useEffect(() => {
    const savedTasks = localStorage.getItem('edificaflow_tasks');
    const savedHistory = localStorage.getItem('edificaflow_history');
    const savedCats = localStorage.getItem('edificaflow_categories');
    const savedNotifs = localStorage.getItem('edificaflow_notifications');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedCats) setCustomCategories(JSON.parse(savedCats));
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
  }, []);

  useEffect(() => {
    localStorage.setItem('edificaflow_tasks', JSON.stringify(tasks));
    localStorage.setItem('edificaflow_history', JSON.stringify(history));
    localStorage.setItem('edificaflow_categories', JSON.stringify(customCategories));
    localStorage.setItem('edificaflow_notifications', JSON.stringify(notifications));
  }, [tasks, history, customCategories, notifications]);

  // Alert Logic
  useEffect(() => {
    const checkAlerts = () => {
      const today = new Date();
      const twoDaysFromNow = new Date();
      twoDaysFromNow.setDate(today.getDate() + 2);

      const newNotifs: AppNotification[] = [];

      tasks.forEach(task => {
        const taskDate = new Date(task.nextDate);
        if (task.status === 'PENDING') {
          if (taskDate < today) {
            newNotifs.push({
              id: `overdue-${task.id}-${task.nextDate}`,
              title: 'Manutenção Atrasada!',
              message: `A atividade "${task.title}" deveria ter ocorrido em ${taskDate.toLocaleDateString()}.`,
              type: 'OVERDUE',
              date: new Date().toISOString(),
              read: false
            });
          } else if (taskDate <= twoDaysFromNow) {
            newNotifs.push({
              id: `upcoming-${task.id}-${task.nextDate}`,
              title: 'Próxima Manutenção',
              message: `Faltam menos de 2 dias para a atividade "${task.title}".`,
              type: 'UPCOMING',
              date: new Date().toISOString(),
              read: false
            });
          }
        }
      });

      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const filteredNew = newNotifs.filter(n => !existingIds.has(n.id));
        return [...filteredNew, ...prev].slice(0, 50);
      });
    };

    const timer = setTimeout(checkAlerts, 2000);
    return () => clearTimeout(timer);
  }, [tasks]);

  const handleAddTask = (taskData: Partial<MaintenanceTask>) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } as MaintenanceTask : t));
    } else {
      const newTask: MaintenanceTask = {
        title: '',
        description: '',
        category: 'Geral',
        location: '',
        frequency: Frequency.MONTHLY,
        priority: Priority.MEDIUM,
        nextDate: new Date().toISOString().split('T')[0],
        status: 'PENDING',
        responsible: '',
        responsibleEmail: '',
        ...taskData as MaintenanceTask,
        id: crypto.randomUUID(),
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleAIGeneratedTasks = (newTasks: Partial<MaintenanceTask>[]) => {
    const formattedTasks = newTasks.map(t => {
      if (!customCategories.includes(t.category!)) {
        setCustomCategories(prev => [...prev, t.category!]);
      }
      return {
        ...t,
        id: crypto.randomUUID(),
        status: 'PENDING',
        location: 'Local Geral', // Placeholder para IA
        responsible: '',
        responsibleEmail: '',
        nextDate: new Date().toISOString().split('T')[0]
      };
    }) as MaintenanceTask[];
    
    setTasks(prev => [...formattedTasks, ...prev]);
    setView('schedule');
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta tarefa?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const openEditModal = (task: MaintenanceTask) => {
    if (task.status === 'PENDING') {
      setExecutingTask(task);
      setIsExecutionModalOpen(true);
    } else {
      setEditingTask(task);
      setIsModalOpen(true);
    }
  };

  const handleCompleteExecution = (executedBy: string, workDescription: string, attachments: Attachment[], documentationLink?: string) => {
    if (!executingTask) return;

    // Add to history
    const historyEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      taskId: executingTask.id,
      taskTitle: executingTask.title,
      category: executingTask.category,
      location: executingTask.location,
      completedAt: new Date().toISOString(),
      executedBy,
      workDescription,
      attachments,
      documentationLink // Salva no histórico
    };
    setHistory(prev => [historyEntry, ...prev]);

    // Calculate next occurrence
    const current = new Date(executingTask.nextDate);
    switch(executingTask.frequency) {
      case Frequency.DAILY: current.setDate(current.getDate() + 1); break;
      case Frequency.WEEKLY: current.setDate(current.getDate() + 7); break;
      case Frequency.MONTHLY: current.setMonth(current.getMonth() + 1); break;
      case Frequency.QUARTERLY: current.setMonth(current.getMonth() + 3); break;
      case Frequency.ANNUAL: current.setFullYear(current.getFullYear() + 1); break;
      case Frequency.QUINQUENNIAL: current.setFullYear(current.getFullYear() + 5); break;
    }
    const nextDateStr = current.toISOString().split('T')[0];

    // Update task
    setTasks(prev => prev.map(t => t.id === executingTask.id ? { 
      ...t, 
      status: 'PENDING', 
      nextDate: nextDateStr,
      documentationLink: documentationLink || t.documentationLink // Salva na entidade MaintenanceTask
    } : t));
    
    setIsExecutionModalOpen(false);
    setExecutingTask(null);
  };

  const handleAddCategory = (cat: string) => {
    if (!customCategories.includes(cat)) {
      setCustomCategories(prev => [...prev, cat]);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        transition-all duration-300 ease-in-out bg-slate-900 text-white flex flex-col fixed h-full z-40
        md:relative
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building className="w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">EdificaFlow</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={view === 'dashboard'} collapsed={!isSidebarOpen} onClick={() => setView('dashboard')} />
          <SidebarItem icon={<Calendar />} label="Cronograma" active={view === 'schedule'} collapsed={!isSidebarOpen} onClick={() => setView('schedule')} />
          <SidebarItem icon={<Calendar />} label="Calendário" active={view === 'calendar'} collapsed={!isSidebarOpen} onClick={() => setView('calendar')} />
          <SidebarItem icon={<History />} label="Histórico" active={view === 'history'} collapsed={!isSidebarOpen} onClick={() => setView('history')} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <SidebarItem icon={<Settings />} label="Configurações" active={false} collapsed={!isSidebarOpen} />
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full mt-4 flex items-center justify-center p-2 hover:bg-slate-800 rounded-lg transition-colors">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
              {view === 'dashboard' ? 'Painel' : view === 'schedule' ? 'Cronograma' : view === 'calendar' ? 'Calendário' : 'Histórico'}
            </h1>
            <p className="text-slate-500 text-sm">EdificaFlow Gestão Predial</p>
          </div>

          <div className="flex items-center gap-6">
            <NotificationCenter 
              notifications={notifications} 
              onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n))}
              onClearAll={() => setNotifications([])}
            />
            <button 
              onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
            >
              <Plus className="w-5 h-5" />
              Nova Tarefa
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {view === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Dashboard tasks={tasks} />
              </div>
              <div className="lg:col-span-1">
                <AIAdvisor onPlanGenerated={handleAIGeneratedTasks} />
              </div>
            </div>
          )}
          {view === 'schedule' && (
            <ScheduleTable tasks={tasks} onDelete={handleDeleteTask} onEdit={openEditModal} onToggleStatus={(task) => { setExecutingTask(task); setIsExecutionModalOpen(true); }} />
          )}
          {view === 'calendar' && (
            <CalendarView tasks={tasks} onEditTask={openEditModal} />
          )}
          {view === 'history' && (
            <HistoryView history={history} />
          )}
        </div>
      </main>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddTask}
        initialTask={editingTask}
        categories={customCategories}
        onAddCategory={handleAddCategory}
      />

      {executingTask && (
        <TaskExecutionModal 
          isOpen={isExecutionModalOpen}
          task={executingTask}
          onClose={() => { setIsExecutionModalOpen(false); setExecutingTask(null); }}
          onComplete={handleCompleteExecution}
        />
      )}
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, collapsed, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all
      ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
    `}
  >
    <div className="shrink-0">{icon}</div>
    {!collapsed && <span className="font-bold tracking-tight">{label}</span>}
  </button>
);

export default App;
