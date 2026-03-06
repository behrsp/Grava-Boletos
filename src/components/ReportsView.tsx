/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Boleto } from '../types';
import { PieChart, TrendingUp, CheckCircle, Clock } from 'lucide-react';

interface ReportsViewProps {
  boletos: Boleto[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ boletos }) => {
  const paidBoletos = boletos.filter((b) => b.status === 'paid');
  const pendingBoletos = boletos.filter((b) => b.status === 'pending');

  const totalPaid = paidBoletos.reduce((acc, curr) => acc + curr.value, 0);
  const totalPending = pendingBoletos.reduce((acc, curr) => acc + curr.value, 0);
  const totalValue = totalPaid + totalPending;

  const paidPercentage = totalValue > 0 ? (totalPaid / totalValue) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 mb-6">
        <PieChart className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Relatórios Financeiros</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center space-x-2">
            <TrendingUp size={20} />
            <span>Resumo de Pagamentos</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Progresso de Quitação</span>
                <span className="font-bold text-blue-600">{paidPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                  style={{ width: `${paidPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-xs text-green-600 font-bold uppercase">Total Pago</p>
                <p className="text-xl font-black text-green-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaid)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-xs text-blue-600 font-bold uppercase">Total Pendente</p>
                <p className="text-xl font-black text-blue-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Distribuição de Boletos</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-gray-700 font-medium">Boletos Pagos</span>
              </div>
              <span className="font-bold text-gray-900">{paidBoletos.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="text-blue-500" size={20} />
                <span className="text-gray-700 font-medium">Boletos Pendentes</span>
              </div>
              <span className="font-bold text-gray-900">{pendingBoletos.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 border-t border-gray-100 pt-4">
              <span className="text-gray-500 font-bold">Total de Registros</span>
              <span className="font-black text-blue-600 text-lg">{boletos.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* List of Paid Boletos */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <h3 className="font-bold text-blue-900">Histórico de Pagamentos</h3>
        </div>
        <div className="p-0">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase font-bold">
              <tr>
                <th className="px-6 py-3">Boleto</th>
                <th className="px-6 py-3">Data Pagto</th>
                <th className="px-6 py-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paidBoletos.length > 0 ? (
                paidBoletos.map((b) => (
                  <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800">{b.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {b.paymentDate ? new Date(b.paymentDate).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-blue-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(b.value)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400 italic">
                    Nenhum pagamento registrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
