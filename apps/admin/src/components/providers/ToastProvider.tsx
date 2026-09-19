//apps/admin/src/components/providers/ToastProvider.tsx
'use client';

import { Toaster } from 'sonner';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-bangla',
          style: {
            background: '#ffffff',
            border: '1px solid #e5e0d6',
            color: '#262421',
          },
        }}
        richColors
        closeButton
      />
    </>
  );
}