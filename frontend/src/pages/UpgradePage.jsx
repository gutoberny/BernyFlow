import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import api from '../services/api';

const UpgradePage = () => {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const response = await api.post('/subscription/checkout');
            if (response.data.initPoint) {
                window.location.href = response.data.initPoint;
            }
        } catch (error) {
            console.error('Error creating checkout:', error);
            alert('Erro ao iniciar pagamento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Escolha o Plano Ideal</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Free</h2>
                    <p className="text-gray-500 mb-6">Para quem está começando</p>
                    <div className="text-4xl font-bold text-gray-800 mb-8">R$ 0<span className="text-lg text-gray-500 font-normal">/mês</span></div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center text-gray-600">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            Até 10 Clientes
                        </li>
                        <li className="flex items-center text-gray-600">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            Até 10 Ordens de Serviço
                        </li>
                        <li className="flex items-center text-gray-600">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            1 Usuário
                        </li>
                        <li className="flex items-center text-gray-400">
                            <X className="w-5 h-5 mr-3" />
                            Suporte Prioritário
                        </li>
                    </ul>

                    <button disabled className="w-full py-3 px-6 rounded-lg bg-gray-100 text-gray-400 font-medium cursor-not-allowed">
                        Plano Atual
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-indigo-600 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        RECOMENDADO
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Pro</h2>
                    <p className="text-gray-500 mb-6">Para empresas em crescimento</p>
                    <div className="text-4xl font-bold text-gray-800 mb-8">R$ 197<span className="text-lg text-gray-500 font-normal">/mês</span></div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center text-gray-600">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            Clientes Ilimitados
                        </li>
                        <li className="flex items-center text-gray-600">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            Ordens de Serviço Ilimitadas
                        </li>
                        <li className="flex items-center text-gray-600">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            Usuários Ilimitados
                        </li>
                        <li className="flex items-center text-gray-600">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            Suporte Prioritário
                        </li>
                    </ul>

                    <button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="w-full py-3 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processando...' : 'Assinar Agora'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradePage;
