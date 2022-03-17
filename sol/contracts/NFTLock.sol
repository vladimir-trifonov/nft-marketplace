//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract NFTLock {
    mapping(uint256 => bool) private locked;

    function _lock(uint256 tokenId) internal virtual {
        locked[tokenId] = true;
    }

    function _unlock(uint256 tokenId) internal virtual {
        locked[tokenId] = false;
    }

    function isLocked(uint256 tokenId) public view returns (bool) {
        return locked[tokenId];
    }
}
