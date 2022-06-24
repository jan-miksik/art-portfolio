import { Topics } from '@/components/piecesData'

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
  image: string
  sizeInCm: {
    x: number
    y: number
    z?: number
  }
  randomizedPosition: { transform: string }

  tags: string[]
  description: string
  price: number
  updated: Date
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
    this.image = data.image || ''
    this.sizeInCm = data.sizeInCm || { x: 0, y: 0 }
    this.price = data.price || 0
    this.topic = data.topic || ''
    this.tags = data.tags || ''
    this.created = data.created || Date
    this.updated = data.updated || Date
    this.randomizedPosition = this.getRandomizedPosition()
  }

  getRandomizedPosition () {
    if (this.topic === Topics.SANS_TOPIC) {
      return {
        transform: `rotate(${generateRandomNumberPlusMinus(9)}deg) scale(${
          randomRange(3, 12) / 10
        }) translateY(${generateRandomNumberPlusMinus(
          170
        )}px) translateX(${generateRandomNumberPlusMinus(100)}px)`
      }
    }
    if (this.topic === Topics.GEOMETRY) {
      return {
        transform: `scale(${
          randomRange(3, 12) / 10
        }) translateY(${generateRandomNumberPlusMinus(
          180
        )}px) translateX(${generateRandomNumberPlusMinus(110)}px)`
      }
    }
    if (this.topic === Topics.NODE_AVATARS) {
      return {
        transform: `scale(${
          randomRange(3, 8) / 10
        }) translateY(${generateRandomNumberPlusMinus(
          110
        )}px) translateX(${generateRandomNumberPlusMinus(110)}px)`
      }
    }
  }
}
