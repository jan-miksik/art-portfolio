// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/interfaces/IERC2981.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Address.sol';

interface IConduitController {
    function getKey(address conduit) external view returns (bytes32);
}

contract TestNFT is ERC721, IERC2981, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    constructor(string memory customBaseURI_)
        ERC721('TestToken_70', 'TTKN_70')
    {
        customBaseURI = customBaseURI_;
    }

    /** MINTING LIMITS **/

    mapping(address => uint256) private mintCountMap;

    // mapping(address => uint256) private allowedMintCountMap;

    mapping(address => address) private unsupportedMarketplaces;

    uint256 public constant MINT_LIMIT_PER_WALLET = 7;

    uint256 public royaltyFreeThreshold = 100000000000000000;

    mapping(uint256 => uint256) public tokensBpsRoyalty;

    event NewMint(uint256[] tokenId);

    function allowedMintCount(address minter) public view returns (uint256) {
        return MINT_LIMIT_PER_WALLET - mintCountMap[minter];
    }

    function updateMintCount(address minter, uint256 count) private {
        mintCountMap[minter] += count;
    }

    /** MINTING **/

    uint256 public constant MAX_SUPPLY = 2048;

    uint256 public constant MAX_MULTIMINT = 5;

    uint256 public constant PRICE = 0;

    // address public constant OPERATORS_WITHOUT_ERC2981 = 0x1e0049783f008a0085193e00003d00cd54003c71;

    Counters.Counter private supplyCounter;

    function mint(uint256 id) public payable nonReentrant {
        require(saleIsActive, 'Sale not active');

        if (allowedMintCount(msg.sender) >= 1) {
            updateMintCount(msg.sender, 1);
        } else {
            revert('Minting limit exceeded');
        }

        require(totalSupply() < MAX_SUPPLY, 'Exceeds max supply');

        if (msg.value >= royaltyFreeThreshold) {
            tokensBpsRoyalty[id] = 0;
        } else if (msg.value == 0) {
            tokensBpsRoyalty[id] = 10000;
        } else {
            unchecked {
                uint256 royaltyBps = (100 -
                    (msg.value / (royaltyFreeThreshold / 100))) * 100;
                tokensBpsRoyalty[id] = royaltyBps;
            }
        }

        _mint(msg.sender, id);

        supplyCounter.increment();
    }

    function totalSupply() public view returns (uint256) {
        return supplyCounter.current();
    }

    /** ACTIVATION **/

    bool public saleIsActive = true;

    function setSaleIsActive(bool saleIsActive_) external onlyOwner {
        saleIsActive = saleIsActive_;
    }

    /** URI HANDLING **/

    string private customBaseURI;

    mapping(uint256 => string) private tokenURIMap;

    function setTokenURI(uint256 tokenId, string memory tokenURI_)
        external
        onlyOwner
    {
        tokenURIMap[tokenId] = tokenURI_;
    }

    function setBaseURI(string memory customBaseURI_) external onlyOwner {
        customBaseURI = customBaseURI_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return customBaseURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        string memory tokenURI_ = tokenURIMap[tokenId];

        if (bytes(tokenURI_).length > 0) {
            return tokenURI_;
        }

        return string(abi.encodePacked(super.tokenURI(tokenId)));
    }

    /** PAYOUT **/

    function withdraw() public nonReentrant {
        uint256 balance = address(this).balance;

        Address.sendValue(payable(owner()), balance);
    }

    /** ROYALTIES **/

    address private royaltyReciever;

    function setRoyaltyReciever(address receiver) external onlyOwner {
        require(receiver == address(receiver), 'Invalid address');
        royaltyReciever = receiver;
    }

    function getRoyaltyReciever() public view returns (address) {
        return royaltyReciever;
    }

    function setRoyaltyFreeThreshold(uint256 royaltyFreeThreshold_)
        external
        onlyOwner
    {
        royaltyFreeThreshold = royaltyFreeThreshold_;
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        public
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        if (tokensBpsRoyalty[tokenId] == 0) {
            royaltyAmount = 0;
        } else {
            unchecked {
                royaltyAmount = (salePrice * tokensBpsRoyalty[tokenId]) / 10000;
            }
        }
        receiver = royaltyReciever;
    }

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

    /* BLOCK UNSUPPORTED MARKETPLACE */
    mapping(address => bool) isDarklisted;

    function addToListOfUnsupportedMarketPlaces(address addr)
        external
        onlyOwner
    {
        require(!isDarklisted[addr], 'address already darklisted');
        isDarklisted[addr] = true;
    }

    function removeFromListOfUnsupportedMarketPlaces(address addr)
        external
        onlyOwner
    {
        require(isDarklisted[addr], 'address not on darklist');
        isDarklisted[addr] = false;
    }

    function isAddressDarklisted(address addr) public view returns (bool) {
        return isDarklisted[addr];
    }

    function _requireMarketplaceNotBeOnDarklist(address to) internal view {
        require(!isDarklisted[to], 'address is darklisted');
    }

    function setApprovalForAll(address operator, bool approved)
        public
        virtual
        override
    {
        _requireMarketplaceNotBeOnDarklist(operator);
        super.setApprovalForAll(operator, approved);
    }

    function approve(address to, uint256 tokenId) public virtual override {
        _requireMarketplaceNotBeOnDarklist(to);
        super.approve(to, tokenId);
    }
}

// Contract created with Studio 721 v1.5.0
// https://721.so
