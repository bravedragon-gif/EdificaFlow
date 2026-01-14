
import React, { useState, useEffect } from 'react';
import { X, Plus, MapPin, Mail, AlertCircle } from 'lucide-react';
import { Frequency, Priority, MaintenanceTask } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<MaintenanceTask>) => void;
  initialTask?: MaintenanceTask | null;
  categories: string[];
  onAddCategory: (category: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialTask, categories, onAddCategory }) => {
  const [formData, setFormData] = useState<Partial<MaintenanceTask>>({
    title: '',
    description: '',
    category: categories[0] || 'Geral',
    location: '',
    frequency: Frequency.MONTHLY,
    priority: Priority.MEDIUM,
    nextDate: new Date().toISOString().split('T')[0],
    responsible: '',
    responsibleEmail: '',
    status: 'PENDING'
  });

  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setFormData(initialTask);
    } else {
      setFormData({
        title: '',
        description: '',
        category: categories[0] || 'Geral',
        location: '',
        frequency: Frequency.MONTHLY,
        priority: Priority.MEDIUM,
        nextDate: new Date().toISOString().split('T')[0],
        responsible: '',
        responsibleEmail: '',
        status: 'PENDING'
      });
    }
    setEmailError(false);
  }, [initialTask, isOpen, categories]);

  const validateEmail = (email?: string) => {
    if (!email || email.trim() === '') return true;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, responsibleEmail: value });
    if (value && !validateEmail(value)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handleSave = () => {
    if (formData.responsibleEmail && !validateEmail(formData.responsibleEmail)) {
      setEmailError(true);
      return;
    }
    onSave(formData);
  };

  const handleCreateCategory = () => {
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setFormData({ ...formData, category: newCatName.trim() });
      setNewCatName('');
      setIsAddingCat(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {initialTask ? 'Editar Manutenção' : 'Nova Manutenção'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Título da Atividade</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Inspeção de Extintores"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Localização no Prédio</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Telhado, Sala de Máquinas, 2º Subsolo..."
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <button 
                    type="button"
                    onClick={() => setIsAddingCat(!isAddingCat)}
                    className="px-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-200"
                  >
                    {isAddingCat ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
                {isAddingCat && (
                  <div className="mt-2 flex gap-2 animate-in slide-in-from-top-1 duration-200">
                    <input 
                      type="text" 
                      placeholder="Nova categoria..."
                      className="flex-1 px-3 py-1.5 border border-blue-200 rounded-lg text-sm outline-none ring-1 ring-blue-100"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={handleCreateCategory}
                      className="bg-blue-600 text-white px-4 rounded-lg text-xs font-bold"
                    >
                      Adicionar
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Frequência</label>
                <select
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.frequency}
                  onChange={e => setFormData({ ...formData, frequency: e.target.value as Frequency })}
                >
                  {Object.values(Frequency).map(freq => <option key={freq} value={freq}>{freq}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
                <select
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}
                >
                  {Object.values(Priority).map(prio => <option key={prio} value={prio}>{prio}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Próxima Execução</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.nextDate}
                  onChange={e => setFormData({ ...formData, nextDate: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Responsável / Empresa</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.responsible}
                  onChange={e => setFormData({ ...formData, responsible: e.target.value })}
                  placeholder="Nome do técnico ou empresa contratada"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail do Responsável (Opcional)</label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${emailError ? 'text-red-400' : 'text-slate-400'}`} />
                  <input
                    type="email"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-all ${
                      emailError 
                      ? 'border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400' 
                      : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    value={formData.responsibleEmail}
                    onChange={handleEmailChange}
                    placeholder="tecnico@empresa.com.br"
                  />
                </div>
                {emailError && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px] font-bold animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Por favor, insira um e-mail válido</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição / Detalhes</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva os procedimentos necessários..."
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={emailError}
            className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg shadow-md shadow-blue-200 transition-all disabled:bg-slate-300 disabled:shadow-none"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
