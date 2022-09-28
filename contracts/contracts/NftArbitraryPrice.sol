// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/interfaces/IERC2981.sol';

contract NftACP is ERC1155, Pausable, Ownable, ERC1155Supply, ReentrancyGuard {
    using Counters for Counters.Counter;

    constructor() ERC1155('') {}

    /** PAUSABLE **/
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    /** MINTING LIMITS **/

    uint256 public constant MAX_SUPPLY = 1000;

    mapping(address => uint256) private mintCountMap;

    mapping(address => uint256) private allowedMintCountMap;

    uint256 public constant MINT_LIMIT_PER_WALLET = 5;

    function allowedMintCount(address minter) public view returns (uint256) {
        return MINT_LIMIT_PER_WALLET - mintCountMap[minter];
    }

    function updateMintCount(address minter, uint256 count) private {
        mintCountMap[minter] += count;
    }

    Counters.Counter private supplyCounter;

    function totalSupply() public view returns (uint256) {
        return supplyCounter.current();
    }

    /** MINTING **/

    function _checkIfCanMint() internal {
        if (allowedMintCount(msg.sender) >= 1) {
            updateMintCount(msg.sender, 1);
        } else {
            revert('Minting limit exceeded');
        }
        require(totalSupply() < MAX_SUPPLY, 'Exceeds max supply');
    }

    /**
     * @dev _mint takes parameters `to, ids, amounts, data`
     */

    function mint() public payable nonReentrant {
        _checkIfCanMint();
        _mint(msg.sender, supplyCounter.current(), 1, '');
        supplyCounter.increment();
    }

    // function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    // public
    // {
    //     _mintBatch(to, ids, amounts, data);
    // }

    /** PAYOUT **/

    function withdraw() public nonReentrant {
        uint256 balance = address(this).balance;

        Address.sendValue(payable(owner()), balance);
    }

    /** ROYALTIES **/

    function royaltyInfo(uint256, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        return (address(this), (salePrice * 500) / 10000);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155)
        returns (bool)
    {
        return (interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId));
    }

    /** METADATA **/
    /**
     * @dev Collection metadata based on opensea standards
     */

    function contractURI() public pure returns (string memory) {
        return 'https://metadata-url.com/my-metadata';
    }

    // {
    //   "name": "OpenSea Creatures",
    //   "description": "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform. Adopt one today to try out all the OpenSea buying, selling, and bidding feature set.",
    //   "image": "external-link-url/image.png",
    //   "external_link": "external-link-url",
    //   "seller_fee_basis_points": 500, # Indicates a 5% seller fee.
    //   "fee_recipient": "0xA97F337c39cccE66adfeCB2BF99C1DdC54C2D721" # Where seller fees will be paid to.
    // }

    // function uri() public view returns (string memory) {
    //     return "https://metadata-url.com/my-metadata";
    // }

    // {
    //   "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
    //   "external_url": "https://openseacreatures.io/3",
    //   "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
    //   "name": "Dave Starbelly",
    //   "attributes": [ ... ],
    // }
}
