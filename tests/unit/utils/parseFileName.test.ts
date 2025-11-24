import { describe, it, expect, vi } from 'vitest'
import { parseFileName, parseDate, parseSize } from '~/utils/parseFileName'

describe('parseFileName', () => {
  it('should parse a simple filename and use default values for missing parts', () => {
    const result = parseFileName('artwork.jpg')
    expect(result.name).toBe('artwork')
    expect(result.created).toBeInstanceOf(Date)
    expect(result.size.unit).toBe('px')
  })

  it('should parse filename with name and date', () => {
    const timestamp = new Date('2024-01-15').getTime()
    const result = parseFileName(`artwork,${timestamp}.jpg`)
    expect(result.name).toBe('artwork')
    expect(result.created.getTime()).toBe(timestamp)
  })

  it('should parse filename with name, date, and size in cm', () => {
    const timestamp = new Date('2024-01-15').getTime()
    const result = parseFileName(`artwork,${timestamp},,50x70cm.jpg`)
    expect(result.name).toBe('artwork')
    expect(result.created.getTime()).toBe(timestamp)
    expect(result.size).toEqual({ x: 50, y: 70, unit: 'cm' })
  })

  it('should parse filename with name, date, and size in px', () => {
    const timestamp = new Date('2024-01-15').getTime()
    const result = parseFileName(`artwork,${timestamp},,1000x800px.jpg`)
    expect(result.name).toBe('artwork')
    expect(result.created.getTime()).toBe(timestamp)
    expect(result.size).toEqual({ x: 1000, y: 800, unit: 'px' })
  })

  it('should handle missing date and use epoch (deterministic default)', () => {
    const result = parseFileName('artwork.jpg')
    expect(result.name).toBe('artwork')
    expect(result.created.getTime()).toBe(0)
  })

  it('should handle invalid date string and use epoch (deterministic default)', () => {
    const result = parseFileName('artwork,invalid-date.jpg')
    expect(result.name).toBe('artwork')
    expect(result.created.getTime()).toBe(0)
  })

  it('should handle empty filename', () => {
    const result = parseFileName('')
    expect(result.name).toBe('Untitled')
    expect(result.created).toBeInstanceOf(Date)
  })

  it('should handle filename with only extension', () => {
    const result = parseFileName('.jpg')
    expect(result.name).toBe('Untitled')
  })
})

describe('parseDate', () => {
  it('should parse valid timestamp', () => {
    const timestamp = new Date('2024-01-15').getTime()
    const result = parseDate(String(timestamp))
    expect(result).not.toBeNull()
    expect(result!.getTime()).toBe(timestamp)
  })

  it('should return null for undefined when no defaultDate provided', () => {
    const result = parseDate(undefined)
    expect(result).toBeNull()
  })

  it('should return defaultDate for undefined when provided', () => {
    const defaultDate = new Date(0)
    const result = parseDate(undefined, defaultDate)
    expect(result).toBe(defaultDate)
  })

  it('should return null for invalid string when no defaultDate provided', () => {
    const result = parseDate('invalid')
    expect(result).toBeNull()
  })

  it('should return defaultDate for invalid string when provided', () => {
    const defaultDate = new Date(0)
    const result = parseDate('invalid', defaultDate)
    expect(result).toBe(defaultDate)
  })

  it('should return null for empty string when no defaultDate provided', () => {
    const result = parseDate('')
    expect(result).toBeNull()
  })

  it('should return defaultDate for empty string when provided', () => {
    const defaultDate = new Date(0)
    const result = parseDate('', defaultDate)
    expect(result).toBe(defaultDate)
  })
})

describe('parseSize', () => {
  it('should parse size in cm', () => {
    const result = parseSize('50x70cm')
    expect(result).toEqual({ x: 50, y: 70, unit: 'cm' })
  })

  it('should parse size in px', () => {
    const result = parseSize('1000x800px')
    expect(result).toEqual({ x: 1000, y: 800, unit: 'px' })
  })

  it('should return default px size for undefined', () => {
    const result = parseSize(undefined)
    expect(result.unit).toBe('px')
    expect(result.x).toBe(10000)
    expect(result.y).toBe(7000)
  })

  it('should return default px size for invalid format', () => {
    const result = parseSize('invalid')
    expect(result.unit).toBe('px')
    expect(result.x).toBe(10000)
    expect(result.y).toBe(7000)
  })

  it('should return default size for missing unit', () => {
    const result = parseSize('50x70')
    expect(result.unit).toBe('px')
    expect(result.x).toBe(10000)
    expect(result.y).toBe(7000)
  })

  it('should return default size for invalid dimensions', () => {
    const result = parseSize('0x0cm')
    expect(result.unit).toBe('cm')
    expect(result.x).toBe(50)
    expect(result.y).toBe(70)
  })

  it('should handle whitespace in size string', () => {
    const result = parseSize(' 50 x 70 cm ')
    expect(result).toEqual({ x: 50, y: 70, unit: 'cm' })
  })
})

