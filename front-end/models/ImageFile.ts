export type IImageFile = {
  id: string
  url: string
  lastUpdated?: number
}

export default class ImageFile {
  public id
  public url
  public lastUpdated

  constructor(data: IImageFile) {
    this.id = data.id || ''
    this.url = data.url || ''
    this.lastUpdated = data.lastUpdated || new Date('1990').getTime()
  }
}
