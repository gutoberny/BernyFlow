import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import PermissionGate from '../components/PermissionGate';
import { Users, UserPlus, Mail, Shield, Trash2, Copy } from 'lucide-react';

const Team = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteData, setInviteData] = useState({ name: '', email: '', role: 'USER' });
    const [invitedUser, setInvitedUser] = useState(null); // To show credentials after invite
    const { success, error } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/team');
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            error('Erro ao carregar equipe.');
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/team/invite', inviteData);
            success('Usuário convidado com sucesso!');
            setInvitedUser({ ...response.data.user, tempPassword: response.data.tempPassword });
            setInviteData({ name: '', email: '', role: 'USER' });
            fetchUsers();
        } catch (err) {
            console.error('Error inviting user:', err);
            error(err.response?.data?.error || 'Erro ao convidar usuário.');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        success('Copiado para a área de transferência!');
    };

    if (loading) return <div className="p-6 text-center">Carregando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestão de Equipe</h2>
                        <p className="text-gray-500">Gerencie os membros da sua empresa</p>
                    </div>
                </div>
                <PermissionGate allowedRoles={['OWNER', 'ADMIN']}>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <UserPlus size={20} />
                        Convidar Usuário
                    </button>
                </PermissionGate>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Função</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Data de Entrada</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.role === 'OWNER' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        {!invitedUser ? (
                            <form onSubmit={handleInvite} className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Convidar Novo Usuário</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                    <input
                                        type="text"
                                        required
                                        value={inviteData.name}
                                        onChange={e => setInviteData({ ...inviteData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={inviteData.email}
                                        onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                                    <select
                                        value={inviteData.role}
                                        onChange={e => setInviteData({ ...inviteData, role: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="USER">Usuário</option>
                                        <option value="ADMIN">Administrador</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowInviteModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Enviar Convite
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                                        <UserPlus size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">Usuário Criado!</h3>
                                    <p className="text-sm text-gray-500">Compartilhe as credenciais abaixo com o novo usuário.</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Email</label>
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-gray-800">{invitedUser.email}</span>
                                            <button onClick={() => copyToClipboard(invitedUser.email)} className="text-gray-400 hover:text-blue-600">
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Senha Temporária</label>
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-gray-800 font-bold">{invitedUser.tempPassword}</span>
                                            <button onClick={() => copyToClipboard(invitedUser.tempPassword)} className="text-gray-400 hover:text-blue-600">
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowInviteModal(false);
                                        setInvitedUser(null);
                                    }}
                                    className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                                >
                                    Fechar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Team;
