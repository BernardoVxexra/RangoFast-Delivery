interface ButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'link';
}

export function Button({ label, onClick, loading, disabled, variant = 'primary' }: ButtonProps) {
  const className = variant === 'link' ? 'link' : `button button--${variant}`;
  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled || loading}>
      {loading ? 'Carregando...' : label}
    </button>
  );
}
