import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
}: ButtonProps) => {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-pink-500 text-white hover:bg-pink-600 active:scale-95',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 active:scale-95',
    outline: 'border-2 border-pink-500 text-pink-500 hover:bg-pink-50 active:scale-95',
  };
  
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <motion.button
      type={type}
      className={cn(
        'rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Загрузка...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};