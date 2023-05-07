import { v4 as uuidv4 } from 'uuid';

export default function uuidPolyfill() {
  if (!window.crypto || !window.crypto.randomUUID) {
    window.crypto = window.crypto || {};
    window.crypto.randomUUID = function() {
      return uuidv4();
    };
  }
}