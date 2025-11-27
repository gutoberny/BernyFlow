import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import PermissionGate from '../components/PermissionGate';
import { Building, Save } from 'lucide-react';

const CompanySettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { success, error } = useToast();
    const { user } = useAuth();
    const canEdit = ['OWNER', 'ADMIN'].includes(user?.role);

    const [formData, setFormData] = useState({
        name: '',
        cnpj: '',
        address: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const fetchCompanyData = async () => {
        try {
            const response = await api.get('/company');
            setFormData({
                name: response.data.name || '',
                cnpj: response.data.cnpj || '',
                address: response.data.address || '',
                phone: response.data.phone || '',
                email: response.data.email || ''
            });
        } catch (err) {
            console.error('Error fetching company data:', err);
            error('Erro ao carregar dados da empresa.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.put('/company', formData);
            success('Dados da empresa atualizados com sucesso!');
        } catch (err) {
            console.error('Error updating company:', err);
            error('Erro ao atualizar dados da empresa.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Carregando...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Building size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Configurações da Empresa</h2>
                    <p className="text-gray-500">Gerencie os dados da sua empresa</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome da Empresa
                            </label>
                            <input
                                type="text"
                                required
                                disabled={!canEdit}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CNPJ
                            </label>
                            <input
                                type="text"
                                disabled={!canEdit}
                                value={formData.cnpj}
                                onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email de Contato
                            </label>
                            <input
                                type="email"
                                disabled={!canEdit}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Telefone
                            </label>
                            <input
                                type="text"
                                disabled={!canEdit}
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Endereço Completo
                            </label>
                            <textarea
                                value={formData.address}
                                disabled={!canEdit}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                    </div>

                    <PermissionGate allowedRoles={['OWNER', 'ADMIN']}>
                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <Save size={20} />
                                {saving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </PermissionGate>
                </form>
            </div>
        </div>
    );
};

export default CompanySettings;
