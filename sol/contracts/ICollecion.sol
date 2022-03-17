//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface ICollecion is IERC1155 {
    function mint(address to, uint256 id) external;

    function isCreator(uint256 _collectionId, address _creator)
        external
        returns (bool);
}
