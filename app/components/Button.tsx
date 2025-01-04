import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  return (
    <button
      className={`flex items-center gap-2 rounded-md ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="icon-left">{icon}</span>
      )}
      {children && <span className="button-text">{children}</span>}
      {icon && iconPosition === 'right' && (
        <span className="icon-right">{icon}</span>
      )}
    </button>
  );
};

export default Button;
