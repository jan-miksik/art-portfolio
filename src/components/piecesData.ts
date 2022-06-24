export enum Topics {
  SANS_TOPIC = 'SANS_TOPIC',
  GEOMETRY = 'GEOMETRY',
  NODE_AVATARS = 'NODE_AVATARS'
}

export enum Techniques {
  DRAWING = 'DRAWING',
  PAINTING = 'PAINTING',
  PHOTO = 'PHOTO'
}

export enum TechniqueDescription {
  DRAWING_ON_PAPER = 'drawing on paper',
  OIL_PAINTING_ON_CANVAS = 'oil painting on canvas',
  ACRYLIC_PAINTING_ON_CANVAS = 'acrylic painting on canvas',
  MIXED_MEDIA = 'mixed media'
}

export const piecesData = {
  SANS_TOPIC: [
    {
      id: '1',
      name: 'history cylinder - historie válec - geskiedenis silinder(af)',
      description: '',
      image:
        'sans-topic/history cylinder - historie válec - geskiedenis silinder(af),2020,drawing on paper,275x100cm.jpg',
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
      image:
        'sans-topic/přejmenování - تغییر نام(fa) - renaming,2020,drawing on paper,30x21cm.jpg',
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
      image:
        'sans-topic/kalo(ceb) - hat - klobouk,2020,drawing on paper,30x21cm.jpg',
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
      image:
        'sans-topic/neighborhood - sousedství - vicinia(la),2020,drawing on paper,30x21cm.jpg',
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
      image: 'sans-topic/ooo,2020,drawing on paper,30x21cm.jpg',
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
    }
  ],

  GEOMETRY: [
    {
      id: '1',
      name: 'A and B',
      description: '',
      image: 'geometry/A and B,2019,drawing on paper,30x21cm.jpg',
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
      id: '2',
      name: 'almost circles - skoro kruhy - pafupifupi zozungulira(ny)',
      description: '',
      image:
        'geometry/almost circles - skoro kruhy - pafupifupi zozungulira(ny),2019,drawing on paper,30x21cm.jpg',
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
      id: '3',
      name: 'double cross',
      description: '',
      image: 'geometry/double cross,2018,drawing on paper,21x30cm.jpg',
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
      id: '4',
      name: 'Jiri and Jirina',
      description: '',
      image: 'geometry/Jiri and Jirina,2018,drawing on paper,30x21cm.jpg',
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
      id: '5',
      name: '簡略化(jp) - zjednodušování - simplification',
      description: '',
      image:
        'geometry/簡略化(jp) - zjednodušování - simplification,2019,drawing on paper,30x42cm.jpg',
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
      id: '1',
      name: 'about',
      description: '',
      image: 'node-avatars/about,2019,drawing on paper,7x10cm.png',
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
      id: '2',
      name: 'above',
      description: '',
      image: 'node-avatars/above,2018,drawing on paper,8x8cm.png',
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
      id: '3',
      name: 'absent',
      description: '',
      image: 'node-avatars/absent,2018,drawing on paper,8x7cm.png',
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
      id: '4',
      name: 'absorb',
      description: '',
      image: 'node-avatars/absorb,2018,drawing on paper,15x11cm.png',
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
      id: '5',
      name: 'abstract',
      description: '',
      image: 'node-avatars/abstract,2019,drawing on paper,6x7cm.png',
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
      id: '6',
      name: 'absurd',
      description: '',
      image: 'node-avatars/absurd,2019,drawing on paper,5x5cm.png',
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
  ]
}

// theme (geometry, sans-topic, puzzle, abstract, ...)
// technic (drawings, paintings, foto, text)
// time (until 2010, 2010-2015, 2015-2020, 2021, 2022)
// size (10-30x10-30, 30-70x30-70 ...)
// price (0-1000 kc, 1000-10k kc, 10k-100k)
// tags
