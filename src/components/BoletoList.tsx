/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Boleto } from '../types';
import { BoletoItem } from './BoletoItem';
import { PlusCircle, Search } from 'lucide-react';

interface BoletoListProps {
  boletos: Boleto[];
  onAdd: () => void;
  onEdit: (boleto: Boleto) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (boleto: Boleto) => void;
}

export const BoletoList: React.FC<BoletoListProps> = ({ boletos, onAdd, onEdit, onDelete, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredBoletos = boletos.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-blue-900">Meus Boletos</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar boleto..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <PlusCircle size={20} />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {filteredBoletos.length > 0 ? (
        <div className="space-y-3">
          {filteredBoletos.map((boleto) => (
            <BoletoItem
              key={boleto.id}
              boleto={boleto}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-300 w-8 h-8" />
          </div>
          <p className="text-gray-500 font-medium">Nenhum boleto encontrado.</p>
          <button
            onClick={onAdd}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Cadastrar meu primeiro boleto
          </button>
        </div>
      )}
    </div>
  );
};
