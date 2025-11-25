import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Plus, Trash2, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import CurrencyInput from '../components/CurrencyInput';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new';

    const [order, setOrder] = useState(null);
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // New Order Form
    const [newOrderData, setNewOrderData] = useState({
        clientId: '',
        description: '',
        displacementCost: 0
    });

    // Add Item Form
    const [itemForm, setItemForm] = useState({
        type: 'product', // product or service
        itemId: '',
        quantity: 1,
        isFirstHour: false
    });

    const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
    const [paymentData, setPaymentData] = useState({
        method: 'PIX',
        type: 'CASH'
    });
    const [serviceDuration, setServiceDuration] = useState('01:00');

    useEffect(() => {
        fetchDependencies();
        if (!isNew) {
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchDependencies = async () => {
        try {
            const [clientsRes, productsRes, servicesRes] = await Promise.all([
                api.get('/clients'),
                api.get('/products'),
                api.get('/services')
            ]);
            setClients(clientsRes.data);
            setProducts(productsRes.data);
            setServices(servicesRes.data);
        } catch (error) {
            console.error('Erro ao carregar dependências:', error);
        }
    };

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/service-orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            console.error('Erro ao buscar OS:', error);
        } finally {
            setLoading(false);
        }
    };

    const { success, error, info } = useToast();
    const { confirm } = useConfirm();

    // ... existing state ...

    // ... existing useEffect ...

    // ... existing fetchDependencies ...

    // ... existing fetchOrder ...

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/service-orders', newOrderData);
            success('OS criada com sucesso!');
            navigate(`/orders/${response.data.id}`);
        } catch (err) {
            console.error('Erro ao criar OS:', err);
            error('Erro ao criar OS.');
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!itemForm.itemId) return;

        try {
            let unitPrice = 0;
            let payload = {
                isFirstHour: itemForm.isFirstHour
            };

            if (itemForm.type === 'product') {
                const product = products.find(p => p.id === Number(itemForm.itemId));
                unitPrice = product.price;
                payload.productId = product.id;
                payload.quantity = Number(itemForm.quantity);
            } else {
                const service = services.find(s => s.id === Number(itemForm.itemId));
                unitPrice = service.price;

                // Calcular quantidade baseada em horas:minutos
                const [hours, minutes] = serviceDuration.split(':').map(Number);
                const decimalDuration = hours + (minutes / 60);
                payload.quantity = decimalDuration;

                // Lógica de preço diferenciado para primeira hora (ex: +50%)
                if (itemForm.isFirstHour) {
                    unitPrice = unitPrice * 1.5;
                }
                payload.serviceId = service.id;
            }

            payload.unitPrice = unitPrice;

            await api.post(`/service-orders/${id}/items`, payload);
            success('Item adicionado!');
            fetchOrder();
            setItemForm({ type: 'product', itemId: '', quantity: 1, isFirstHour: false });
            setServiceDuration('01:00');
        } catch (err) {
            console.error('Erro ao adicionar item:', err);
            error('Erro ao adicionar item.');
        }
    };

    const handleRemoveItem = async (itemId) => {
        const isConfirmed = await confirm({
            title: 'Remover Item',
            message: 'Tem certeza que deseja remover este item?',
            confirmLabel: 'Remover',
            type: 'destructive'
        });

        if (isConfirmed) {
            try {
                await api.delete(`/service-orders/items/${itemId}`);
                success('Item removido!');
                fetchOrder();
            } catch (err) {
                console.error('Erro ao remover item:', err);
                error('Erro ao remover item.');
            }
        }
    };

    const handleFinishOrder = async () => {
        try {
            await api.put(`/service-orders/${id}`, {
                status: 'COMPLETED',
                paymentMethod: paymentData.method,
                paymentType: paymentData.type
            });
            setInvoiceModalOpen(false);
            success('OS finalizada com sucesso!');
            fetchOrder();
        } catch (err) {
            console.error('Erro ao finalizar OS:', err);
            error('Erro ao finalizar OS.');
        }
    };

    const handleUpdateStatus = async (status) => {
        if (status === 'COMPLETED') {
            setInvoiceModalOpen(true);
            return;
        }

        const isConfirmed = await confirm({
            title: 'Alterar Status',
            message: `Deseja alterar o status para ${status}?`,
            confirmLabel: 'Alterar',
            type: status === 'CANCELLED' ? 'destructive' : 'default'
        });

        if (isConfirmed) {
            try {
                await api.put(`/service-orders/${id}`, { status });
                success(`Status alterado para ${status}!`);
                fetchOrder();
            } catch (err) {
                console.error('Erro ao atualizar status:', err);
                error('Erro ao atualizar status.');
            }
        }
    };

    const handleReopenOrder = async () => {
        let message = 'Deseja reabrir esta OS?';

        if (order.transactions && order.transactions.length > 0) {
            const tx = order.transactions[0];
            const formattedAmount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount);
            const statusMap = { 'PAID': 'Pago', 'PENDING': 'Pendente' };
            const status = statusMap[tx.status] || tx.status;

            message += `\n\nExiste uma transação vinculada:\nValor: ${formattedAmount}\nStatus: ${status}\nDescrição: ${tx.description}`;

            if (tx.status === 'PENDING') {
                message += '\n\nAo reabrir, esta transação PENDENTE será excluída automaticamente.';
            } else if (tx.status === 'PAID') {
                message += '\n\nATENÇÃO: Esta transação está PAGA. Ao reabrir a OS esta transação será excluída automaticamente.';
            }
        } else {
            message += ' Se houver pagamento pendente, ele será cancelado.';
        }

        const isConfirmed = await confirm({
            title: 'Reabrir OS',
            message: message,
            confirmLabel: 'Reabrir',
            type: 'default'
        });

        if (isConfirmed) {
            try {
                await api.put(`/service-orders/${id}`, { status: 'OPEN' });
                success('OS reaberta com sucesso!');
                fetchOrder();
            } catch (err) {
                console.error('Erro ao reabrir OS:', err);
                if (err.response && err.response.data && err.response.data.error) {
                    error(err.response.data.error);
                } else {
                    error('Erro ao reabrir OS.');
                }
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Carregando...</div>;

    // Tela de Nova OS
    if (isNew) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/orders')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Nova Ordem de Serviço</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <form onSubmit={handleCreateOrder} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                            <select
                                required
                                value={newOrderData.clientId}
                                onChange={e => setNewOrderData({ ...newOrderData, clientId: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione um cliente...</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Inicial</label>
                            <textarea
                                value={newOrderData.description}
                                onChange={e => setNewOrderData({ ...newOrderData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Custo de Deslocamento</label>
                            <CurrencyInput
                                value={newOrderData.displacementCost}
                                onChange={val => setNewOrderData({ ...newOrderData, displacementCost: val })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Criar Ordem de Serviço
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (!order) return <div>OS não encontrada</div>;

    const totalItems = order.items.reduce((acc, item) => acc + item.totalPrice, 0);
    const totalOrder = totalItems + order.displacementCost;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/orders')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">OS #{order.id}</h2>
                        <p className="text-gray-500 text-sm">{order.client?.name} - {new Date(order.startDate).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    {order.status === 'OPEN' && (
                        <>
                            <button
                                onClick={() => handleUpdateStatus('CANCELLED')}
                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                            >
                                <XCircle size={18} /> Cancelar
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('COMPLETED')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <CheckCircle size={18} /> Finalizar
                            </button>
                        </>
                    )}
                    {order.status === 'COMPLETED' && (
                        <div className="flex gap-2">
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium flex items-center gap-2">
                                <CheckCircle size={18} /> Finalizada
                            </span>
                            <button
                                onClick={handleReopenOrder}
                                className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-2"
                            >
                                <RotateCcw size={18} /> Reabrir
                            </button>
                        </div>
                    )}
                    {order.status === 'CANCELLED' && (
                        <div className="flex gap-2">
                            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium flex items-center gap-2">
                                <XCircle size={18} /> Cancelada
                            </span>
                            <button
                                onClick={handleReopenOrder}
                                className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-2"
                            >
                                <RotateCcw size={18} /> Reabrir
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Detalhes e Itens */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Lista de Itens */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">Itens do Pedido</h3>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                                <tr>
                                    <th className="px-6 py-3">Item</th>
                                    <th className="px-6 py-3">Qtd/Horas</th>
                                    <th className="px-6 py-3">Unit.</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {order.items.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {item.product ? item.product.name : item.service?.name}
                                            </div>
                                            {item.isFirstHour && (
                                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">1ª Hora</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.serviceId ? (
                                                <span>
                                                    {Math.floor(item.quantity)}h {Math.round((item.quantity % 1) * 60)}m
                                                </span>
                                            ) : (
                                                item.quantity
                                            )}
                                        </td>
                                        <td className="px-6 py-4">R$ {item.unitPrice.toFixed(2)}</td>
                                        <td className="px-6 py-4 font-medium">R$ {item.totalPrice.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            {order.status === 'OPEN' && (
                                                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {order.items.length === 0 && (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Nenhum item adicionado</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Adicionar Item Form */}
                    {order.status === 'OPEN' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-4">Adicionar Item</h3>
                            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                    <select
                                        value={itemForm.type}
                                        onChange={e => setItemForm({ ...itemForm, type: e.target.value, itemId: '' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="product">Produto</option>
                                        <option value="service">Serviço</option>
                                    </select>
                                </div>
                                <div className="md:col-span-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                                    <select
                                        required
                                        value={itemForm.itemId}
                                        onChange={e => setItemForm({ ...itemForm, itemId: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Selecione...</option>
                                        {itemForm.type === 'product'
                                            ? products.map(p => <option key={p.id} value={p.id}>{p.name} (R$ {p.price})</option>)
                                            : services.map(s => <option key={s.id} value={s.id}>{s.name} (R$ {s.price}/h)</option>)
                                        }
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {itemForm.type === 'product' ? 'Qtd' : 'Duração (hh:mm)'}
                                    </label>
                                    {itemForm.type === 'product' ? (
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={itemForm.quantity}
                                            onChange={e => setItemForm({ ...itemForm, quantity: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <input
                                            type="time"
                                            required
                                            value={serviceDuration}
                                            onChange={e => setServiceDuration(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex justify-center"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>

                                {itemForm.type === 'service' && (
                                    <div className="md:col-span-12 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="firstHour"
                                            checked={itemForm.isFirstHour}
                                            onChange={e => setItemForm({ ...itemForm, isFirstHour: e.target.checked })}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="firstHour" className="text-sm text-gray-700">
                                            Aplicar taxa de 1ª Hora (+50%)
                                        </label>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}
                </div>

                {/* Resumo Financeiro */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Resumo Financeiro</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal Itens</span>
                                <span>R$ {totalItems.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Deslocamento</span>
                                <span>R$ {order.displacementCost.toFixed(2)}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-100 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>R$ {totalOrder.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Informações</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="block text-gray-500 mb-1">Descrição</span>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{order.description || 'Sem descrição'}</p>
                            </div>
                            <div>
                                <span className="block text-gray-500 mb-1">Cliente</span>
                                <p className="text-gray-900">{order.client?.name}</p>
                                <p className="text-gray-500">{order.client?.phone}</p>
                            </div>
                            {order.paymentMethod && (
                                <div>
                                    <span className="block text-gray-500 mb-1">Pagamento</span>
                                    <p className="text-gray-900">{order.paymentMethod} - {order.paymentType === 'CASH' ? 'A Vista' : 'A Prazo'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Faturamento */}
            {invoiceModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Faturar Ordem de Serviço</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                                <select
                                    value={paymentData.method}
                                    onChange={e => setPaymentData({ ...paymentData, method: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="PIX">PIX</option>
                                    <option value="DINHEIRO">Dinheiro</option>
                                    <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                                    <option value="CARTAO_DEBITO">Cartão de Débito</option>
                                    <option value="BOLETO">Boleto</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Condição</label>
                                <select
                                    value={paymentData.type}
                                    onChange={e => setPaymentData({ ...paymentData, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="CASH">A Vista</option>
                                    <option value="INSTALLMENT">A Prazo</option>
                                </select>
                            </div>

                            {paymentData.type === 'INSTALLMENT' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                                    <input
                                        type="date"
                                        required
                                        value={paymentData.dueDate}
                                        onChange={e => setPaymentData({ ...paymentData, dueDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                                <div className="flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total a Pagar</span>
                                    <span>R$ {totalOrder.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setInvoiceModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleFinishOrder}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <CheckCircle size={18} /> Confirmar Faturamento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
