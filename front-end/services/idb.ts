import ImageFile from '~/models/ImageFile'
import Dexie, { Table } from 'dexie'

export interface Image {
  id: string;
  lastUpdated: number;
  blob: Blob;
}

export default class MySubClassedDexie extends Dexie {
// export default class MySubClassedDexie {
  // 'Images' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  images!: Table<OImage>

  constructor() {
    super('myDatabase')
    this.version(1).stores({
      images: 'id, blob, lastUpdated'
    })
  }
}

const getBlobFromUrl = async (imageUrl: string): Promise<Blob> => {
  const res = await fetch(imageUrl)
  return await res.blob()
}

export const addImage = async (image: ImageFile) => {
  const { url, lastUpdated, id } = image
  const blob = await getBlobFromUrl(url)

  try {
    await db.images.put({
      id,
      blob,
      lastUpdated
    })
  } catch (error) {
    console.error('addImage error: ', error)
  }
}

export const updateImage = async (image: ImageFile) => {
  const { url, lastUpdated, id } = image

  const blob = await getBlobFromUrl(url)

  try {
    await db.images.update(id, {
      id,
      blob,
      lastUpdated
    })
  } catch (error) {
    console.error('updateImage error: ', error)
  }
}

export const getImage = async (id: string) => {
  try {
    const imageObj = await db.images.where('id')
      .equals(id).toArray()

    return imageObj[0]
  } catch (error) {
    return undefined
  }
}

export const db = new MySubClassedDexie()
