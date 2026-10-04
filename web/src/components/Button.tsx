interface ButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, loading, disabled, variant = 'primary' }: ButtonProps) {
  return (
    <button
      type="button"
      className={`button button--${variant}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Carregando...' : label}
    </button>
  );
}
