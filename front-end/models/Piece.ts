import { Topics } from '~/components/piecesData';
import ImageFile from '~/models/ImageFile'

const generateRandomNumberPlusMinus = (max: number) => {
  return Math.floor((Math.random() * max + 1) * (Math.random() - 0.5) * 2)
}

const randomRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export type IPiece = {
  id: string
  name: string
  topic: string
  technique: string
  techniqueDescription: string
  created: Date
  image: ImageFile
  sizeInCm: {
    x: number
    y: number
    z?: number
  }
  sizeOnWeb?: {
    width?: number
    height?: number
  }
  position?: {
    x: number
    y: number
    deg: number
  }

  randomizedPosition?: { transform: string }

  tags?: string[]
  description?: string
  price?: number
  updated?: Date
}

export default class Piece {
  public id
  public name
  public topic
  public technique
  public techniqueDescription
  public created
  public image
  public sizeInCm
  public sizeOnWeb
  public position

  public randomizedPosition
  public tags
  public description
  public price
  public updated

  constructor(data: IPiece) {
    this.id = data.id || ''
    this.name = data.name || ''
    this.description = data.description || ''
    this.technique = data.technique || ''
    this.techniqueDescription = data.techniqueDescription || ''
    this.image = new ImageFile({ id: data.id, url: data.image.url, lastUpdated: data.image.lastUpdated })
    this.sizeInCm = data.sizeInCm || { x: 0, y: 0 }
    this.sizeOnWeb = data.sizeOnWeb || { width: 500 }
    this.position = data.position || { x: 0, y: 0, deg: 0 }
    this.price = data.price || 0
    this.topic = data.topic || ''
    this.tags = data.tags || ''
    this.created = data.created || Date
    this.updated = data.updated || Date
    this.randomizedPosition = this.getRandomizedPosition()
  }
  
  getRandomizedPosition() {
    if (this.topic === Topics.SANS_TOPIC) {
      return {
        transform: `rotate(${generateRandomNumberPlusMinus(3)}deg) scale(${
          randomRange(6, 12) / 10
        }) translateY(${generateRandomNumberPlusMinus(
          170
        )}px) translateX(${generateRandomNumberPlusMinus(50)}px)`
      }
    }
    if (this.topic === Topics.GEOMETRY) {
      return {
        transform: `scale(${
          randomRange(7, 12) / 10
        }) translateY(${generateRandomNumberPlusMinus(
          180
        )}px) translateX(${generateRandomNumberPlusMinus(50)}px)`
      }
    }
    if (this.topic === Topics.NODE_AVATARS) {
      return {
        transform: `scale(${
          randomRange(5, 8) / 10
        }) translateY(${generateRandomNumberPlusMinus(
          110
        )}px) translateX(${generateRandomNumberPlusMinus(50)}px)`
      }
    }
    if (this.topic === Topics.PUZZLE) {
      return {
        transform: `scale(${
          randomRange(9, 12) / 10
        }) translateY(${generateRandomNumberPlusMinus(
          180
        )}px) translateX(${generateRandomNumberPlusMinus(50)}px)`
      }
    }
  }
}
