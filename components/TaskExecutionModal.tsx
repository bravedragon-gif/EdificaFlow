
import React, { useState, useRef } from 'react';
import { X, Camera, FileText, Upload, CheckCircle2, HardDrive, Image as ImageIcon, Loader2, MapPin, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { MaintenanceTask, Attachment } from '../types';

interface TaskExecutionModalProps {
  task: MaintenanceTask;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (executedBy: string, workDescription: string, attachments: Attachment[], documentationLink?: string) => void;
}

const TaskExecutionModal: React.FC<TaskExecutionModalProps> = ({ task, isOpen, onClose, onComplete }) => {
  const [executedBy, setExecutedBy] = useState(task.responsible || '');
  const [workDescription, setWorkDescription] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [documentationLink, setDocumentationLink] = useState(task.documentationLink || '');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [tempLink, setTempLink] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    setTimeout(() => {
      const newAttachments: Attachment[] = Array.from(files).map((file: File) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'document'
      }));
      setAttachments([...attachments, ...newAttachments]);
      setIsUploading(false);
    }, 1000);
  };

  const simulateGoogleDriveUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const driveDoc: Attachment = {
        name: `Relatório_${task.title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`,
        url: 'https://drive.google.com/simulate-link',
        type: 'document'
      };
      setAttachments([...attachments, driveDoc]);
      setIsUploading(false);
      alert('Documento sincronizado com o Google Drive com sucesso!');
    }, 1500);
  };

  const handleSaveLink = () => {
    setDocumentationLink(tempLink);
    setIsLinkModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Execução Técnica</span>
            <h2 className="text-xl font-bold text-slate-800 mt-1">Concluir: {task.title}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm text-slate-500 font-medium">{task.location || 'Local não definido'}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 max-h-[75vh] overflow-y-auto space-y-8">
          {/* Info Card */}
          <div className="bg-blue-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg shadow-blue-200">
            <div>
              <p className="text-blue-100 text-sm">Manutenção agendada para:</p>
              <p className="text-2xl font-bold">{new Date(task.nextDate).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Categoria:</p>
              <p className="font-bold">{task.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Quem executou?</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={executedBy}
                  onChange={(e) => setExecutedBy(e.target.value)}
                  placeholder="Nome do técnico ou empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Descrição dos Trabalhos</label>
                <textarea 
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder="Descreva detalhadamente o que foi feito, peças trocadas, observações..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">Evidências e Documentos</label>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <Camera className="w-8 h-8 text-slate-300 group-hover:text-blue-500 mb-2" />
                  <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600">Anexar Fotos</span>
                </button>
                
                <button 
                  onClick={simulateGoogleDriveUpload}
                  className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
                >
                  <HardDrive className="w-8 h-8 text-slate-300 group-hover:text-emerald-500 mb-2" />
                  <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-600">Enviar p/ Drive</span>
                </button>

                <button 
                  onClick={() => { setTempLink(documentationLink); setIsLinkModalOpen(true); }}
                  className="col-span-2 flex items-center justify-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                >
                  <LinkIcon className="w-6 h-6 text-slate-300 group-hover:text-indigo-500" />
                  <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600">
                    {documentationLink ? 'Editar Link de Documentação' : 'Adicionar Link de Documentação'}
                  </span>
                </button>
              </div>

              {documentationLink && (
                <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <LinkIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="text-xs font-medium text-indigo-700 truncate">{documentationLink}</span>
                  </div>
                  <button 
                    onClick={() => setDocumentationLink('')}
                    className="p-1 text-indigo-400 hover:bg-indigo-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />

              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {isUploading && (
                  <div className="flex items-center justify-center py-4 text-blue-600">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span className="text-sm font-medium">Processando arquivos...</span>
                  </div>
                )}
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group animate-in slide-in-from-right-2">
                    <div className="flex items-center gap-3">
                      {file.type === 'image' ? <ImageIcon className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-emerald-500" />}
                      <span className="text-xs font-medium text-slate-700 truncate max-w-[150px]">{file.name}</span>
                    </div>
                    <button 
                      onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-50 rounded transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {attachments.length === 0 && !isUploading && (
                  <p className="text-center py-8 text-slate-400 text-xs italic border-2 border-slate-50 rounded-2xl">Nenhum anexo adicionado</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-all"
          >
            Voltar
          </button>
          <button 
            onClick={() => onComplete(executedBy, workDescription, attachments, documentationLink)}
            disabled={!workDescription || !executedBy}
            className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Salvar e Concluir
          </button>
        </div>
      </div>

      {/* Internal Modal for Link Input */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-indigo-500" />
              Link de Documentação
            </h3>
            <p className="text-sm text-slate-500 mb-4">Insira o link para o manual de serviço, certificado ou documentação técnica.</p>
            <input 
              type="url" 
              autoFocus
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-6"
              placeholder="https://exemplo.com/manual-tecnico.pdf"
              value={tempLink}
              onChange={(e) => setTempLink(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveLink}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskExecutionModal;
