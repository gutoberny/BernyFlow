import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { User, Lock, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
    const { user, login } = useAuth(); // login used to update context user if needed
    const { success, error } = useToast();
    const [loading, setLoading] = useState(true);
    
    const [profileData, setProfileData] = useState({
        name: '',
        email: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await api.get('/auth/me');
            setProfileData({
                name: response.data.name,
                email: response.data.email
            });
        } catch (err) {
            console.error('Error fetching user data:', err);
            error('Erro ao carregar dados do usuário.');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/auth/profile', profileData);
            success('Perfil atualizado com sucesso!');
            // Update local storage user if needed, or rely on next fetch
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (err) {
            console.error('Error updating profile:', err);
            error('Erro ao atualizar perfil.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            error('As novas senhas não conferem.');
            return;
        }

        try {
            await api.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            success('Senha alterada com sucesso!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error('Error changing password:', err);
            error(err.response?.data?.error || 'Erro ao alterar senha.');
        }
    };

    if (loading) return <div className="p-6">Carregando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <User size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Meu Perfil</h2>
                    <p className="text-gray-500">Gerencie suas informações pessoais</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <User size={20} /> Informações Básicas
                    </h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Save size={18} /> Salvar Perfil
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Lock size={20} /> Alterar Senha
                    </h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                                <Save size={18} /> Alterar Senha
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
