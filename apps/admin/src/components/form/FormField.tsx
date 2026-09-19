//apps/admin/src/components/form/FormField.tsx
interface Props {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, hint, required, children }: Props) {
  return (
    <div>
      {label && (
        <label className="block text-xs uppercase tracking-wider font-medium text-[var(--color-admin-text-muted)] mb-2 font-bangla">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-[var(--color-admin-text-subtle)] font-bangla">
          {hint}
        </p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-bangla">{error}</p>
      )}
    </div>
  );
}