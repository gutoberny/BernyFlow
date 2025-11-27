import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, PlusCircle, Calendar } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const DashboardCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-4 rounded-full ${color} text-white`}>
            <Icon size={24} />
        </div>
        <div>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        openOrders: 0,
        activeClients: 0,
        monthlyRevenue: 0
    });

    const [dateFilter, setDateFilter] = useState(() => {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return {
            startDate: firstDay.toISOString().split('T')[0],
            endDate: lastDay.toISOString().split('T')[0]
        };
    });

    const { user } = useAuth();
    const canViewFinancials = ['OWNER', 'ADMIN'].includes(user?.role);

    useEffect(() => {
        fetchDashboardData();
    }, [dateFilter]);

    const fetchDashboardData = async () => {
        try {
            const promises = [
                api.get('/service-orders'),
                api.get('/clients')
            ];

            if (canViewFinancials) {
                promises.push(api.get('/financial/summary', { params: dateFilter }));
            }

            const results = await Promise.all(promises);
            const ordersRes = results[0];
            const clientsRes = results[1];
            const financialRes = canViewFinancials ? results[2] : null;

            const openOrders = ordersRes.data.filter(o => o.status === 'OPEN').length;
            const activeClients = clientsRes.data.length;

            setStats({
                openOrders,
                activeClients,
                monthlyRevenue: financialRes ? financialRes.data.income : 0
            });
        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>

                <div className="flex gap-2 items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                    <Calendar size={18} className="text-gray-500 ml-2" />
                    <input
                        type="date"
                        value={dateFilter.startDate}
                        onChange={e => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                        className="border-none text-sm focus:ring-0 text-gray-600"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="date"
                        value={dateFilter.endDate}
                        onChange={e => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                        className="border-none text-sm focus:ring-0 text-gray-600"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard
                    title="OS em Aberto"
                    value={stats.openOrders}
                    icon={FileText}
                    color="bg-blue-500"
                />
                <DashboardCard
                    title="Clientes Ativos"
                    value={stats.activeClients}
                    icon={Users}
                    color="bg-green-500"
                />
                {canViewFinancials && (
                    <DashboardCard
                        title="Faturamento (Período)"
                        value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.monthlyRevenue)}
                        icon={FileText}
                        color="bg-purple-500"
                    />
                )}
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Ações Rápidas</h3>
                <div className="flex gap-4">
                    <Link to="/orders/new" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                        <PlusCircle size={20} />
                        Nova Ordem de Serviço
                    </Link>
                    <Link to="/clients" className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        <Users size={20} />
                        Gerenciar Clientes
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
