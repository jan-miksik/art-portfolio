// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/interfaces/IERC2981.sol';

// import "@openzeppelin/contracts/utils/ContextMixin.sol";

contract NftArbitraryPrice is
    ERC1155,
    IERC2981,
    Pausable,
    Ownable,
    ERC1155Supply,
    ReentrancyGuard
{
    using Counters for Counters.Counter;

    /**
     * @dev _royaltyReciever is accepted by some marketplaces.
     * Other marketplaces may send royalty based on specification in contractURI metadata
     */
    address private _royaltyReciever = address(this);

    uint256 public constant MAX_SUPPLY = 1000;

    // counting of minted NFTs by address
    mapping(address => uint256) private mintCountMap;

    uint256 public constant MINT_LIMIT_PER_WALLET = 5;

    constructor(string memory uri) ERC1155(uri) {
        _royaltyReciever = owner();
    }

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

    function allowedMintCount(address minter) public view returns (uint256) {
        return MINT_LIMIT_PER_WALLET - mintCountMap[minter];
    }

    function updateMintCount(address minter, uint256 count) private {
        mintCountMap[minter] += count;
    }

    Counters.Counter private supplyCounter;

    /** MINTING **/

    function _checkIfCanMint() internal {
        if (allowedMintCount(msg.sender) >= 1) {
            updateMintCount(msg.sender, 1);
        } else {
            revert('Minting limit exceeded');
        }
        /**
         * @dev totalSupply(1) -> this ERC1155 contract has only one item id
         */
        require(totalSupply(1) < MAX_SUPPLY, 'Exceeds max supply');
    }

    /**
     * @dev
     * `data` in _mint is set to `''` because are not used in this contract
     * `amount` in _mint is set 1 to restrict multimint
     * `id` in _mint is set 1 because this contract has only one item id
     */

    function mint(address account) public payable nonReentrant {
        _checkIfCanMint();
        _mint(account, 1, 1, '');
        supplyCounter.increment();
    }

    /** PAYOUT **/

    function withdraw() public nonReentrant {
        uint256 balance = address(this).balance;

        Address.sendValue(payable(owner()), balance);
    }

    /** ROYALTIES **/

    function _setRoyaltyReciever(address newRoyaltyReceiver)
        internal
        onlyOwner
    {
        require(newRoyaltyReceiver != address(0), 'Invalid address');
        _royaltyReciever = newRoyaltyReceiver;
    }

    function setRoyalties(address newRoyaltyReceiver) external onlyOwner {
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

    function contractURI() public pure returns (string memory) {
        return
            'ipfs://bafkreiaz5rlt5y5kfixnbbc7npmyk4muy4zhozf4tkqxw5ze7cewhsx6vi';
    }
}
