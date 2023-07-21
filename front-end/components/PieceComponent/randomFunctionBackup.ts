// const getRandomNumberInRange = (min: number, max: number) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// const defaultRandomization = (piece: Piece) => {
//   const maxRandomImageWidth = (window.innerWidth < 800 ? 200 : 300)
//   if (!piece.sizeOnWeb?.width) {
//     piece.sizeOnWeb.width = getRandomNumberInRange(150, maxRandomImageWidth)
//   }
//   if (!piece.sizeOnWeb?.height) {
//     piece.sizeOnWeb.height = getRandomNumberInRange(150, maxRandomImageWidth + 100)
//   }
//   if (!piece.position?.x) {
//     piece.position.x = getRandomNumberInRange(0, 1920)
//   }
//   if (!piece.position?.y) {
//     piece.position.y = getRandomNumberInRange(100, 2200)
//   }
// }

// const randomizationPuzzle = (piece: Piece) => {
//   const maxRandomImageWidth = (window.innerWidth < 800 ? 200 : 350)
//     piece.sizeOnWeb.width = getRandomNumberInRange(150, maxRandomImageWidth)
//     piece.sizeOnWeb.height = getRandomNumberInRange(150, maxRandomImageWidth + 100)
//     piece.position.x = getRandomNumberInRange(0, window.innerWidth + 200)
//     piece.position.y = getRandomNumberInRange(100, 1200)
// }

// const randomizationNodeAvatars = (piece: Piece) => {
//   const maxRandomImageWidth = (window.innerWidth < 800 ? 70 : 100)

//   if (!piece.sizeOnWeb?.width) {
//     piece.sizeOnWeb.width = getRandomNumberInRange(35, maxRandomImageWidth)
//   }

//   if (!piece.position?.x) {
//     piece.position.x = getRandomNumberInRange(0, 2000)
//   }

//   if (!piece.position?.y) {
//     piece.position.y = getRandomNumberInRange(100, 2700)
//   }
// }
const random = 'random'

export default random