/**
 * Converts a Google Drive sharing URL or viewer link into a direct download link
 * that can be used directly in an <img> tag or CSS url().
 *
 * Supporting:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=...
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://docs.google.com/file/d/FILE_ID/edit
 *
 * Returns the original URL if it does not match Google Drive formats.
 */
export function getDirectImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  // 1. Matches /file/d/FILE_ID format (e.g. drive.google.com or docs.google.com)
  const driveFileRegex =
    /(?:drive|docs)\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const fileMatch = url.match(driveFileRegex);
  if (fileMatch && fileMatch[1]) {
    return `https://docs.google.com/uc?export=view&id=${fileMatch[1]}`;
  }

  // 2. Matches open?id=FILE_ID format
  const driveOpenRegex = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  const openMatch = url.match(driveOpenRegex);
  if (openMatch && openMatch[1]) {
    return `https://docs.google.com/uc?export=view&id=${openMatch[1]}`;
  }

  return url;
}
