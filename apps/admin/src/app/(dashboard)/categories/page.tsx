//apps/admin/src/app/(dashboard)/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  FolderTree,
  Lock,
  GripVertical,
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { Category } from '@kobi/types';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FormField } from '@/components/form/FormField';
import { toBengaliDigits } from '@kobi/utils';

{/* const schema = z.object({
  name: z.string().min(1).max(100),
  nameEn: z.string().min(1).max(100),
  slug: z.string().max(120).optional(),
  description: z.string().max(500).optional(),
  type: z.enum(['poem', 'lyric']),
  order: z.coerce.number().min(0).default(0),
});
*/}

const schema = z.object({
  name: z.string().min(1).max(100),
  nameEn: z.string().min(1).max(100),
  slug: z.string().max(120).optional(),
  description: z.string().max(500).optional(),
  type: z.enum(['poem', 'lyric']),
  order: z.number().min(0),
});

type FormValues = z.infer<typeof schema>;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<'lyric' | 'poem'>('lyric');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<Category[]>('/admin/categories');
      setCategories(res);
    } catch (err: any) {
      toast.error(err?.message || 'লোড ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/admin/categories/${deleteTarget._id}`);
      toast.success('বিভাগ মুছে ফেলা হয়েছে');
      setDeleteTarget(null);
      load();
    } catch (err: any) {
      toast.error(err?.message || 'মুছতে ব্যর্থ');
    }
  };

  const filtered = categories.filter((c) => c.type === activeType);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-bangla text-xl font-semibold text-[var(--color-admin-primary)]">
            বিভাগ ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-[var(--color-admin-text-muted)] font-bangla">
            হামদ, নাতে রাসুল, মায়ের গানসহ সব বিভাগ
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          নতুন বিভাগ
        </Button>
      </div>

      <Tabs
        value={activeType}
        onValueChange={(v) => setActiveType(v as any)}
      >
        <TabsList>
          <TabsTrigger value="lyric">
            লিরিক বিভাগ ({toBengaliDigits(categories.filter((c) => c.type === 'lyric').length)})
          </TabsTrigger>
          <TabsTrigger value="poem">
            কবিতা বিভাগ ({toBengaliDigits(categories.filter((c) => c.type === 'poem').length)})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeType}>
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-lg border p-12 text-center">
              <FolderTree className="w-10 h-10 text-[var(--color-admin-text-subtle)] mx-auto mb-3" />
              <p className="text-[var(--color-admin-text-muted)] font-bangla">
                কোনো বিভাগ নেই
              </p>
            </div>
          ) : (
            <ul className="bg-white rounded-lg border overflow-hidden divide-y">
              {filtered.map((cat) => (
                <li
                  key={cat._id}
                  className="p-4 flex items-center gap-4 hover:bg-[var(--color-admin-surface-hover)] transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-[var(--color-admin-text-subtle)] shrink-0" />
                  <div className="w-10 h-10 rounded-md bg-[var(--color-admin-primary)]/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-[var(--color-admin-primary)]">
                      {toBengaliDigits(cat.order)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bangla font-medium text-[var(--color-admin-text)]">
                        {cat.name}
                      </span>
                      <span className="text-xs text-[var(--color-admin-text-subtle)]">
                        {cat.nameEn}
                      </span>
                      {cat.isSystem && (
                        <Badge variant="outline">
                          <Lock className="w-3 h-3 mr-1" />
                          সিস্টেম
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-0.5 font-bangla">
                      /{cat.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(cat)}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-surface-hover)] hover:text-[var(--color-admin-text)] transition-colors"
                      aria-label="সম্পাদনা"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {!cat.isSystem && (
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-[var(--color-admin-text-muted)] hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      {/* Create / Edit Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        defaultType={activeType}
        onSuccess={() => {
          setDialogOpen(false);
          load();
        }}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>বিভাগ মুছবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.name}" স্থায়ীভাবে মুছে যাবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>মুছুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CategoryDialog({
  open,
  onOpenChange,
  initial,
  defaultType,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: Category | null;
  defaultType: 'lyric' | 'poem';
  onSuccess: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!initial;

  {/* const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      nameEn: initial?.nameEn ?? '',
      slug: initial?.slug ?? '',
      description: initial?.description ?? '',
      type: (initial?.type as any) ?? defaultType,
      order: initial?.order ?? 0,
    },
  });
  */}

  const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: {
    name: initial?.name ?? '',
    nameEn: initial?.nameEn ?? '',
    slug: initial?.slug ?? '',
    description: initial?.description ?? '',
    type: initial?.type ?? defaultType,
    order: initial?.order ?? 0,
  },
});


  useEffect(() => {
    reset({
      name: initial?.name ?? '',
      nameEn: initial?.nameEn ?? '',
      slug: initial?.slug ?? '',
      description: initial?.description ?? '',
      type: (initial?.type as any) ?? defaultType,
      order: initial?.order ?? 0,
    });
  }, [initial, defaultType, reset]);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await apiClient.patch(`/admin/categories/${initial!._id}`, data);
        toast.success('আপডেট হয়েছে');
      } else {
        await apiClient.post('/admin/categories', data);
        toast.success('তৈরি হয়েছে');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err?.message || 'ব্যর্থ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'বিভাগ সম্পাদনা' : 'নতুন বিভাগ'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="নাম (বাংলা)" required error={errors.name?.message}>
            <Input
              {...register('name')}
              placeholder="হামদ"
              className="font-bangla"
            />
          </FormField>

          <FormField label="Name (English)" required error={errors.nameEn?.message}>
            <Input {...register('nameEn')} placeholder="Hamd" />
          </FormField>

          <FormField label="Slug" hint="খালি রাখলে নাম থেকে তৈরি হবে">
            <Input {...register('slug')} placeholder="hamd" />
          </FormField>

          <FormField label="বিবরণ">
            <Textarea {...register('description')} rows={2} className="font-bangla" />
          </FormField>

          <FormField label="ক্রম (Order)">
            <Input type="number" {...register('order')} />
          </FormField>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              বাতিল
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isEdit ? 'আপডেট' : 'তৈরি করুন'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}