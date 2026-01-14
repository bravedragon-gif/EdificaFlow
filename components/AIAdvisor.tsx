
import React, { useState } from 'react';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { generateMaintenancePlan } from '../services/geminiService';
import { MaintenanceTask, Category, Frequency, Priority } from '../types';

interface AIAdvisorProps {
  onPlanGenerated: (tasks: Partial<MaintenanceTask>[]) => void;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ onPlanGenerated }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const result = await generateMaintenancePlan(description);
      onPlanGenerated(result);
      setDescription('');
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar plano via IA. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-yellow-300" />
        <h2 className="text-xl font-bold">Assistente de Manutenção IA</h2>
      </div>
      
      <p className="text-blue-100 text-sm mb-6 leading-relaxed">
        Descreva o seu condomínio ou edifício (ex: "Prédio residencial de 15 andares, com 2 elevadores, piscina aquecida e gerador próprio") para gerar um plano de manutenção personalizado.
      </p>

      <div className="space-y-4">
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva as características do edifício..."
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-blue-200 outline-none focus:bg-white/20 focus:ring-2 focus:ring-yellow-300/50 transition-all resize-none"
        />
        
        <button
          onClick={handleGenerate}
          disabled={loading || !description}
          className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-slate-400 disabled:cursor-not-allowed text-indigo-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analisando Edificações...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Gerar Cronograma Estratégico
            </>
          )}
        </button>
      </div>

      <div className="mt-6 flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
        <Info className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-100 italic">
          O plano gerado pela IA é uma base técnica consultiva baseada em normas brasileiras (NBRs). Sempre valide com o engenheiro responsável.
        </p>
      </div>
    </div>
  );
};

export default AIAdvisor;
