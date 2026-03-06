/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Boleto } from './types';
import { storageService } from './services/storage';
import { Dashboard } from './components/Dashboard';
import { BoletoList } from './components/BoletoList';
import { BoletoForm } from './components/BoletoForm';
import { ReportsView } from './components/ReportsView';
import { ConfirmModal } from './components/ConfirmModal';
import { CreditCard, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBoleto, setEditingBoleto] = useState<Boleto | undefined>(undefined);
  const [currentView, setCurrentView] = useState<'home' | 'reports'>('home');
  
  // State for custom confirmation modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [boletoToDelete, setBoletoToDelete] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const data = storageService.getBoletos();
    setBoletos(data);
  }, []);

  const handleAddBoleto = (boleto: Boleto) => {
    if (editingBoleto) {
      storageService.updateBoleto(boleto);
    } else {
      storageService.addBoleto(boleto);
    }
    setBoletos(storageService.getBoletos());
    setIsFormOpen(false);
    setEditingBoleto(undefined);
  };

  const handleDeleteRequest = (id: string) => {
    setBoletoToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (boletoToDelete) {
      storageService.deleteBoleto(boletoToDelete);
      setBoletos(storageService.getBoletos());
      setIsConfirmOpen(false);
      setBoletoToDelete(null);
    }
  };

  const handleEditBoleto = (boleto: Boleto) => {
    setEditingBoleto(boleto);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (boleto: Boleto) => {
    const updated: Boleto = {
      ...boleto,
      status: boleto.status === 'paid' ? 'pending' : 'paid',
      paymentDate: boleto.status === 'paid' ? undefined : new Date().toISOString().split('T')[0]
    };
    storageService.updateBoleto(updated);
    setBoletos(storageService.getBoletos());
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="bg-white p-2 rounded-xl">
              <CreditCard className="text-blue-600 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase">Inclusão de Boletos</h1>
              <p className="text-blue-100 text-xs font-medium opacity-80">Gestão Financeira Simplificada</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm font-bold uppercase tracking-widest">
            <button 
              onClick={() => setCurrentView('home')}
              className={`hover:text-blue-200 transition-colors ${currentView === 'home' ? 'text-white border-b-2 border-white' : 'text-blue-100'}`}
            >
              Início
            </button>
            <button 
              onClick={() => setCurrentView('reports')}
              className={`hover:text-blue-200 transition-colors ${currentView === 'reports' ? 'text-white border-b-2 border-white' : 'text-blue-100'}`}
            >
              Relatórios
            </button>
            <a href="#" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">Suporte</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Dashboard Section */}
              <section className="mb-12">
                <div className="flex items-center space-x-2 mb-6">
                  <LayoutDashboard className="text-blue-600 w-6 h-6" />
                  <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Dashboard Geral</h2>
                </div>
                <Dashboard boletos={boletos} />
              </section>

              {/* Boletos List Section */}
              <section>
                <BoletoList
                  boletos={boletos}
                  onAdd={() => {
                    setEditingBoleto(undefined);
                    setIsFormOpen(true);
                  }}
                  onEdit={handleEditBoleto}
                  onDelete={handleDeleteRequest}
                  onToggleStatus={handleToggleStatus}
                />
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="reports"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReportsView boletos={boletos} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} Inclusão de Boletos. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Modal Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-50 relative"
          >
            <BoletoForm
              onSubmit={handleAddBoleto}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingBoleto(undefined);
              }}
              initialData={editingBoleto}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {isConfirmOpen && (
          <ConfirmModal
            isOpen={isConfirmOpen}
            title="Excluir Boleto"
            message="Tem certeza que deseja excluir este boleto? Esta ação não pode ser desfeita."
            onConfirm={confirmDelete}
            onCancel={() => {
              setIsConfirmOpen(false);
              setBoletoToDelete(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
