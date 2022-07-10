import Dexie, { Table } from 'dexie'

export interface Image {
  id: string;
  lastUpdated: number;
  blob: Blob;
}

export class MySubClassedDexie extends Dexie {
  // 'Images' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  images!: Table<Image>

  constructor() {
    super('myDatabase')
    this.version(1).stores({
      images: 'id, blob, lastUpdated'
    })
  }
}

const getBlobFromUrl = async (imageUrl: string): Promise<Blob> => {
  const formattedImageUrl = imageUrl.includes('https://') ? imageUrl : new URL(`../assets/${imageUrl}`, import.meta.url)?.href
  const res = await fetch(formattedImageUrl)
  return await res.blob()
}

export const addImage = async ({ image, id }: {image: {url: string, lastUpdated: number}, id: string}) => {
  const { url, lastUpdated } = image
  const blob = await getBlobFromUrl(url)

  try {
    await db.images.put({
      id,
      blob,
      lastUpdated
    })
  } catch (error) {
    console.error('error: ', error)
  }
}

export const updateImage = async ({ image, id }: {image: {url: string, lastUpdated: number}, id: string}) => {
  const { url, lastUpdated } = image

  const blob = await getBlobFromUrl(url)

  try {
    await db.images.update(id, {
      id,
      blob,
      lastUpdated
    })
  } catch (error) {
    console.error(error)
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
