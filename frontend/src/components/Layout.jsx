import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Wrench, FileText, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';

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

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        TechManager
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Gestão de Informática</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
                    <SidebarItem icon={Users} label="Clientes" to="/clients" />
                    <SidebarItem icon={Package} label="Produtos" to="/products" />
                    <SidebarItem icon={Wrench} label="Serviços" to="/services" />
                    <SidebarItem icon={FileText} label="Ordens de Serviço" to="/orders" />
                    <SidebarItem icon={DollarSign} label="Financeiro" to="/financial" />
                </nav>

                <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-500">
                    &copy; 2024 TechManager
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
