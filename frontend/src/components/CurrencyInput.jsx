import React from 'react';

const CurrencyInput = ({ value, onChange, className, placeholder, required, disabled }) => {
    const formatCurrency = (val) => {
        if (!val) return '';
        // Convert to number if it's a string
        const numberVal = Number(val);
        if (isNaN(numberVal)) return '';

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(numberVal);
    };

    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const numberValue = Number(rawValue) / 100;
        onChange(numberValue);
    };

    // Display value needs to be formatted, but we need to handle the case where value is 0 or empty
    // If value is passed, we format it. If it's being typed, we want to show the mask.
    // The input is controlled, so 'value' prop is the source of truth.

    return (
        <input
            type="text"
            value={formatCurrency(value)}
            onChange={handleChange}
            className={className}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
        />
    );
};

export default CurrencyInput;
