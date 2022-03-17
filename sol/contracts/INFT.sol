//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface INFT is IERC721 {
    function mint(address to, uint256 _tokenId) external;

    function lock(uint256 _tokenId) external;

    function unlock(uint256 _tokenId) external;
}
