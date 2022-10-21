// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/interfaces/IERC2981.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/Base64.sol';

contract NftHat is
    ERC1155,
    IERC2981,
    Ownable,
    ReentrancyGuard
{
    /**
     * @dev `_uri` is set only to satisfy the constructor of ERC1155. Otherwise uri for NFT token metadata is set on-chain.
     */
    constructor(string memory _uri) ERC1155(_uri) {
        _royaltyReciever = owner();
    }

    /** MINTING **/

    event PermanentURI(string _value, uint256 indexed _id);

    using Counters for Counters.Counter;

    // counting of minted NFTs by address
    mapping(address => uint256) private mintCountMap;

    uint256 public constant MAX_SUPPLY = 1000;

    uint256 public constant MINT_LIMIT_PER_WALLET = 7;

    Counters.Counter private supplyCounter;

    function allowedMintCount(address minter) public view returns (uint256) {
        return MINT_LIMIT_PER_WALLET - mintCountMap[minter];
    }

    function updateMintCount(address minter, uint256 count) private {
        mintCountMap[minter] += count;
    }

    function _checkIfCanMint() internal {
        if (allowedMintCount(msg.sender) >= 1) {
            updateMintCount(msg.sender, 1);
        } else {
            revert('Minting limit exceeded');
        }
        require(
            Counters.current(supplyCounter) < MAX_SUPPLY,
            'Exceeds max supply'
        );
    }

    function mintedNFTs() public view returns (uint256) {
        return Counters.current(supplyCounter);
    }

    /**
     * @dev
     * `id` for token id in _mint is `Counters.current(supplyCounter)`. Each NFT token has unique id
     * `amount` in _mint is set 1 to restrict multimint
     * `data` in _mint is set to `''` because are not used in this contract
     */
    function _mintWrapper(address account) internal virtual returns (uint256) {
        _checkIfCanMint();
        _mint(account, Counters.current(supplyCounter), 1, '');
        emit PermanentURI(
            uri(Counters.current(supplyCounter)),
            Counters.current(supplyCounter)
        );
        supplyCounter.increment();
        return Counters.current(supplyCounter);
    }

    function mint(address account) public payable virtual nonReentrant {
        _mintWrapper(account);
    }

    /** PAYOUT **/

    function withdraw() public nonReentrant {
        uint256 balance = address(this).balance;

        Address.sendValue(payable(owner()), balance);
    }

    /** ROYALTIES **/

    /**
     * @dev _royaltyReciever is accepted by some marketplaces.
     * Other marketplaces may send royalty based on specification in contractURI metadata.
     */
    address private _royaltyReciever = address(this);

    function _setRoyaltyReciever(address newRoyaltyReceiver)
        internal
        onlyOwner
    {
        require(newRoyaltyReceiver != address(0), 'Invalid address');
        _royaltyReciever = newRoyaltyReceiver;
    }

    function setRoyaltyReciever(address newRoyaltyReceiver) external onlyOwner {
        _setRoyaltyReciever(newRoyaltyReceiver);
    }

    function getRoyaltyReciever() public view returns (address) {
        return _royaltyReciever;
    }

    function royaltyInfo(uint256, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        return (_royaltyReciever, (salePrice * 500) / 10000);
    }

    // EIP2981 standard Interface return. Adds to ERC1155 and ERC165 Interface returns.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, IERC165)
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
            '"name": "Hat ~^~",',
            '"description": "Outsourcing mint price decision to customers",',
            '"image": "ipfs://bafybeibwr75ag7yw4m34brikrrlt6k3ntvo6kwavz5u6e2tk5vkeckv3du",',
            '"external_link": "https://janmiksik.ooo",',
            '"seller_fee_basis_points": 500,',
            '"fee_recipient": "',
            Strings.toHexString(uint160(_royaltyReciever), 20),
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

    function uri(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        bytes memory dataURI = abi.encodePacked(
            '{',
            '"name": "Hat @',
            Strings.toString(tokenId),
            '",',
            '"description": "Outsourcing mint price decision to customers",',
            '"image": "',
            'ipfs://bafybeibwr75ag7yw4m34brikrrlt6k3ntvo6kwavz5u6e2tk5vkeckv3du',
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
