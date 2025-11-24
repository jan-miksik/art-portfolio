export interface ParsedFileName {
  name: string
  created: Date
  size: {
    x: number
    y: number
    unit: 'cm' | 'px'
  }
}

const DEFAULT_SIZE_CM = { x: 50, y: 70, unit: 'cm' as const }
const DEFAULT_SIZE_PX = { x: 10000, y: 7000, unit: 'px' as const }

export const parseDate = (dateStr: string | undefined): Date => {
  if (!dateStr) {
    return new Date() // Use current date as default
  }
  
  const timestamp = Number(dateStr)
  if (isNaN(timestamp)) {
    return new Date() // Use current date if invalid
  }
  
  // Use timestamp directly as milliseconds since epoch
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) {
    return new Date() // Use current date if invalid
  }
  
  return date
}

export const parseSize = (sizeStr: string | undefined): { x: number; y: number; unit: 'cm' | 'px' } => {
  if (!sizeStr) {
    return DEFAULT_SIZE_PX // Default to pixels
  }
  
  const trimmed = sizeStr.trim()
  const index = trimmed.indexOf('x')
  
  if (index === -1) {
    return DEFAULT_SIZE_PX // Default if no 'x' separator
  }
  
  const widthStr = trimmed.substring(0, index).trim()
  const heightStr = trimmed.substring(index + 1).trim()
  
  const isSizeInCm = heightStr.includes('cm')
  const isSizeInPx = heightStr.includes('px')
  
  if (!isSizeInCm && !isSizeInPx) {
    return DEFAULT_SIZE_PX // Default if no unit
  }
  
  const unit = isSizeInCm ? 'cm' : 'px'
  const width = parseInt(widthStr, 10)
  const height = parseInt(heightStr.replace(/cm|px/g, '').trim(), 10)
  
  if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
    return unit === 'cm' ? DEFAULT_SIZE_CM : DEFAULT_SIZE_PX
  }
  
  return { x: width, y: height, unit }
}

export const parseFileName = (fileName: string): ParsedFileName => {
  // Remove the file extension to get the base name
  const description = fileName.replace(/\.[^/.]+$/, '')
  const parts = description.split(',').map(part => part.trim())
  
  // Use filename (without extension) as name if no parts provided
  const name = parts[0] || description || fileName.replace(/\.[^/.]+$/, '') || 'Untitled'
  
  // Try to parse date from parts[1], use current date as default
  const dateStr = parts[1]
  const created = parseDate(dateStr)
  
  // Try to parse size from parts[3] or parts[2], use default if not found
  const sizeStr = parts[3] || parts[2]
  const size = parseSize(sizeStr)
  
  return { name, created, size }
}

