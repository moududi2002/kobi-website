// apps/api/src/common/utils/slug.util.ts
import slugify from 'slugify';
import { Model } from 'mongoose';

/**
 * Bangla-safe slug generator.
 * Uses slugify with unicode preservation for Bengali characters.
 *
 * Example:
 *   generateSlug('বৃষ্টির দিনে')          → 'বৃষ্টির-দিনে'
 *   generateSlug('হামদ - আল্লাহর প্রশংসা') → 'হামদ-আল্লাহর-প্রশংসা'
 */
export function generateSlug(input: string): string {
  if (!input || typeof input !== 'string') return '';

  const slug = slugify(input.trim(), {
    replacement: '-',
    remove: /[*+~.()'"!:@,;?/\\[\]{}|<>#$%^&=`]/g,
    lower: false, // Bangla-র case নেই, English-এর ক্ষেত্রে lowercase রাখতে চাইলে true
    strict: false,
    locale: 'bn',
    trim: true,
  });

  // Collapse multiple dashes
  return slug.replace(/-+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Ensure slug is unique within a collection.
 * If a document with the same slug exists, appends -2, -3, ...
 *
 * @param model        Mongoose Model
 * @param baseSlug     The slug to check
 * @param excludeId    Optional: exclude this document id (for updates)
 */
export async function ensureUniqueSlug(
  model: Model<any>,
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  if (!baseSlug) baseSlug = 'untitled';

  let slug = baseSlug;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query: Record<string, any> = { slug };
    if (excludeId) query._id = { $ne: excludeId };

    const exists = await model.exists(query);
    if (!exists) return slug;

    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}