
import React, { useState } from 'react';
import { History, User, Calendar, Tag, Search, FileText, ExternalLink, Image as ImageIcon, MapPin, Link as LinkIcon } from 'lucide-react';
import { HistoryEntry } from '../types';

interface HistoryViewProps {
  history: HistoryEntry[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(entry => 
    entry.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.executedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.location && entry.location.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar no histórico (tarefa, local, técnico)..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total de registros: <span className="text-slate-900 font-bold">{filteredHistory.length}</span>
        </div>
      </div>

      <div className="space-y-6">
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
            <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Nenhum registro de execução encontrado.</p>
          </div>
        ) : (
          filteredHistory.map((entry) => (
            <div key={entry.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row">
                {/* Header Section */}
                <div className="md:w-64 bg-slate-50 p-6 border-r border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="p-3 bg-white w-fit rounded-2xl shadow-sm text-blue-600 mb-4">
                      <History className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.category}</span>
                    <h4 className="font-bold text-slate-800 text-lg leading-tight mt-1">{entry.taskTitle}</h4>
                    <div className="flex items-center gap-1.5 mt-2 bg-slate-100 w-fit px-2 py-1 rounded-md">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="text-[11px] font-medium text-slate-600">{entry.location || 'Local Geral'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-medium truncate">{entry.executedBy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(entry.completedAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Relatório de Execução</h5>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {entry.workDescription || 'Sem descrição detalhada cadastrada.'}
                      </p>
                    </div>
                    {entry.documentationLink && (
                      <a 
                        href={entry.documentationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-100 transition-all uppercase tracking-wider"
                      >
                        <LinkIcon className="w-3 h-3" />
                        Manual Técnico
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Attachments Galery */}
                  {entry.attachments && entry.attachments.length > 0 && (
                    <div className="pt-4 border-t border-slate-50">
                      <h5 className="text-xs font-bold text-slate-400 uppercase mb-3">Documentos e Fotos</h5>
                      <div className="flex flex-wrap gap-3">
                        {entry.attachments.map((att, i) => (
                          <a 
                            key={i} 
                            href={att.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all"
                          >
                            {att.type === 'image' ? <ImageIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                            <span className="max-w-[120px] truncate">{att.name}</span>
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Status Indicator */}
                <div className="p-4 bg-emerald-50 md:writing-vertical-lr flex items-center justify-center border-l border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] whitespace-nowrap">Concluída</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryView;
