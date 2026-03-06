/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Boleto } from '../types';
import { X, Save } from 'lucide-react';

interface BoletoFormProps {
  onSubmit: (boleto: Boleto) => void;
  onCancel: () => void;
  initialData?: Boleto;
}

export const BoletoForm: React.FC<BoletoFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<Boleto>>({
    name: '',
    barcode: '',
    value: 0,
    dueDate: '',
    paymentDate: '',
    status: 'pending',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dueDate || !formData.value) return;

    const boleto: Boleto = {
      id: initialData?.id || crypto.randomUUID(),
      name: formData.name!,
      barcode: formData.barcode || '',
      value: Number(formData.value),
      dueDate: formData.dueDate!,
      paymentDate: formData.paymentDate || undefined,
      status: formData.paymentDate ? 'paid' : 'pending',
    };

    onSubmit(boleto);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">{initialData ? 'Editar Boleto' : 'Novo Boleto'}</h2>
          <button onClick={onCancel} className="hover:bg-blue-500 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Boleto (ex: Faculdade)</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Código de Barras</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              placeholder="00000.00000 00000.000000..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Vencimento</label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Pagamento (Opcional)</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            />
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <Save size={18} />
              <span>Salvar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
