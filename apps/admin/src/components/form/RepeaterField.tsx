//apps/admin/src/components/form/RepeaterField.tsx
'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props<T> {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  render: (item: T, index: number, update: (item: T) => void) => React.ReactNode;
  emptyLabel?: string;
  addLabel?: string;
}

export function RepeaterField<T>({
  items,
  onChange,
  newItem,
  render,
  emptyLabel = 'কিছু যোগ করা হয়নি',
  addLabel = 'যোগ করুন',
}: Props<T>) {
  const update = (idx: number, item: T) => {
    const next = [...items];
    next[idx] = item;
    onChange(next);
  };

  const remove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const add = () => onChange([...items, newItem()]);

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-[var(--color-admin-text-subtle)] font-bangla text-center py-4">
          {emptyLabel}
        </p>
      )}

      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative flex gap-2 p-3 border border-[var(--color-admin-border)] rounded-md bg-[var(--color-admin-bg)]"
        >
          <GripVertical className="w-4 h-4 text-[var(--color-admin-text-subtle)] mt-2 shrink-0" />
          <div className="flex-1 min-w-0">
            {render(item, idx, (updated) => update(idx, updated))}
          </div>
          <button
            type="button"
            onClick={() => remove(idx)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-colors shrink-0 mt-1"
            aria-label="মুছুন"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="w-4 h-4" />
        {addLabel}
      </Button>
    </div>
  );
}