// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/interfaces/IERC2981.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/Base64.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract IntoPieces is ERC721, IERC2981, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    constructor() ERC721('Into Pieces', 'IP') {
        _royaltyReceiver = owner();
    }

    /** MINTING **/
    mapping(address => uint8) private mintCountMap;

    uint16 public constant MAX_SUPPLY = 1000;

    uint8 public constant MINT_LIMIT_PER_WALLET = 7;

    Counters.Counter private _supplyCounter;

    function allowedMintCount(address minter) public view returns (uint8) {
        return MINT_LIMIT_PER_WALLET - mintCountMap[minter];
    }

    function _updateMintCount(address minter, uint8 count) private {
        mintCountMap[minter] += count;
    }

    function _checkIfCanMint() internal {
        require(
            Counters.current(_supplyCounter) < MAX_SUPPLY,
            'Exceeds max supply'
        );
        if (allowedMintCount(msg.sender) >= 1) {
            _updateMintCount(msg.sender, 1);
        } else {
            revert('Minting limit exceeded');
        }
    }

    function mintedNFTs() public view returns (uint256) {
        return Counters.current(_supplyCounter);
    }

    function safeMint(address to) public payable nonReentrant {
        _checkIfCanMint();
        uint256 tokenId = _supplyCounter.current();
        _safeMint(to, tokenId);
        _supplyCounter.increment();
    }

    /** PAYOUT **/

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;

        Address.sendValue(payable(owner()), balance);
    }

    // /** ROYALTIES **/

    // /**
    //  * @dev _royaltyReceiver is accepted by some marketplaces.
    //  * Other marketplaces may send royalty based on specification in contractURI metadata.
    //  */
    address private _royaltyReceiver = address(this);

    function _setRoyaltyReceiver(address newRoyaltyReceiver)
        internal
        onlyOwner
    {
        require(newRoyaltyReceiver != address(0), 'Invalid address');
        _royaltyReceiver = newRoyaltyReceiver;
    }

    function setRoyaltyReceiver(address newRoyaltyReceiver) external onlyOwner {
        _setRoyaltyReceiver(newRoyaltyReceiver);
    }

    function getRoyaltyReceiver() public view returns (address) {
        return _royaltyReceiver;
    }

    // @param _tokenId - the NFT asset queried for royalty information
    // @param _salePrice - the sale price of the NFT asset specified by _tokenId
    // `_royaltyReceiver, salePrice / 20` is optimazed code of `_royaltyReceiver (salePrice * 500) / 10000)` for 5% royalty 
    function royaltyInfo(uint256, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        return (_royaltyReceiver, salePrice / 20);
    }

    // EIP2981 standard Interface return. Adds to ERC721 and ERC165 Interface returns.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, IERC165)
        returns (bool)
    {
        return (interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId));
    }

    /** METADATA **/
    /**
     * @dev Collection metadata based on opensea standards
     */
    function contractURI() public view returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            '{',
            '"name": "Into Pieces",',
            '"description": "Test your imagination",',
            '"image": "ipfs://bafkreifivloyeuiky6ozz7w7uke2lb2amutsu4bnb76i2pv4hdqvv7uv4i",',
            '"external_link": "https://janmiksik.ooo",',
            '"seller_fee_basis_points": 500,',
            '"fee_recipient": "',
            Strings.toHexString(uint160(_royaltyReceiver), 20),
            '"',
            '}'
        );
        return
            string(
                abi.encodePacked(
                    'data:application/json;base64,',
                    Base64.encode(dataURI)
                )
            );
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        bytes memory dataURI = abi.encodePacked(
            '{',
            '"name": "Into Pieces @',
            Strings.toString(tokenId + 1),
            '",',
            '"description": "",',
            '"image": "',
            'ipfs://bafkreifivloyeuiky6ozz7w7uke2lb2amutsu4bnb76i2pv4hdqvv7uv4i',
            '"',
            '}'
        );
        return
            string(
                abi.encodePacked(
                    'data:application/json;base64,',
                    Base64.encode(dataURI)
                )
            );
    }
}
