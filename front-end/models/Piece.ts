import { Techniques, Topics } from '~/components/piecesData';
import ImageFile from '~/models/ImageFile'
import { v4 as uuidv4 } from 'uuid'

export type IPiece = {
  id: string
  sys?: {
    id?: string
    version?: number
  }
  name: string
  topic: Topics
  technique: Techniques
  techniqueDescription: string
  created: Date
  image: ImageFile
  sizeInCm?: {
    x: number
    y: number
    z?: number
  }
  sizeInPx?: {
    x: number
    y: number
  }
  imageRaw?: File
  sizeOnWeb?: {
    width?: number
    height?: number
    widthMob?: number
    heightMob?: number
  }
  position?: {
    x: number
    y: number
    deg: number
    xMob: number
    yMob: number
    degMob?: number
  }

  isUpdated?: boolean
  isPublished?: boolean
  isUploadedToCf?: boolean

  randomizedPosition?: { transform: string }

  tags?: string[]
  description?: string
  price?: number
  updated?: Date
  isMoveableInPublic?: boolean
}

export default class Piece {
  public id
  public sys
  public name
  public topic
  public technique
  public techniqueDescription
  public created
  public image
  public sizeInCm
  public sizeInPx
  public sizeOnWeb
  public position

  // public randomizedPosition
  public tags
  public description
  public price
  public updated

  public imageRaw
  public isUpdated
  public isPublished
  public isUploadedToCf
  public isMoveableInPublic

  constructor(data: IPiece) {
    this.id = data.id || ''
    this.sys = {
      id: data?.sys?.id || uuidv4(),
      version: data?.sys?.version || 0
    }
    this.name = data.name || ''
    this.description = data.description || ''
    this.technique = data.technique || ''
    this.techniqueDescription = data.techniqueDescription || ''
    this.image = new ImageFile({
      id: data.image.id,
      url: data.image.url,
      lastUpdated: data.image.lastUpdated
    })
    this.sizeInCm = data.sizeInCm || { x: 0, y: 0 }
    this.sizeInPx = data.sizeInPx || { x: 0, y: 0 }
    this.sizeOnWeb = data.sizeOnWeb || { width: 0 }
    this.position = data.position || { x: 0, y: 0, deg: 0, xMob: 0, yMob: 0, degMob: 0 }
    this.price = data.price || 0
    this.topic = data.topic || ''
    this.tags = data.tags || ''
    this.created = data.created || Date
    this.updated = data.updated || Date
    this.imageRaw = data.imageRaw || null
    this.isUpdated = data.isUpdated || false
    this.isPublished = data.isPublished || false
    this.isUploadedToCf = data.isUploadedToCf || false
    this.isMoveableInPublic = data.isMoveableInPublic || false
  }
}
