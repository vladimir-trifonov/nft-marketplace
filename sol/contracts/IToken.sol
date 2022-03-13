//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IToken is IERC1155 {
    function mint(
        uint256 _id,
        address _owner
    ) external;
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
    function lock(
        uint256 _id
    ) external;
    function unlock(
        uint256 _id
    ) external;
}
