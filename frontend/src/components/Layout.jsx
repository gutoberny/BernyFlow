import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Package,
    Wrench,
    FileText,
    DollarSign,
    LogOut,
    Settings,
    User,
    ChevronUp,
    Building
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import PermissionGate from './PermissionGate';

const SidebarItem = ({ icon: Icon, label, to }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            )}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </Link>
    );
};

const UserMenu = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            {isOpen && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                    <Link
                        to="/settings/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <User size={18} />
                        <span className="text-sm">Meu Perfil</span>
                    </Link>
                    <Link
                        to="/settings/company"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <Building size={18} />
                        <span className="text-sm">Empresa</span>
                    </Link>
                    <div className="h-px bg-gray-700 my-1"></div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-900/30 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-sm">Sair</span>
                    </button>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700"
            >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{user?.name || 'Usuário'}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <ChevronUp size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        BernyFlow
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Gestão de Informática</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
                    <SidebarItem icon={Users} label="Clientes" to="/clients" />
                    <SidebarItem icon={Package} label="Produtos" to="/products" />
                    <SidebarItem icon={Wrench} label="Serviços" to="/services" />
                    <SidebarItem icon={FileText} label="Ordens de Serviço" to="/orders" />
                    <PermissionGate allowedRoles={['OWNER', 'ADMIN']}>
                        <SidebarItem icon={DollarSign} label="Financeiro" to="/financial" />
                    </PermissionGate>
                    <SidebarItem icon={Users} label="Equipe" to="/team" />
                </nav>

                <div className="p-4 border-t border-gray-800 space-y-4">
                    <Link to="/upgrade" className="block w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                        Upgrade to Pro 🚀
                    </Link>
                    <UserMenu />
                    <div className="mt-4 text-center text-xs text-gray-500">
                        &copy; 2024 BernyFlow
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
