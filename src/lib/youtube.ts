// Accepts whatever a user is likely to paste from YouTube — a bare video ID,
// a youtu.be share link, a full youtube.com/watch link, or a Shorts link —
// and normalizes it to an embeddable URL. Returns null if it can't be parsed.
export function getYouTubeEmbedUrl(input: string | null | undefined): string | null {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed) return null

  if (/^[\w-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`
  }

  try {
    const url = new URL(trimmed)

    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.slice(1)
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (url.hostname.includes('youtube.com')) {
      if (url.pathname === '/watch') {
        const id = url.searchParams.get('v')
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      if (url.pathname.startsWith('/embed/')) {
        return trimmed
      }
      if (url.pathname.startsWith('/shorts/')) {
        const id = url.pathname.split('/')[2]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
    }
  } catch {
    return null
  }

  return null
}
