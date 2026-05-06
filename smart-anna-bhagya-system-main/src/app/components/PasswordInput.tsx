import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface Props {
  id: string;
  name: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
  className?: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
  id,
  name,
  placeholder,
  required = false,
  minLength,
  className = '',
  label,
  value,
  onChange,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">
          {label}
        </label>
      )}
      <div className="relative">
        <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 pointer-events-none" />
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          className={className || 'w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-3.5 bg-white rounded-lg sm:rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-sm sm:text-base'}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
