export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas export failed'))
    }, 'image/png')
  })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function canShareFiles(file: File): boolean {
  return typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })
}

// Shares via the Web Share API when the platform supports sharing files
// (lets someone tap straight into Instagram's share sheet); otherwise falls
// back to a plain image download. A user-cancelled share is not an error.
export async function shareOrDownloadImage(blob: Blob, filename: string): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], filename, { type: 'image/png' })

  if (canShareFiles(file)) {
    try {
      await navigator.share({ files: [file], title: 'LevelWOD' })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
      downloadBlob(blob, filename)
      return 'downloaded'
    }
  }

  downloadBlob(blob, filename)
  return 'downloaded'
}
