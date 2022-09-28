import { IPiece } from '~/models/Piece'

export enum Topics {
  SANS_TOPIC = 'sans topic',
  GEOMETRY = 'geometry',
  NODE_AVATARS = 'node avatars',
  PUZZLE = 'puzzle'
}

export enum Techniques {
  DRAWING = 'DRAWING',
  PAINTING = 'PAINTING',
  PHOTO = 'PHOTO',
  MIXED_MEDIA = 'MIXED_MEDIA'
}

export enum TechniqueDescription {
  DRAWING_ON_PAPER = 'drawing on paper',
  OIL_PAINTING_ON_CANVAS = 'oil painting on canvas',
  ACRYLIC_PAINTING_ON_CANVAS = 'acrylic painting on canvas',
  MIXED_MEDIA = 'mixed media'
}

const piecesData: {[key: string]: IPiece[]} = {
  SANS_TOPIC: [
    {
      id: '1',
      name: 'history cylinder - historie válec - geskiedenis silinder(af)',
      description: '',
      image: {
        id: '1',
        url: 'sans-topic/history cylinder - historie válec - geskiedenis silinder(af),2020,drawing on paper,275x100cm.jpg',
        lastUpdated: new Date('2020').getTime()
      },
      price: 0,
      topic: Topics.SANS_TOPIC,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 275,
        y: 100
      },
      tags: [],
      created: new Date('2020'),
      updated: new Date()
    },
    {
      id: '2',
      name: 'přejmenování - تغییر نام - renaming',
      description: '',
      image: {
        id: '2',
        url:
        'sans-topic/přejmenování - تغییر نام(fa) - renaming,2020,drawing on paper,30x21cm.jpg',
        lastUpdated: new Date('2020').getTime()
      },
      topic: Topics.SANS_TOPIC,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 30,
        y: 21
      },
      tags: [],
      created: new Date('2020'),
      updated: new Date()
    },
    {
      id: '3',
      name: 'kalo(ceb) - hat - klobouk',
      description: '',
      image: {
        id: '3',
        url:
        'sans-topic/kalo(ceb) - hat - klobouk,2020,drawing on paper,30x21cm.jpg',
        lastUpdated: new Date('2020').getTime()
      },
      topic: Topics.SANS_TOPIC,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 30,
        y: 21
      },
      tags: [],
      created: new Date('2020'),
      updated: new Date()
    },
    {
      id: '4',
      name: 'neighborhood - sousedství - vicinia(la)',
      description: '',
      image: {
        id: '4',
        url:
        'sans-topic/neighborhood - sousedství - vicinia(la),2020,drawing on paper,30x21cm.jpg',
        lastUpdated: new Date('2020').getTime()
      },
      topic: Topics.SANS_TOPIC,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 30,
        y: 21
      },
      tags: [],
      created: new Date('2020'),
      updated: new Date()
    },
    {
      id: '5',
      name: 'ooo',
      description: '',
      image: {
        id: '5',
        url: 'sans-topic/ooo,2021,drawing on paper,42x30cm.jpg',
        lastUpdated: new Date('2020').getTime()
      },
      topic: Topics.SANS_TOPIC,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 42,
        y: 30
      },
      tags: [],
      created: new Date('2021'),
      updated: new Date()
    },
    {
      id: '6',
      name: 'side project - kɛrɛfɛ porozɛ(bm) - vedlejší projekt',
      description: '',
      image: {
        id: '6',
        url:
        'sans-topic/side project - kɛrɛfɛ porozɛ(bm) - vedlejší projekt,2018,drawing on paper,30x21cm.jpg',
        lastUpdated: new Date('2020').getTime()
      },
      topic: Topics.SANS_TOPIC,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 30,
        y: 21
      },
      tags: [],
      created: new Date('2018'),
      updated: new Date()
    },
    {
      id: '7',
      name: 'tlak - 壓力(zh) - pressure',
      description: '',
      image: {
        id: '7',
        url:
        'sans-topic/tlak - 壓力(zh) - pressure,2019,drawing on paper,30x21cm.jpg',
        lastUpdated: new Date('2020').getTime()
      },
      topic: Topics.SANS_TOPIC,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 30,
        y: 21
      },
      tags: [],
      created: new Date('2019'),
      updated: new Date()
    },
    {
      id: '8',
      name: 'सपनों की लय(hi) - dream rhythm - rytmus snu',
      description: '',
      image: {
        id: '8',
        url:
        'sans-topic/सपनों की लय(hi) - dream rhythm - rytmus snu,2016,drawing on paper,42x30cm.jpg',
        lastUpdated: new Date('2020').getTime()
      },
      topic: Topics.SANS_TOPIC,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 42,
        y: 30
      },
      tags: [],
      created: new Date('2016'),
      updated: new Date()
    },
    {
      id: '9',
      name: 'ananas - ananász(hu) - pineapple',
      description: '',
      image: {
        id: '9',
        url:
        'sans-topic/ananas - ananász(hu) - pineapple,2016,drawing on paper,31x31cm.jpg',
        lastUpdated: new Date('2020').getTime()
      },
      topic: Topics.SANS_TOPIC,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 31,
        y: 31
      },
      tags: [],
      created: new Date('2016'),
      updated: new Date()
    },
    {
      id: '10',
      name: 'system language - γλώσσα συστήματος(el) - systémový jazyk',
      description: '',
      image: {
        id: '10',
        url:
        'sans-topic/system language - γλώσσα συστήματος(el) - systémový jazyk,2020,drawing on paper,26x22cm.jpg',
        lastUpdated: new Date('2020').getTime()
      },
      topic: Topics.SANS_TOPIC,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 26,
        y: 22
      },
      tags: [],
      created: new Date('2020'),
      updated: new Date()
    }
  ],

  GEOMETRY: [
    {
      id: '11',
      name: 'A and B',
      description: '',
      image: { id: '11', url: 'geometry/A and B,2019,drawing on paper,30x21cm.jpg', lastUpdated: new Date('2020').getTime() },
      price: 0,
      topic: Topics.GEOMETRY,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 30,
        y: 21
      },
      tags: [],
      created: new Date('2019'),
      updated: undefined
    },
    {
      id: '12',
      name: 'almost circles - skoro kruhy - pafupifupi zozungulira(ny)',
      description: '',
      image: {
        id: '12',
        url:
        'geometry/almost circles - skoro kruhy - pafupifupi zozungulira(ny),2019,drawing on paper,30x21cm.jpg',
        lastUpdated: new Date('2020').getTime()
      },
      topic: Topics.GEOMETRY,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 30,
        y: 21
      },
      tags: [],
      created: new Date('2019'),
      updated: undefined
    },
    {
      id: '13',
      name: 'double cross',
      description: '',
      image: { id: '13', url: 'geometry/double cross,2018,drawing on paper,21x30cm.jpg', lastUpdated: new Date('2020').getTime() },
      topic: Topics.GEOMETRY,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 21,
        y: 30
      },
      tags: [],
      created: new Date('2018'),
      updated: undefined
    },
    {
      id: '14',
      name: 'Jiri and Jirina',
      description: '',
      image: { id: '14', url: 'geometry/Jiri and Jirina,2018,drawing on paper,30x21cm.jpg', lastUpdated: new Date('2020').getTime() },
      price: 0,
      topic: Topics.NODE_AVATARS,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 30,
        y: 21
      },
      tags: [],
      created: new Date('2018'),
      updated: undefined
    },
    {
      id: '15',
      name: '簡略化(jp) - zjednodušování - simplification',
      description: '',
      image: {
        id: '15',
        url:
        'geometry/簡略化(jp) - zjednodušování - simplification,2019,drawing on paper,30x42cm.jpg',
        lastUpdated: new Date('2020').getTime()
      },
      price: 0,
      topic: Topics.NODE_AVATARS,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 30,
        y: 42
      },
      tags: [],
      created: new Date('2019'),
      updated: undefined
    }
  ],
  NODE_AVATARS: [
    {
      id: '16',
      name: 'about',
      description: '',
      image: { id: '16', url: 'node-avatars/about,2019,drawing on paper,7x10cm.png', lastUpdated: new Date('2020').getTime() },
      price: 0,
      topic: Topics.NODE_AVATARS,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 7,
        y: 10
      },
      tags: [],
      created: new Date('2019'),
      updated: undefined
    },
    {
      id: '17',
      name: 'above',
      description: '',
      image: { id: '17', url: 'node-avatars/above,2018,drawing on paper,8x8cm.webp', lastUpdated: new Date('2020').getTime() },
      topic: Topics.NODE_AVATARS,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 8,
        y: 8
      },
      tags: [],
      created: new Date('2018'),
      updated: new Date()
    },
    {
      id: '18',
      name: 'absent',
      description: '',
      image: { id: '18', url: 'node-avatars/absent,2018,drawing on paper,8x7cm.png', lastUpdated: new Date('2020').getTime() },
      topic: Topics.NODE_AVATARS,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 8,
        y: 7
      },
      tags: [],
      created: new Date('2019'),
      updated: new Date()
    },
    {
      id: '19',
      name: 'absorb',
      description: '',
      image: { id: '19', url: 'node-avatars/absorb,2018,drawing on paper,15x11cm.webp', lastUpdated: new Date('2020').getTime() },
      topic: Topics.NODE_AVATARS,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 15,
        y: 11
      },
      tags: [],
      created: new Date('2019'),
      updated: new Date()
    },
    {
      id: '20',
      name: 'abstract',
      description: '',
      image: { id: '20', url: 'node-avatars/abstract,2019,drawing on paper,6x7cm.png', lastUpdated: new Date('2020').getTime() },
      topic: Topics.NODE_AVATARS,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 6,
        y: 7
      },
      tags: [],
      created: new Date('2019'),
      updated: new Date()
    },
    {
      id: '21',
      name: 'absurd',
      description: '',
      image: { id: '21', url: 'node-avatars/absurd,2019,drawing on paper,5x5cm.webp', lastUpdated: new Date('2020').getTime() },
      topic: Topics.NODE_AVATARS,
      price: 0,
      technique: Techniques.DRAWING,
      techniqueDescription: TechniqueDescription.DRAWING_ON_PAPER,
      sizeInCm: {
        x: 5,
        y: 5
      },
      tags: [],
      created: new Date('2019'),
      updated: new Date()
    }
  ],
  PUZZLE: [
    {
      id: '22',
      name: 'puzzle 1',
      description: '',
      image: { id: '22', url: 'puzzle/puzzle 1,2013,70x50cm.webp', lastUpdated: new Date('2021').getTime() },
      topic: Topics.PUZZLE,
      price: 0,
      technique: Techniques.MIXED_MEDIA,
      techniqueDescription: TechniqueDescription.MIXED_MEDIA,
      sizeInCm: {
        x: 70,
        y: 50
      },
      tags: [],
      created: new Date('2013'),
      updated: new Date()
    },
    {
      id: '23',
      name: 'puzzle 1 detail',
      description: '',
      image: { id: '23', url: 'puzzle/puzzle 1 detail,2013,70x50cm.webp', lastUpdated: new Date('2021').getTime() },
      topic: Topics.PUZZLE,
      price: 0,
      technique: Techniques.MIXED_MEDIA,
      techniqueDescription: TechniqueDescription.MIXED_MEDIA,
      sizeInCm: {
        x: 70,
        y: 50
      },
      tags: [],
      created: new Date('2013'),
      updated: new Date()
    },
    {
      id: '24',
      name: 'puzzle 2',
      description: '',
      image: { id: '24', url: 'puzzle/puzzle 2,2014,70x50cm.jpg', lastUpdated: new Date('2020').getTime() },
      topic: Topics.PUZZLE,
      price: 0,
      technique: Techniques.MIXED_MEDIA,
      techniqueDescription: TechniqueDescription.MIXED_MEDIA,
      sizeInCm: {
        x: 70,
        y: 50
      },
      tags: [],
      created: new Date('2014'),
      updated: new Date()
    },
    {
      id: '25',
      name: 'puzzle 2 detail',
      description: '',
      image: { id: '25', url: 'puzzle/puzzle 2 detail,2014,70x50cm.webp', lastUpdated: new Date('2021').getTime() },
      topic: Topics.PUZZLE,
      price: 0,
      technique: Techniques.MIXED_MEDIA,
      techniqueDescription: TechniqueDescription.MIXED_MEDIA,
      sizeInCm: {
        x: 70,
        y: 50
      },
      tags: [],
      created: new Date('2014'),
      updated: new Date()
    },
    {
      id: '26',
      name: 'puzzle 3',
      description: '',
      image: { id: '26', url: 'puzzle/puzzle 3,mixed media,2016,40x100cm.jpg', lastUpdated: new Date('2020').getTime() },
      topic: Topics.PUZZLE,
      price: 0,
      technique: Techniques.MIXED_MEDIA,
      techniqueDescription: TechniqueDescription.MIXED_MEDIA,
      sizeInCm: {
        x: 40,
        y: 100
      },
      tags: [],
      created: new Date('2016'),
      updated: new Date()
    },
    {
      id: '27',
      name: 'puzzle 3 detail',
      description: '',
      image: { id: '27', url: 'puzzle/puzzle 3 detail,mixed media,2016,40x100cm.webp', lastUpdated: new Date('2021').getTime() },
      topic: Topics.PUZZLE,
      price: 0,
      technique: Techniques.MIXED_MEDIA,
      techniqueDescription: TechniqueDescription.MIXED_MEDIA,
      sizeInCm: {
        x: 40,
        y: 100
      },
      tags: [],
      created: new Date('2016'),
      updated: new Date()
    }
  ]
}

export default piecesData

// theme (geometry, sans-topic, puzzle, abstract, ...)
// technic (drawings, paintings, foto, text)
// time (until 2010, 2010-2015, 2015-2020, 2021, 2022)
// size (10-30x10-30, 30-70x30-70 ...)
// price (0-1000 kc, 1000-10k kc, 10k-100k)
// tags