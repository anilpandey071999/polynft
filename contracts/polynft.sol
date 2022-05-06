// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract PolyNFT is ERC721, ERC721URIStorage, Ownable {
    using SafeMath for uint256;

    using Counters for Counters.Counter;
    bool public saleIsActiveWhiteList = false;
    Counters.Counter private _tokenOwners;

    string private baseURI; 
    string public notRevealedUri;

    address artist = 0xb8bc57FF4C30e98eD5987B7A583ca34160934673;
   
    mapping(address => bool) public whiteListing;
    mapping(address => uint256) public payWall;

    uint256 public price = 10000000000000000; //0.01 ETH

    uint256 public constant Per_Max_Mint = 1;
    uint256 public MAX_NFT;
    uint256 public REVEAL_TIMESTAMP;
    address _owner; 
    constructor(
        uint256 maxNftSupply,
        string memory _initBaseURI,
        string memory _initNotRevealedUri
    ) ERC721("POLYNFTSBYANIL1", "AnilNFT") {
        MAX_NFT = maxNftSupply;
        _owner = msg.sender;
        REVEAL_TIMESTAMP = block.timestamp + 10 minutes;
        baseURI = _initBaseURI;
        notRevealedUri = _initNotRevealedUri;
        _tokenOwners.increment();
    }


    function Whitelist(uint256 _newPrice) public onlyOwner {
        price = _newPrice;
    }

    function SetREVEAL_TIMESTAMP(uint256 time) public onlyOwner {
        REVEAL_TIMESTAMP = time;
    }

    /*
     * Pause sale if active, make active if paused
     */

    function ToggleWhitelist() public onlyOwner {
        saleIsActiveWhiteList = !saleIsActiveWhiteList;
    }

    /**
     * Mints Super Car
     */
    function mint(address to) public payable onlyOwner {
         require(
            totalSupply().add(Per_Max_Mint) <= MAX_NFT,
            "Mint limit exceeded"
        );
        require(
            whiteListing[to],
            "Your address is not whitelisted"
        );
        require(
            balanceOf(to) == 0 ,
            "You can only mine 1 NFT per Address"
        );
        require(
            saleIsActiveWhiteList,
            "Whitelist sale must be active to mint the NFT"
        );

        require(
            payWall[to] == 10000000000000000,
            "Please to the payment for the NFT"
        );

        
        uint256 mintIndex = _tokenOwners.current();
        if (totalSupply() <= MAX_NFT) {
            _safeMint(to, mintIndex);
            _tokenOwners.increment();
        }
        whiteListing[to] = false;
    }

    function transferForMint() public payable {
        require(
            totalSupply().add(Per_Max_Mint) <= MAX_NFT,
            "Mint limit exceeded"
        );
        require(
            balanceOf(msg.sender) == 0 ,
            "You can only mine 1 NFT per Address"
        );
        require(
            saleIsActiveWhiteList,
            "Whitelist sale must be active to mint the NFT"
        );
         require(
            whiteListing[msg.sender],
            "Your address is not whitelisted"
        );
        require(
            msg.value == 10000000000000000,
            "Ether value sent is not correct"
        );
        payWall[msg.sender] = msg.value;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenOwners.current() - 1 ;
    }
    
    function Whitelistings(
        address user
    ) public onlyOwner {
        // for (uint32 i = 0; i < user.length; i++) {
            whiteListing[user] = true;
        // }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        if (REVEAL_TIMESTAMP > block.timestamp) {
            return notRevealedUri;
        }
        string memory currentBaseURI = baseURI;
        return
            tokenId > 0
                ? string(
                    abi.encodePacked(currentBaseURI, toString(tokenId))
                )
                : "";
    }

    function ToTreasury() external payable onlyOwner {
        (bool os, ) = payable(0xb8bc57FF4C30e98eD5987B7A583ca34160934673).call{value: address(this).balance}("");
        require(os,"Unable to send value, recipient may have reverted");
    }

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}