//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Utils.sol";
import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Collection is
    ERC1155PresetMinterPauser,
    Ownable,
    Utils
{
    mapping(uint256 => address) private collectionIdToCreator;
    mapping(address => uint256[]) public _collectionsIdsByCreator;

    constructor(string memory _uri) ERC1155PresetMinterPauser(_uri) {}

    function collectionsIdsByCreator(address _creator) public view returns (uint256[] memory) {
        return _collectionsIdsByCreator[_creator];
    }

    function mint(address _to, uint256 _collectionId) public virtual payable {
        require(_to != address(0), "Wrong creator");
        require(collectionIdToCreator[_collectionId] == address(0), "Collection: existing collection");
        super.mint(_msgSender(), _collectionId, 1, "");

        _collectionsIdsByCreator[_to].push(_collectionId);
        collectionIdToCreator[_collectionId] = _to;
    }

    function isCreator(uint256 _collectionId, address _creator)
        public
        virtual
        view
        returns (bool)
    {
        require(_creator != address(0), "Wrong creator");
        require(collectionIdToCreator[_collectionId] != address(0), "Collection: not existing collection");
        return collectionIdToCreator[_collectionId] == _creator;
    }

    function setMinterRole(address account) public virtual onlyOwner {
        require(account != address(0), "Wrong minter");
        _grantRole(MINTER_ROLE, account);
    }

    function uri(uint256 _id) public view override returns (string memory) {
        string memory hexstringId = uint2hex64str(_id, 64);
        return string(abi.encodePacked(super.uri(_id), hexstringId));
    }
}
