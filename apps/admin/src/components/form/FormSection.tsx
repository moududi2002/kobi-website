//apps/admin/src/components/form/FormSection.tsx
interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function FormSection({ title, description, children, actions }: Props) {
  return (
    <section className="bg-[var(--color-admin-surface)] rounded-lg border border-[var(--color-admin-border)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-admin-border)] flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bangla text-base font-semibold text-[var(--color-admin-text)]">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-[var(--color-admin-text-muted)] mt-0.5 font-bangla">
              {description}
            </p>
          )}
        </div>
        {actions}
      </div>
      <div className="p-5 space-y-5">{children}</div>
    </section>
  );
}