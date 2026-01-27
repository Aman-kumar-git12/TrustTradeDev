import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

const QuickRegisterButton = ({ className = '', onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
            return;
        }
        navigate('/register?autoFill=true');
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`w-full flex items-center justify-center gap-2 bg-[#0f1629] border border-blue-500/30 hover:border-blue-500/60 text-blue-400 hover:text-blue-300 font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-blue-500/10 ${className}`}
        >
            <Zap size={18} />
            <span>Register as Default</span>
        </button>
    );
};

export default QuickRegisterButton;
