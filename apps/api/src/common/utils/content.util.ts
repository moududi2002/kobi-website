// apps/api/src/common/utils/content.util.ts
 
import { Model } from 'mongoose';
import {
  generateSlug,
  ensureUniqueSlug,
} from './slug.util';
import { stripHtml, estimateReadingTimeMinutes } from './html.util';

export interface PreparedContentFields {
  slug: string;
  contentPlain: string;
  readingTimeMinutes?: number;
}

/**
 * Prepare slug + contentPlain (+ reading time for poems) from a raw DTO.
 *
 * @param model        Mongoose Model (for slug uniqueness)
 * @param title        Raw title
 * @param content      HTML content
 * @param providedSlug Optional slug from user (still checked for uniqueness)
 * @param excludeId    For updates — exclude the same document
 * @param withReadingTime If true, computes readingTimeMinutes
 */
export async function prepareContentFields(
  model: Model<any>,
  title: string,
  content: string,
  providedSlug?: string,
  excludeId?: string,
  withReadingTime = false,
): Promise<PreparedContentFields> {
  const baseSlug = providedSlug
    ? generateSlug(providedSlug)
    : generateSlug(title);
  const slug = await ensureUniqueSlug(model, baseSlug, excludeId);

  const contentPlain = stripHtml(content);

  const result: PreparedContentFields = { slug, contentPlain };
  if (withReadingTime) {
    result.readingTimeMinutes = estimateReadingTimeMinutes(contentPlain);
  }
  return result;
}

/**
 * Compute publishedAt based on status change.
 *
 * Rules:
 * - status becomes 'published' AND publishedAt is null → set now
 * - status becomes 'draft'/'archived' → keep old publishedAt (for history)
 *   — actually we nullify on unpublish, so re-publish gets fresh timestamp
 * - status stays 'published' → keep existing publishedAt
 */
export function computePublishedAt(
  newStatus: 'draft' | 'published' | 'archived',
  currentPublishedAt: Date | null | undefined,
): Date | null {
  if (newStatus === 'published' && !currentPublishedAt) {
    return new Date();
  }
  if (newStatus === 'draft' || newStatus === 'archived') {
    return null;
  }
  return currentPublishedAt ?? null;
}