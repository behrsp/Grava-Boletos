/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Boleto } from '../types';
import { Wallet, Calendar, AlertCircle } from 'lucide-react';

interface DashboardProps {
  boletos: Boleto[];
}

export const Dashboard: React.FC<DashboardProps> = ({ boletos }) => {
  const totalPaid = boletos
    .filter((b) => b.status === 'paid')
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalPending = boletos
    .filter((b) => b.status === 'pending')
    .reduce((acc, curr) => acc + curr.value, 0);

  // Find next boleto to expire
  const nextBoleto = boletos
    .filter((b) => b.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Paid */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center space-x-4">
        <div className="bg-blue-50 p-3 rounded-full">
          <Wallet className="text-blue-600 w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Pago</p>
          <p className="text-2xl font-bold text-blue-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaid)}
          </p>
        </div>
      </div>

      {/* Total Pending */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center space-x-4">
        <div className="bg-blue-50 p-3 rounded-full">
          <AlertCircle className="text-blue-600 w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Pendente</p>
          <p className="text-2xl font-bold text-blue-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}
          </p>
        </div>
      </div>

      {/* Next Due */}
      <div className="bg-blue-600 p-6 rounded-2xl shadow-md flex items-center space-x-4 text-white">
        <div className="bg-blue-500 p-3 rounded-full">
          <Calendar className="text-white w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-blue-100 font-medium uppercase tracking-wider">Próximo Vencimento</p>
          <p className="text-2xl font-bold">
            {nextBoleto ? formatDate(nextBoleto.dueDate) : 'Nenhum'}
          </p>
          {nextBoleto && (
            <p className="text-xs text-blue-200 mt-1 truncate max-w-[150px]">
              {nextBoleto.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
