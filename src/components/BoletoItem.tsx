/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Boleto } from '../types';
import { Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

interface BoletoItemProps {
  boleto: Boleto;
  onEdit: (boleto: Boleto) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (boleto: Boleto) => void;
}

export const BoletoItem: React.FC<BoletoItemProps> = ({ boleto, onEdit, onDelete, onToggleStatus }) => {
  const calculateDays = () => {
    const due = new Date(boleto.dueDate);
    const reference = boleto.paymentDate ? new Date(boleto.paymentDate) : new Date();
    
    // Reset hours to compare only dates
    due.setHours(0, 0, 0, 0);
    reference.setHours(0, 0, 0, 0);

    const diffTime = reference.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: 'Vence hoje', color: 'text-blue-600' };
    if (diffDays > 0) return { text: `${diffDays} dias de atraso`, color: 'text-red-600' };
    return { text: `${Math.abs(diffDays)} dias adiantado`, color: 'text-green-600' };
  };

  const statusInfo = calculateDays();

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${boleto.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
          {boleto.status === 'paid' ? <CheckCircle size={24} /> : <Clock size={24} />}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{boleto.name}</h3>
          <p className="text-sm text-gray-500 font-mono truncate max-w-[200px]">{boleto.barcode || 'Sem código'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1 md:px-8">
        <div>
          <p className="text-xs text-gray-400 uppercase font-bold">Valor</p>
          <p className="font-bold text-blue-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(boleto.value)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase font-bold">Vencimento</p>
          <p className="text-gray-700">{new Date(boleto.dueDate).toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <p className="text-xs text-gray-400 uppercase font-bold">Status / Prazo</p>
          <p className={`text-sm font-semibold ${statusInfo.color}`}>{statusInfo.text}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onToggleStatus(boleto)}
          className={`p-2 rounded-lg transition-colors ${
            boleto.status === 'paid' 
              ? 'bg-gray-100 text-gray-400 hover:bg-gray-200' 
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
          title={boleto.status === 'paid' ? 'Marcar como pendente' : 'Marcar como pago'}
        >
          <CheckCircle size={18} />
        </button>
        <button
          onClick={() => onEdit(boleto)}
          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          title="Editar"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(boleto.id)}
          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          title="Excluir"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
