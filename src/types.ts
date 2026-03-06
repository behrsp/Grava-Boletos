/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Boleto {
  id: string;
  name: string;
  barcode: string;
  value: number;
  dueDate: string; // ISO format
  paymentDate?: string; // ISO format
  status: 'pending' | 'paid';
}

export interface DashboardStats {
  totalPaid: number;
  totalPending: number;
  nextBoleto?: Boleto;
}
