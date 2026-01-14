
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  AlertCircle
} from 'lucide-react';
import { MaintenanceTask, Priority } from '../types';
import { PRIORITY_COLORS } from '../constants';

interface CalendarViewProps {
  tasks: MaintenanceTask[];
  onEditTask: (task: MaintenanceTask) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onEditTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const renderDays = () => {
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const days = [];

    // Preencher dias vazios do mês anterior
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-slate-50/50 border border-slate-100"></div>);
    }

    // Preencher dias do mês atual
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.nextDate === dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <div key={day} className={`h-32 border border-slate-100 p-2 transition-colors hover:bg-slate-50 relative overflow-hidden flex flex-col ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm font-bold ${isToday ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
              {day}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {dayTasks.map(task => (
              <button
                key={task.id}
                onClick={() => onEditTask(task)}
                className={`w-full text-left px-2 py-1 rounded text-[10px] font-semibold truncate border transition-all hover:brightness-95 flex items-center gap-1 ${
                  task.priority === Priority.CRITICAL ? 'bg-red-100 text-red-700 border-red-200' :
                  task.priority === Priority.HIGH ? 'bg-orange-100 text-orange-700 border-orange-200' :
                  task.priority === Priority.MEDIUM ? 'bg-blue-100 text-blue-700 border-blue-200' :
                  'bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={task.title}
              >
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  task.priority === Priority.CRITICAL ? 'bg-red-500' :
                  task.priority === Priority.HIGH ? 'bg-orange-500' :
                  task.priority === Priority.MEDIUM ? 'bg-blue-500' :
                  'bg-slate-500'
                }`}></div>
                {task.title}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Calendar Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800 min-w-[180px]">
            {monthNames[month]} <span className="text-slate-400 font-normal">{year}</span>
          </h2>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={goToToday} className="px-3 py-1 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Hoje
            </button>
            <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <span className="text-[10px] font-bold text-slate-500 uppercase">Crítica</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
             <div className="w-3 h-3 rounded-full bg-orange-500"></div>
             <span className="text-[10px] font-bold text-slate-500 uppercase">Alta</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
             <div className="w-3 h-3 rounded-full bg-blue-500"></div>
             <span className="text-[10px] font-bold text-slate-500 uppercase">Média</span>
          </div>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
          <div key={d} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 last:border-r-0">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-l border-t border-slate-100">
        {renderDays()}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </div>
  );
};

export default CalendarView;
