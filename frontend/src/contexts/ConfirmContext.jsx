import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const ConfirmContext = createContext();

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
};

export const ConfirmProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmLabel: '',
        cancelLabel: '',
        type: 'default', // default | destructive
        onConfirm: () => { },
        onCancel: () => { }
    });

    const confirm = useCallback(({ title, message, confirmLabel, cancelLabel, type = 'default' }) => {
        return new Promise((resolve) => {
            setModalConfig({
                isOpen: true,
                title,
                message,
                confirmLabel,
                cancelLabel,
                type,
                onConfirm: () => {
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                }
            });
        });
    }, []);

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <ConfirmModal {...modalConfig} />
        </ConfirmContext.Provider>
    );
};
