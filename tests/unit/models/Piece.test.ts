import { describe, it, expect } from 'vitest'
import Piece from '~/models/Piece'
import ImageFile from '~/models/ImageFile'
import { Topics, Techniques, TechniqueDescription } from '~/components/piecesData'

describe('Piece', () => {
  const createMockImageFile = () => new ImageFile({
    id: 'test-image-id',
    url: 'https://example.com/image.jpg',
    lastUpdated: Date.now()
  })

  const createMinimalPiece = (overrides = {}) => new Piece({
    id: 'test-id',
    name: 'Test Piece',
    topic: Topics.DIGITAL,
    technique: Techniques.MIXED_MEDIA,
    techniqueDescription: TechniqueDescription.DIGITAL_BITMAP,
    created: new Date(),
    image: createMockImageFile(),
    ...overrides
  })

  describe('basic instantiation', () => {
    it('should create a piece with all provided fields', () => {
      const created = new Date('2024-01-15')
      const piece = createMinimalPiece({
        description: 'Test description',
        tags: ['tag1', 'tag2'],
        price: 100.50,
        sizeInCm: { x: 50, y: 70 },
        sizeInPx: { x: 1000, y: 800 },
        position: { x: 100, y: 200, deg: 45, xMob: 50, yMob: 100, degMob: 30 },
        created
      })

      expect(piece.id).toBe('test-id')
      expect(piece.name).toBe('Test Piece')
      expect(piece.topic).toBe(Topics.DIGITAL)
      expect(piece.description).toBe('Test description')
      expect(piece.tags).toEqual(['tag1', 'tag2'])
      expect(piece.price).toBe(100.50)
      expect(piece.sizeInCm).toEqual({ x: 50, y: 70 })
      expect(piece.sizeInPx).toEqual({ x: 1000, y: 800 })
      expect(piece.position?.degMob).toBe(30)
      expect(piece.created).toBe(created)
      expect(piece.image).toBeInstanceOf(ImageFile)
    })

    it('should use default values for optional fields', () => {
      const piece = createMinimalPiece()

      expect(piece.sizeInCm).toEqual({ x: 0, y: 0 })
      expect(piece.sizeInPx).toEqual({ x: 0, y: 0 })
      expect(piece.position).toEqual({
        x: 0,
        y: 0,
        deg: 0,
        xMob: 0,
        yMob: 0,
        degMob: 0
      })
      expect(piece.sizeOnWeb).toEqual({ width: 0 })
      expect(piece.tags).toEqual([])
      expect(piece.price).toBe(0)
      expect(piece.isUpdated).toBe(false)
      expect(piece.isPublished).toBe(false)
      expect(piece.isUploadedToCf).toBe(false)
      expect(piece.isMoveableInPublic).toBe(false)
      expect(piece.isArchived).toBe(false)
    })
  })

  describe('sys data handling', () => {
    it('should use provided sys.id and version', () => {
      const piece = createMinimalPiece({
        sys: { id: 'contentful-id', version: 5 }
      })

      expect(piece.sys?.id).toBe('contentful-id')
      expect(piece.sys?.version).toBe(5)
    })

    it('should generate UUID for sys.id when not provided', () => {
      const piece1 = createMinimalPiece()
      const piece2 = createMinimalPiece()

      expect(piece1.sys?.id).toBeDefined()
      expect(typeof piece1.sys?.id).toBe('string')
      expect(piece1.sys?.id.length).toBeGreaterThan(0)
      // UUIDs should be unique
      expect(piece1.sys?.id).not.toBe(piece2.sys?.id)
    })

    it('should default sys.version to 0 when not provided', () => {
      const piece = createMinimalPiece()
      expect(piece.sys?.version).toBe(0)
    })
  })

  describe('edge cases and defaults', () => {
    it('should handle empty string values', () => {
      const piece = new Piece({
        id: '',
        name: '',
        topic: Topics.DIGITAL,
        technique: Techniques.MIXED_MEDIA,
        techniqueDescription: TechniqueDescription.DIGITAL_BITMAP,
        created: new Date(),
        image: createMockImageFile()
      })

      expect(piece.id).toBe('')
      expect(piece.name).toBe('')
    })

    it('should handle missing optional nested objects', () => {
      const piece = createMinimalPiece({
        sizeInCm: undefined,
        sizeInPx: undefined,
        position: undefined
      })

      expect(piece.sizeInCm).toEqual({ x: 0, y: 0 })
      expect(piece.sizeInPx).toEqual({ x: 0, y: 0 })
      expect(piece.position).toEqual({
        x: 0,
        y: 0,
        deg: 0,
        xMob: 0,
        yMob: 0,
        degMob: 0
      })
    })

    it('should handle null imageRaw', () => {
      const piece = createMinimalPiece({ imageRaw: null })
      expect(piece.imageRaw).toBeNull()
    })

    it('should create new ImageFile instance from provided data', () => {
      const imageData = {
        id: 'custom-id',
        url: 'https://custom.com/image.jpg',
        lastUpdated: 1234567890
      }
      const piece = new Piece({
        id: 'test-id',
        name: 'Test',
        topic: Topics.DIGITAL,
        technique: Techniques.MIXED_MEDIA,
        techniqueDescription: TechniqueDescription.DIGITAL_BITMAP,
        created: new Date(),
        image: imageData as any
      })

      expect(piece.image).toBeInstanceOf(ImageFile)
      expect(piece.image.id).toBe('custom-id')
      expect(piece.image.url).toBe('https://custom.com/image.jpg')
    })

    it('should handle dates correctly', () => {
      const created = new Date('2024-01-15')
      const updated = new Date('2024-01-20')
      const piece = createMinimalPiece({ created, updated })

      expect(piece.created).toBe(created)
      expect(piece.updated).toBe(updated)
    })

    it('should default created and updated to current date when not provided', () => {
      const before = new Date()
      const piece = new Piece({
        id: 'test-id',
        name: 'Test',
        topic: Topics.DIGITAL,
        technique: Techniques.MIXED_MEDIA,
        techniqueDescription: TechniqueDescription.DIGITAL_BITMAP,
        image: createMockImageFile()
      } as any)
      const after = new Date()

      expect(piece.created.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(piece.created.getTime()).toBeLessThanOrEqual(after.getTime())
      expect(piece.updated.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(piece.updated.getTime()).toBeLessThanOrEqual(after.getTime())
    })
  })
})

