import React, { useState, useEffect } from 'react';
import { ChefHat, Plus, Search, ArrowLeft, Clock, AlertTriangle, Users, Sparkles, Home } from 'lucide-react';
import { loadCustomers, saveCustomers, addCustomer, updateCustomer, deleteCustomer, getReminders, generateId } from './lib/store';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import CustomerForm from './components/CustomerForm';
import Dashboard from './components/Dashboard';
import AISuggestion from './components/AISuggestion';
import './index.css';

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [view, setView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { setCustomers(loadCustomers()); }, []);

  const refresh = () => setCustomers(loadCustomers());

  const handleSelect = (id) => { setSelectedId(id); setView('detail'); };

  const handleAdd = () => { setEditingCustomer(null); setIsFormOpen(true); };

  const handleEdit = (c) => { setEditingCustomer(c); setIsFormOpen(true); };

  const handleSave = (data) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data);
    } else {
      addCustomer(data);
    }
    refresh();
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('この顧客情報を削除しますか？')) {
      deleteCustomer(id);
      refresh();
      setView('list');
    }
  };

  const handleBack = () => {
    if (view === 'detail') setView('list');
    else if (view === 'ai') setView('detail');
    else setView('dashboard');
  };

  const selected = customers.find(c => c.id === selectedId);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <div className="logo-icon"><ChefHat size={26} color="white" /></div>
          <div>
            <h1>OzawaFactory</h1>
            <span className="logo-sub">顧客管理システム</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAdd}><Plus size={16} /> 新規登録</button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button className={`nav-tab ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
          <Home size={16} /> ダッシュボード
        </button>
        <button className={`nav-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
          <Users size={16} /> 顧客一覧
        </button>
      </nav>

      {view === 'dashboard' && (
        <Dashboard customers={customers} onSelect={handleSelect} />
      )}

      {view === 'list' && (
        <CustomerList
          customers={customers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelect={handleSelect}
        />
      )}

      {view === 'detail' && selected && (
        <CustomerDetail
          customer={selected}
          onBack={handleBack}
          onEdit={() => handleEdit(selected)}
          onDelete={() => handleDelete(selected.id)}
          onUpdate={(data) => { updateCustomer(selected.id, data); refresh(); }}
          onOpenAI={() => setView('ai')}
        />
      )}

      {view === 'ai' && selected && (
        <AISuggestion customer={selected} onBack={handleBack} />
      )}

      {isFormOpen && (
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
