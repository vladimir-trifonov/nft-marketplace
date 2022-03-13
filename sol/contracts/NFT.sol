//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Utils.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC1155Supply, Ownable, Utils {
    address market;
    mapping(uint256 => address) private tokenOwner;
    mapping(uint256 => bool) private locked;

    constructor() ERC1155("https://ipfs.io/ipfs/f01551220{id}") {}

    function setMarket(address _market) public onlyOwner {
        require(_market != address(0), "NFT: Wrong address");
        market = _market;
    }

    modifier onlyMarket() {
        require(market != address(0), "NFT: market not set");
        require(market == msg.sender, "NFT: caller is not the market");
        _;
    }

    function mint(uint256 _id, address _owner) public virtual onlyMarket {
        require(exists(_id) == false, "NFT: token already minted");
        bytes memory emptyData;
        _mint(msg.sender, _id, 1, emptyData);
        tokenOwner[_id] = msg.sender;
        transferFrom(msg.sender, _owner, _id);
    }

    function balanceOf(address account, uint256 id)
        public
        view
        override
        returns (uint256)
    {
        require(
            account != address(0),
            "NFT: balance query for the zero address"
        );
        if (super.balanceOf(market, id) == 1 && tokenOwner[id] == account) {
            return 1;
        }
        return 0;
    }

    function balanceOfBatch(address[] memory accounts, uint256[] memory ids)
        public
        view
        override
        returns (uint256[] memory)
    {
        require(
            accounts.length == ids.length,
            "NFT: accounts and ids length mismatch"
        );

        uint256[] memory batchBalances = new uint256[](accounts.length);

        for (uint256 i = 0; i < accounts.length; ++i) {
            batchBalances[i] = balanceOf(accounts[i], ids[i]);
        }

        return batchBalances;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) public virtual onlyMarket {
        require(_from != address(0), "NFT: token not for sale");
        require(tokenOwner[_id] != address(0), "NFT: token not exist");
        require(locked[_id] != true, "NFT: token locked");
        require(_to != address(0), "NFT: transfer to the zero address");
        require(msg.sender != _to, "NFT: you own the token");
        require(
            tokenOwner[_id] == _from ||
                isApprovedForAll(msg.sender, _msgSender()),
            "NFT: caller is not owner nor approved"
        );
        _transferFrom(_from, _to, _id);
    }

    function _transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) internal virtual {
        address operator = _msgSender();
        tokenOwner[_id] = _to;
        emit TransferSingle(operator, _from, _to, _id, 1);
    }

    function lock(uint256 _id) public virtual {
        require(tokenOwner[_id] != msg.sender, "NFT: not an owner");
        locked[_id] = true;
    }

    function unlock(uint256 _id) public virtual {
        require(tokenOwner[_id] != msg.sender, "NFT: not an owner");
        delete locked[_id];
    }

    function uri(uint256 _Id) public pure override returns (string memory) {
        string memory hexstringId = uint2hexstr(_Id);
        return
            string(
                abi.encodePacked("https://ipfs.io/ipfs/f01551220", hexstringId)
            );
    }
}
