import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Edit, Trash2, X, Package } from 'lucide-react';
import CurrencyInput from '../components/CurrencyInput';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        costPrice: '',
        freight: '',
        otherCosts: '',
        profitMargin: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const { success, error } = useToast();
    const { confirm } = useConfirm();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, formData);
                success('Produto atualizado com sucesso!');
            } else {
                await api.post('/products', formData);
                success('Produto criado com sucesso!');
            }
            fetchProducts();
            handleCloseModal();
        } catch (err) {
            console.error('Erro ao salvar produto:', err);
            error('Erro ao salvar produto.');
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Excluir Produto',
            message: 'Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.',
            confirmLabel: 'Excluir',
            type: 'destructive'
        });

        if (isConfirmed) {
            try {
                await api.delete(`/products/${id}`);
                success('Produto excluído com sucesso!');
                fetchProducts();
            } catch (err) {
                console.error('Erro ao excluir:', err);
                error('Erro ao excluir produto.');
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            costPrice: product.costPrice || '',
            freight: product.freight || '',
            otherCosts: product.otherCosts || '',
            profitMargin: product.profitMargin || ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            costPrice: '',
            freight: '',
            otherCosts: '',
            profitMargin: ''
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Produtos</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Novo Produto
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                            <tr>
                                <th className="px-6 py-3">Nome</th>
                                <th className="px-6 py-3">Preço</th>
                                <th className="px-6 py-3">Estoque</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-4 text-center">Carregando...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Nenhum produto encontrado</td></tr>
                            ) : (
                                products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <Package size={18} />
                                            </div>
                                            <div>
                                                <div>{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.description}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {product.stock} un
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="2"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Custo</label>
                                    <CurrencyInput
                                        value={formData.costPrice}
                                        onChange={val => {
                                            const newCost = Number(val);
                                            const freight = Number(formData.freight || 0);
                                            const other = Number(formData.otherCosts || 0);
                                            const margin = Number(formData.profitMargin || 0);
                                            const newPrice = (newCost + freight + other) * (1 + margin / 100);
                                            setFormData({ ...formData, costPrice: val, price: newPrice.toFixed(2) });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Frete</label>
                                    <CurrencyInput
                                        value={formData.freight}
                                        onChange={val => {
                                            const cost = Number(formData.costPrice || 0);
                                            const newFreight = Number(val);
                                            const other = Number(formData.otherCosts || 0);
                                            const margin = Number(formData.profitMargin || 0);
                                            const newPrice = (cost + newFreight + other) * (1 + margin / 100);
                                            setFormData({ ...formData, freight: val, price: newPrice.toFixed(2) });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Outros Custos</label>
                                    <CurrencyInput
                                        value={formData.otherCosts}
                                        onChange={val => {
                                            const cost = Number(formData.costPrice || 0);
                                            const freight = Number(formData.freight || 0);
                                            const newOther = Number(val);
                                            const margin = Number(formData.profitMargin || 0);
                                            const newPrice = (cost + freight + newOther) * (1 + margin / 100);
                                            setFormData({ ...formData, otherCosts: val, price: newPrice.toFixed(2) });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Margem Lucro (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.profitMargin}
                                        onChange={e => {
                                            const cost = Number(formData.costPrice || 0);
                                            const freight = Number(formData.freight || 0);
                                            const other = Number(formData.otherCosts || 0);
                                            const newMargin = Number(e.target.value);
                                            const newPrice = (cost + freight + other) * (1 + newMargin / 100);
                                            setFormData({ ...formData, profitMargin: e.target.value, price: newPrice.toFixed(2) });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Venda</label>
                                    <CurrencyInput
                                        required
                                        value={formData.price}
                                        onChange={val => setFormData({ ...formData, price: val })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
