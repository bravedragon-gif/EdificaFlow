
import React from 'react';
import { Edit2, Trash2, CheckCircle, Clock, AlertTriangle, Calendar, ExternalLink, Tag, MapPin } from 'lucide-react';
import { MaintenanceTask } from '../types';
import { CATEGORY_ICONS, FREQUENCY_LABELS, PRIORITY_COLORS } from '../constants';

interface ScheduleTableProps {
  tasks: MaintenanceTask[];
  onEdit: (task: MaintenanceTask) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (task: MaintenanceTask) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ tasks, onEdit, onDelete, onToggleStatus }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-slate-200">
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Nenhuma tarefa agendada</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-2">
          Comece adicionando uma manutenção manualmente ou use a IA para gerar um plano.
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'OVERDUE': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Concluída';
      case 'OVERDUE': return 'Atrasada';
      default: return 'Pendente';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getGoogleCalendarLink = (task: MaintenanceTask) => {
    const title = encodeURIComponent(`Manutenção: ${task.title}`);
    const details = encodeURIComponent(`${task.description}\n\nLocal: ${task.location}\nFrequência: ${FREQUENCY_LABELS[task.frequency]}\nResponsável: ${task.responsible || 'Técnico Predial'}`);
    const date = task.nextDate.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${date}/${date}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarefa / Local</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Frequência</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prioridade</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Próxima Data</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                      {(CATEGORY_ICONS as any)[task.category] || <Tag className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{task.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <p className="text-[11px] text-slate-500 truncate">{task.location || 'Local não definido'}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{FREQUENCY_LABELS[task.frequency]}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${PRIORITY_COLORS[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${task.status === 'OVERDUE' ? 'text-red-600' : 'text-slate-600'}`}>
                    {formatDate(task.nextDate)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onToggleStatus(task)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                      task.status === 'COMPLETED' 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                      : task.status === 'OVERDUE'
                      ? 'bg-red-50 border-red-100 text-red-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {getStatusIcon(task.status)}
                    {getStatusLabel(task.status)}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <a 
                      href={getGoogleCalendarLink(task)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Sincronizar com Google Agenda"
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => onEdit(task)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(task.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
