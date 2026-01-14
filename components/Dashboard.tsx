
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { CheckCircle2, Clock, AlertCircle, CalendarDays } from 'lucide-react';
import { MaintenanceTask, BuildingStats, Category } from '../types';

interface DashboardProps {
  tasks: MaintenanceTask[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const stats: BuildingStats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
    overdueTasks: tasks.filter(t => t.status === 'OVERDUE').length,
    upcomingTasks: tasks.filter(t => t.status === 'PENDING').length,
  };

  const categoryData = Object.values(Category).map(cat => ({
    name: cat,
    count: tasks.filter(t => t.category === cat).length
  })).filter(d => d.count > 0);

  const priorityData = [
    { name: 'Crítica', value: tasks.filter(t => t.priority === 'Crítica').length, color: '#ef4444' },
    { name: 'Alta', value: tasks.filter(t => t.priority === 'Alta').length, color: '#f97316' },
    { name: 'Média', value: tasks.filter(t => t.priority === 'Média').length, color: '#3b82f6' },
    { name: 'Baixa', value: tasks.filter(t => t.priority === 'Baixa').length, color: '#94a3b8' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<CalendarDays className="text-blue-600" />} 
          label="Total de Atividades" 
          value={stats.totalTasks} 
          sub="Cadastradas no sistema"
        />
        <StatCard 
          icon={<CheckCircle2 className="text-emerald-600" />} 
          label="Concluídas" 
          value={stats.completedTasks} 
          sub="Neste período"
        />
        <StatCard 
          icon={<Clock className="text-amber-600" />} 
          label="Pendentes" 
          value={stats.upcomingTasks} 
          sub="Aguardando execução"
        />
        <StatCard 
          icon={<AlertCircle className="text-red-600" />} 
          label="Atrasadas" 
          value={stats.overdueTasks} 
          sub="Atenção necessária"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Manutenções por Categoria</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Distribuição de Prioridades</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs font-medium text-slate-500">
              {priorityData.map(d => (
                <div key={d.name} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                  {d.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: number, sub: string }> = ({ icon, label, value, sub }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
    <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  </div>
);

export default Dashboard;
