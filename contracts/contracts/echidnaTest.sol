import './HelloNft.sol';

contract TestHelloNft is HelloNft {
    address echidna_caller = msg.sender;

    // constructor() public {
    //     balances[echidna_caller] = 10000;
    // }
    Counters.Counter private _supplyCounter;

    // add the property
    function echidna_max_mint_per_address() public view returns (bool) {
        return allowedMintCount(echidna_caller) <= 7;
    }

    function echidna_max_supply() public view returns (bool) {
        // return balances[msg.sender] <= 10000;
        return mintedNFTs() < 20;
    }
}

///////////// test cases //////////////////
// 1) anybody can mint
// 2) mint move NFT to msg.sender wallet
// 3) is possible to mint maximally 1000 NFT tokens
// 4) one address can mint max 7 NFTs
// 5) withdraw is possible only for owner
// 6) _royaltyReciever is possible to change only by owner
//
