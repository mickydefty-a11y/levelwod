import type { PRCardData, StatsCardData, StreakCardData, JourneyCardData } from '../types/statsCard'

export const STATS_CARD_SIZE = 1080

const COLOR_BG = '#000000'
const COLOR_ACCENT = '#c6ff33'
const COLOR_INK = '#f2f2f2'
const COLOR_INK_MUTED = '#9a9a9e'

let iconPromise: Promise<HTMLImageElement> | null = null

function loadIcon(): Promise<HTMLImageElement> {
  if (!iconPromise) {
    iconPromise = new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = '/icons/icon-512.png'
    })
  }
  return iconPromise
}

function drawFrame(ctx: CanvasRenderingContext2D, icon: HTMLImageElement) {
  const size = STATS_CARD_SIZE
  ctx.fillStyle = COLOR_BG
  ctx.fillRect(0, 0, size, size)

  const iconSize = 120
  ctx.drawImage(icon, (size - iconSize) / 2, 96, iconSize, iconSize)

  ctx.fillStyle = COLOR_INK
  ctx.font = '600 40px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('LevelWOD', size / 2, size - 72)
}

function drawBigNumber(ctx: CanvasRenderingContext2D, value: string, y: number) {
  ctx.fillStyle = COLOR_ACCENT
  ctx.font = '700 220px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(value, STATS_CARD_SIZE / 2, y)
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, y: number) {
  ctx.fillStyle = COLOR_INK_MUTED
  ctx.font = '500 44px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(text, STATS_CARD_SIZE / 2, y)
}

function drawStreakCard(ctx: CanvasRenderingContext2D, data: StreakCardData) {
  drawBigNumber(ctx, String(data.currentStreak), 560)
  drawLabel(ctx, data.currentStreak === 1 ? 'day streak' : 'day streak', 630)
  ctx.fillStyle = COLOR_INK
  ctx.font = '500 38px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(
    `${data.totalSessions} session${data.totalSessions === 1 ? '' : 's'} completed all-time`,
    STATS_CARD_SIZE / 2,
    720,
  )
}

function drawPRCard(ctx: CanvasRenderingContext2D, data: PRCardData) {
  ctx.fillStyle = COLOR_INK
  ctx.font = '600 48px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(data.movementName, STATS_CARD_SIZE / 2, 460)

  ctx.fillStyle = COLOR_ACCENT
  ctx.font = '700 160px system-ui, sans-serif'
  ctx.fillText(data.valueLabel, STATS_CARD_SIZE / 2, 590)

  if (data.improvementLabel) {
    drawLabel(ctx, data.improvementLabel, 660)
  }
}

function drawJourneyCard(ctx: CanvasRenderingContext2D, data: JourneyCardData) {
  const stats: [string, string][] = [
    [String(data.programsCompleted), data.programsCompleted === 1 ? 'program completed' : 'programs completed'],
    [String(data.totalSessions), data.totalSessions === 1 ? 'session logged' : 'sessions logged'],
    [String(data.skillsUnlocked), 'skills at RX+'],
  ]

  const startY = 430
  const rowGap = 170
  stats.forEach(([value, label], i) => {
    const y = startY + i * rowGap
    ctx.fillStyle = COLOR_ACCENT
    ctx.font = '700 100px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(value, STATS_CARD_SIZE / 2, y)
    drawLabel(ctx, label, y + 56)
  })
}

export async function renderStatsCard(canvas: HTMLCanvasElement, data: StatsCardData): Promise<void> {
  canvas.width = STATS_CARD_SIZE
  canvas.height = STATS_CARD_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  const icon = await loadIcon()
  drawFrame(ctx, icon)

  if (data.type === 'streak') drawStreakCard(ctx, data)
  else if (data.type === 'pr') drawPRCard(ctx, data)
  else drawJourneyCard(ctx, data)
}
