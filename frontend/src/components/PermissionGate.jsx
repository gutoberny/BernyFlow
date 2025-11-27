import { useAuth } from '../contexts/AuthContext';

const PermissionGate = ({ children, allowedRoles, showForbiddenMessage = false }) => {
    const { user } = useAuth();

    if (!user) return null;

    if (allowedRoles.includes(user.role)) {
        return children;
    }

    if (showForbiddenMessage) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                Você não tem permissão para acessar este recurso.
            </div>
        );
    }

    return null;
};

export default PermissionGate;
