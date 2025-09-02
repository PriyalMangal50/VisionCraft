// Utility to ensure we never try to load external placeholder hosts
export function sanitizeImageUrl(url, fallback = '/images/no_image.png') {
  if (!url || typeof url !== 'string') return fallback;
  try {
    // Block known external placeholder host(s)
    if (/^https?:\/\/via\.placeholder\.com\b/i.test(url)) return fallback;
    return url;
  } catch {
    return fallback;
  }
}
