//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./NFT.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTEnumerable is NFT {
    using Counters for Counters.Counter;

    mapping(address => Counters.Counter) private tokensCountByOwner;

    constructor(string memory _baseTokenURI) NFT(_baseTokenURI) {}

    function fetchTokensIdsBatch(address _except, address _only)
        public
        view
        returns (uint256[] memory)
    {
        require(
            _except == address(0) || _only == address(0),
            "Token: wrong params"
        );

        uint256 allTokensCount = totalSupply();
        uint256 resultTokensCount = 0;

        if (_only != address(0)) {
            resultTokensCount = tokensCountByOwner[_only].current();
        } else {
            resultTokensCount = allTokensCount - tokensCountByOwner[_except].current();
        }

        uint256[] memory tokensIds = new uint256[](resultTokensCount);

        if (resultTokensCount == 0) return tokensIds;

        uint256 currentTokenIndex = 0;
        for (uint256 i = 0; i < allTokensCount; i++) {
            uint256 tokenId = tokenByIndex(i);

            address owner = ownerOf(tokenId);
            if (_only != address(0) && owner == _only) {
                tokensIds[currentTokenIndex++] = tokenId;
            } else if (_except != address(0) && owner != _except) {
                tokensIds[currentTokenIndex++] = tokenId;
            }
        }

        return tokensIds;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Enumerable) {
        if (from != address(0)) tokensCountByOwner[from].decrement();
        tokensCountByOwner[to].increment();

        super._beforeTokenTransfer(from, to, tokenId);
    }
}
