
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DollarSign, TrendingUp, TrendingDown, Calendar, CheckCircle, Clock, Plus, X, Edit, Trash2 } from 'lucide-react';
import CurrencyInput from '../components/CurrencyInput';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';

const Financial = () => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0, pendingIncome: 0, pendingExpense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL'); // ALL, PAYABLE, RECEIVABLE, PAID
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [newTransaction, setNewTransaction] = useState({
        description: '',
        amount: '',
        type: 'EXPENSE',
        status: 'PENDING',
        dueDate: '',
        date: new Date().toISOString().split('T')[0],
        recurrence: false,
        installments: 12
    });

    useEffect(() => {
        fetchData();
    }, [activeTab, dateFilter]);

    const fetchData = async () => {
        try {
            let params = { ...dateFilter };

            if (activeTab === 'PAYABLE') {
                params.type = 'EXPENSE';
                params.status = 'PENDING';
            } else if (activeTab === 'RECEIVABLE') {
                params.type = 'INCOME';
                params.status = 'PENDING';
            } else if (activeTab === 'PAID') {
                params.status = 'PAID';
            }

            const [transRes, summaryRes] = await Promise.all([
                api.get('/financial', { params }),
                api.get('/financial/summary', { params: dateFilter })
            ]);
            setTransactions(transRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            console.error('Erro ao buscar dados financeiros:', error);
        } finally {
            setLoading(false);
        }
    };

    const { success, error } = useToast();
    const { confirm } = useConfirm();

    // ... existing state ...

    // ... existing useEffect ...

    // ... existing fetchData ...

    const handleSaveTransaction = async (e) => {
        e.preventDefault();
        try {
            if (editingTransaction) {
                await api.put(`/financial/${editingTransaction.id}`, newTransaction);
                success('Transação atualizada com sucesso!');
            } else {
                await api.post('/financial', newTransaction);
                success('Transação criada com sucesso!');
            }
            handleCloseModal();
            fetchData();
        } catch (err) {
            console.error('Erro ao salvar transação:', err);
            error('Erro ao salvar transação.');
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setNewTransaction({
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            status: transaction.status,
            dueDate: transaction.dueDate ? transaction.dueDate.split('T')[0] : '',
            date: transaction.date ? transaction.date.split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Excluir Transação',
            message: 'Tem certeza que deseja excluir esta transação?',
            confirmLabel: 'Excluir',
            type: 'destructive'
        });

        if (isConfirmed) {
            try {
                await api.delete(`/financial/${id}`);
                success('Transação excluída com sucesso!');
                fetchData();
            } catch (err) {
                console.error('Erro ao excluir:', err);
                error('Erro ao excluir transação.');
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
        setNewTransaction({
            description: '',
            amount: '',
            type: 'EXPENSE',
            status: 'PENDING',
            dueDate: '',
            date: new Date().toISOString().split('T')[0],
            recurrence: false,
            installments: 12
        });
    };

    const handleMarkAsPaid = async (id) => {
        if (window.confirm('Confirmar baixa nesta transação?')) {
            try {
                await api.put(`/financial/${id}`, { status: 'PAID' });
                fetchData();
            } catch (error) {
                console.error('Erro ao dar baixa:', error);
            }
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Financeiro</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Nova Transação
                </button>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-gray-500 font-medium">Receitas (Realizadas)</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.income)}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full">
                            <TrendingDown size={24} />
                        </div>
                        <span className="text-gray-500 font-medium">Despesas (Realizadas)</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.expense)}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                            <Clock size={24} />
                        </div>
                        <span className="text-gray-500 font-medium">A Receber</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{formatCurrency(summary.pendingIncome)}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                            <Clock size={24} />
                        </div>
                        <span className="text-gray-500 font-medium">A Pagar</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(summary.pendingExpense)}</p>
                </div>
            </div>

            {/* Filtros de Data */}
            <div className="flex gap-4 items-end bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                    <input
                        type="date"
                        value={dateFilter.startDate}
                        onChange={e => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                    <input
                        type="date"
                        value={dateFilter.endDate}
                        onChange={e => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {(dateFilter.startDate || dateFilter.endDate) && (
                    <button
                        onClick={() => setDateFilter({ startDate: '', endDate: '' })}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700 mb-[1px]"
                    >
                        Limpar Filtros
                    </button>
                )}
            </div>

            {/* Abas */}
            <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('ALL')}
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'ALL' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Todas
                </button>
                <button
                    onClick={() => setActiveTab('PAYABLE')}
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'PAYABLE' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Contas a Pagar
                </button>
                <button
                    onClick={() => setActiveTab('RECEIVABLE')}
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'RECEIVABLE' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Contas a Receber
                </button>
                <button
                    onClick={() => setActiveTab('PAID')}
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'PAID' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Contas Pagas
                </button>
            </div>

            {/* Lista de Transações */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                            <tr>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3">Vencimento</th>
                                <th className="px-6 py-3">Descrição</th>
                                <th className="px-6 py-3">Tipo</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Valor</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="7" className="px-6 py-4 text-center">Carregando...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-500">Nenhuma transação encontrada</td></tr>
                            ) : (
                                transactions.map(transaction => (
                                    <tr key={transaction.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {transaction.description}
                                            {transaction.serviceOrder && (
                                                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                    {transaction.serviceOrder.client?.name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.status === 'PAID' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {transaction.status === 'PAID' ? 'Pago' : 'Pendente'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            {transaction.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleMarkAsPaid(transaction.id)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium p-1"
                                                    title="Dar Baixa"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {!transaction.serviceOrderId && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(transaction)}
                                                        className="text-gray-600 hover:text-blue-600 p-1"
                                                        title="Editar"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(transaction.id)}
                                                        className="text-gray-600 hover:text-red-600 p-1"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Nova Transação */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTransaction} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <input
                                    type="text"
                                    required
                                    value={newTransaction.description}
                                    onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                                    <CurrencyInput
                                        required
                                        value={newTransaction.amount}
                                        onChange={val => setNewTransaction({ ...newTransaction, amount: val })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                    <select
                                        value={newTransaction.type}
                                        onChange={e => setNewTransaction({ ...newTransaction, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="EXPENSE">Despesa</option>
                                        <option value="INCOME">Receita</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={newTransaction.status}
                                        onChange={e => setNewTransaction({ ...newTransaction, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="PENDING">Pendente</option>
                                        <option value="PAID">Pago</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {newTransaction.status === 'PENDING' ? 'Vencimento' : 'Data Pagamento'}
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={newTransaction.status === 'PENDING' ? newTransaction.dueDate : newTransaction.date}
                                        onChange={e => {
                                            if (newTransaction.status === 'PENDING') {
                                                setNewTransaction({ ...newTransaction, dueDate: e.target.value });
                                            } else {
                                                setNewTransaction({ ...newTransaction, date: e.target.value });
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Recorrência */}
                            {!editingTransaction && (
                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="recurrence"
                                            checked={newTransaction.recurrence}
                                            onChange={e => setNewTransaction({ ...newTransaction, recurrence: e.target.checked })}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="recurrence" className="text-sm font-medium text-gray-700">
                                            Repetir mensalmente?
                                        </label>
                                    </div>

                                    {newTransaction.recurrence && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Meses</label>
                                            <input
                                                type="number"
                                                min="2"
                                                max="60"
                                                value={newTransaction.installments}
                                                onChange={e => setNewTransaction({ ...newTransaction, installments: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Serão criadas {newTransaction.installments} transações (uma por mês).
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Salvar Transação
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Financial;
