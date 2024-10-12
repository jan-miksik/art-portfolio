
// <name>,<year>,<technique>,<width>x<height><cm | px>, <additional info> //
// ex.:: A and B,2019,drawing on paper,30x21cm.png

export enum Topics {
  FREE_TOPIC = 'free topic',
  GEOMETRY = 'geometry',
  NODE_AVATARS = 'node avatars',
  PUZZLE = 'puzzle',
  NFT_COLLECTION = 'collection',
  SANS_TOPIC = 'sans topic',
  DIGITAL = 'digital'
}

// export enum TopicIcon {
//   FREE_TOPIC = 'free topic',
//   GEOMETRY = 'geometry',
//   NODE_AVATARS = 'node avatars',
//   PUZZLE = 'puzzle',
//   NFT_COLLECTION = 'nft collection'
// }

export enum Techniques {
  DRAWING = 'drawing',
  PAINTING = 'painting',
  PHOTO = 'photo',
  MIXED_MEDIA = 'mixed media'
}

export enum TechniqueDescription {
  DRAWING_ON_PAPER = 'drawing on paper',
  OIL_PAINTING_ON_CANVAS = 'oil painting on canvas',
  ACRYLIC_PAINTING_ON_CANVAS = 'acrylic painting on canvas',
  MIXED_MEDIA = 'mixed media',
  OIL_AND_ACRYLIC_PAINTING_ON_CANVAS = 'oil and acrylic painting on canvas',
  OIL_AND_ACRYLIC_PAINTING_ON_UNSTRETCHED_CANVAS = 'oil and acrylic painting on unstretched canvas',
  DIGITAL_BITMAP = 'digital (bitmap)',
  DIGITAL_VECTOR = 'digital (vector)',
  // ?oil on unstretched canvas
  // ?acrylic on unstretched canvas
  // ?digital
}

export enum AdditionalInfo {
  IN_PRIVATE_COLLECTION = 'in private collection'
  // :: sold
  // :: lost
  // :: documentation of the exhibition
  // :: invitation to the exhibition
  // :: borrowed
}


const piecesData = {}

export default piecesData

