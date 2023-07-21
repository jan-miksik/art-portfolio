import Piece from '../../models/Piece';

const selectedPiece = ref<Piece>()


export default function usePieceComponent() {

  return {
    selectedPiece
  }
}

export enum SizeType {
  CM = 'cm',
  PX = 'px'
}