export default function getShortCryptoAddress(address: string) {
  const addr = `${address.substr(
    0,
    5
  )}...${address.substr(address.length - 5)}`
  return addr
}
