//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Utils.sol";
import "./NFTLock.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721Enumerable, Ownable, Utils, NFTLock {
    address market;
    string private baseTokenURI;

    constructor(string memory _baseTokenURI)
        ERC721(
            "NFT",
            "NFT"
        )
    {
        baseTokenURI = _baseTokenURI;
    }

    modifier onlyMarket() {
        require(market != address(0), "Token: market not set");
        require(
            market == _msgSender(),
            "Token: caller is not the market"
        );
        _;
    }

    modifier onlyUnlocked(uint256 _tokenId) {
      require(
          isLocked(_tokenId) == false,
          "Token: the token is locked"
      );
      _;
    }

    function setMarket(address _market) public virtual onlyOwner {
        require(_market != address(0), "Token: Wrong address");
        market = _market;
    }

    function lock(uint256 tokenId) public virtual onlyMarket {
        _lock(tokenId);
    }

    function unlock(uint256 tokenId) public virtual onlyMarket {
        _unlock(tokenId);
    }

    function mint(address to, uint256 _tokenId) public virtual onlyMarket {
        _mint(to, _tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override onlyMarket onlyUnlocked(tokenId) {
        super._transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override onlyMarket onlyUnlocked(tokenId) {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override onlyMarket onlyUnlocked(tokenId) {
        super.safeTransferFrom(from, to, tokenId, _data);
    }

    function uri(uint256 _id) public view returns (string memory) {
        string memory hexstringId = uint2hex64str(_id, 64);
        return string(abi.encodePacked(baseTokenURI, hexstringId));
    }
}
