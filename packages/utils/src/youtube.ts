//packages/utils/src/youtube.ts
/**
 * Get YouTube thumbnail URL from video ID.
 */
export function getYouTubeThumbnail(
  videoId: string,
  quality: 'default' | 'hq' | 'max' = 'hq',
): string {
  const map = {
    default: 'default',
    hq: 'hqdefault',
    max: 'maxresdefault',
  } as const;
  return `https://i.ytimg.com/vi/${videoId}/${map[quality]}.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}