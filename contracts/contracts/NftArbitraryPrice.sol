// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/interfaces/IERC2981.sol';
// import "@openzeppelin/contracts/utils/ContextMixin.sol";


contract NftACP is ERC1155, IERC2981, Pausable, Ownable, ERC1155Supply, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    address private _royaltyReciever = address(this);

    uint256 public constant MAX_SUPPLY = 1000;

    mapping(address => uint256) private mintCountMap;

    mapping(address => uint256) private allowedMintCountMap;

    uint256 public constant MINT_LIMIT_PER_WALLET = 5;


    constructor() ERC1155('') {
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
     * @dev
     * `data` in _mint is set to `''` because is not used in this contract
     * `amount` in _mint is set 1 to restrict multimint
     */

    function mint(address account, uint256 id)
        public
        payable 
        nonReentrant
    {
        _checkIfCanMint();
        _mint(account, id, 1, '');
        supplyCounter.increment();
    }

    /** PAYOUT **/

    function withdraw() public nonReentrant {
        uint256 balance = address(this).balance;

        Address.sendValue(payable(owner()), balance);
    }

    /** ROYALTIES **/

    function _setRoyaltyReciever(address newRoyaltyReceiver) internal onlyOwner {
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
        return (
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId)
        );
    }

    /** METADATA **/
    /**
     * @dev Collection metadata based on opensea standards
     */

    function contractURI() public pure returns (string memory) {
        return 'https://metadata-url.com/my-metadata';
    }

    // {
    //   "name": "Test ACP",
    //   "description": "Test ACP description",
    //   "image": "external-link-url/image.png",
    //   "external_link": "https://janmiksik.ooo",
    //   "seller_fee_basis_points": 500, # Indicates a 5% seller fee.
    //   "fee_recipient": "0x4bC5f73A9A3f7210aD9Bc3f0DAD3F1Ae66F20c91" # Where seller fees will be paid to.
    // }

    // function uri() public view returns (string memory) {
    //     return "https://metadata-url.com/my-metadata";
    // }

    // {
    //   "description": "Test ACP description",
    //   "external_url": "https://janmiksik.ooo",
    //   "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
    //   "name": "Test ACP",
    // }
}
