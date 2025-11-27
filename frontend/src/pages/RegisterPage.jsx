import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, companyName);
            navigate('/');
        } catch (err) {
            setError('Falha no registro. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex items-center justify-center mb-8">
                    <UserPlus className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Criar Conta</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nome</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nome da Empresa</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Opcional (será usado seu nome se vazio)"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
                    >
                        Registrar
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Já tem uma conta? <Link to="/login" className="text-green-600 hover:underline">Faça Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
