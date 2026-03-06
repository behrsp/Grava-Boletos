/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Boleto } from '../types';

const STORAGE_KEY = 'boletos_data';

export const storageService = {
  getBoletos: (): Boleto[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveBoletos: (boletos: Boleto[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boletos));
  },

  addBoleto: (boleto: Boleto): void => {
    const boletos = storageService.getBoletos();
    boletos.push(boleto);
    storageService.saveBoletos(boletos);
  },

  updateBoleto: (updatedBoleto: Boleto): void => {
    const boletos = storageService.getBoletos();
    const index = boletos.findIndex((b) => b.id === updatedBoleto.id);
    if (index !== -1) {
      boletos[index] = updatedBoleto;
      storageService.saveBoletos(boletos);
    }
  },

  deleteBoleto: (id: string): void => {
    const boletos = storageService.getBoletos();
    const filtered = boletos.filter((b) => b.id !== id);
    storageService.saveBoletos(filtered);
  }
};
