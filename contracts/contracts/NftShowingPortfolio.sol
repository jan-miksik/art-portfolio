// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/interfaces/IERC2981.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/Base64.sol';

library DateTimeLibrary {
    // ----------------------------------------------------------------------------
    // Derived from BokkyPooBah's DateTime Library v1.01
    // ----------------------------------------------------------------------------

    uint256 constant SECONDS_PER_DAY = 24 * 60 * 60;
    uint256 constant SECONDS_PER_HOUR = 60 * 60;
    uint256 constant SECONDS_PER_MINUTE = 60;
    int256 constant OFFSET19700101 = 2440588;

    // ------------------------------------------------------------------------
    // Calculate year/month/day from the number of days since 1970/01/01 using
    // the date conversion algorithm from
    //   http://aa.usno.navy.mil/faq/docs/JD_Formula.php
    // and adding the offset 2440588 so that 1970/01/01 is day 0
    //
    // int L = days + 68569 + offset
    // int N = 4 * L / 146097
    // L = L - (146097 * N + 3) / 4
    // year = 4000 * (L + 1) / 1461001
    // L = L - 1461 * year / 4 + 31
    // month = 80 * L / 2447
    // dd = L - 2447 * month / 80
    // L = month / 11
    // month = month + 2 - 12 * L
    // year = 100 * (N - 49) + year + L
    // ------------------------------------------------------------------------
    function _daysToDate(uint256 _days)
        internal
        pure
        returns (
            uint256 year,
            uint256 month,
            uint256 day
        )
    {
        int256 __days = int256(_days);
        int256 L = __days + 68569 + OFFSET19700101;
        int256 N = (4 * L) / 146097;
        L = L - (146097 * N + 3) / 4;
        int256 _year = (4000 * (L + 1)) / 1461001;
        L = L - (1461 * _year) / 4 + 31;
        int256 _month = (80 * L) / 2447;
        int256 _day = L - (2447 * _month) / 80;
        L = _month / 11;
        _month = _month + 2 - 12 * L;
        _year = 100 * (N - 49) + _year + L;

        year = uint256(_year);
        month = uint256(_month);
        day = uint256(_day);
    }

    function getYear(uint256 timestamp) internal pure returns (uint256 year) {
        (year, , ) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }

    function getMonth(uint256 timestamp) internal pure returns (uint256 month) {
        (, month, ) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }
}

contract NftShowingPortfolio is ERC1155, IERC2981, Ownable, ReentrancyGuard {
    /**
     * @dev `_uri` is set only to satisfy the constructor of ERC1155. Otherwise uri for NFT token metadata is set on-chain.
     */
    constructor(string memory _uri) ERC1155(_uri) {
        _royaltyReciever = owner();
    }

    /** MINTING **/

    using Counters for Counters.Counter;
    using DateTimeLibrary for uint256;

    mapping(address => bool) private _addressesAllowToMint;

    mapping(uint256 => string) private _messagesInNfts;

    mapping(uint256 => uint256) private _mintTimestampsOfNfts;

    Counters.Counter private _supplyCounter;

    event PermanentURI(string _value, uint256 indexed _id);

    function setAddressMintAllowance(address _address, bool _canMint)
        external
        onlyOwner
    {
        _addressesAllowToMint[_address] = _canMint;
    }

    function viewAddressMintAllowance(address _address)
        public
        view
        returns (bool)
    {
        return _addressesAllowToMint[_address];
    }

    function mintedNFTs() public view returns (uint256) {
        return Counters.current(_supplyCounter);
    }

    /**
     * @dev
     * `id` for token id in _mint is `Counters.current(_supplyCounter)`. Each NFT token has unique id
     * `amount` in _mint is set 1 to restrict multimint
     * `data` in _mint is set to `''` because are not used in this contract
     */
    function mint(address account, string memory _message)
        public
        payable
        virtual
        nonReentrant
        returns (uint256)
    {
        require(
            _addressesAllowToMint[msg.sender],
            'Address not allowed to mint'
        );
        _mint(account, Counters.current(_supplyCounter), 1, '');
        _messagesInNfts[Counters.current(_supplyCounter)] = _message;
        _mintTimestampsOfNfts[Counters.current(_supplyCounter)] = block
            .timestamp;
        emit PermanentURI(
            uri(Counters.current(_supplyCounter)),
            Counters.current(_supplyCounter)
        );
        _supplyCounter.increment();
        return Counters.current(_supplyCounter);
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
            '"name": "Showing portfolio web IRL",',
            '"description": "Showing portfolio web IRL",',
            '"external_link": "https://janmiksik.ooo",',
            '"seller_fee_basis_points": 500,',
            '"fee_recipient": "',
            Strings.toHexString(uint160(_royaltyReciever), 20),
            '"',
            '"image": "data:image/svg+xml;base64,',
            Base64.encode(
                bytes(
                    '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-size: 14px; } </style><rect width="100%" height="100%" fill="black" /><text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">...</text></svg>'
                )
            ),
            '"}'
        );
        return
            string.concat(
                'data:application/json;base64,',
                Base64.encode(dataURI)
            );
    }

    function uri(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        string[5] memory parts;

        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-size: 14px; } .date { fill: white; font-size: 10px; }</style><rect width="100%" height="100%" fill="black" /><text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">';
        parts[1] = _messagesInNfts[tokenId];
        parts[
            2
        ] = '</text><text x="345" y="345" class="date" dominant-baseline="bottom" text-anchor="end">';
        parts[3] = string.concat(
            Strings.toString(_mintTimestampsOfNfts[tokenId].getYear()),
            '/',
            Strings.toString(_mintTimestampsOfNfts[tokenId].getMonth())
        );
        parts[4] = '</text></svg>';

        string memory image = string.concat(
            parts[0],
            parts[1],
            parts[2],
            parts[3],
            parts[4]
        );

        bytes memory dataURI = abi.encodePacked(
            '{',
            '"name": "Showing portfolio web IRL &',
            Strings.toString(tokenId),
            '",',
            '"description": "Showing portfolio web IRL",',
            '"image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(image)),
            '"}'
        );

        return
            string.concat(
                'data:application/json;base64,',
                Base64.encode(dataURI)
            );
    }
}
