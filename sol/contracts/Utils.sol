//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Utils {
    function uint2hex64str(uint256 i, uint8 ml) public pure returns (string memory) {
        if (i == 0) return "0";
        uint256 j = i;
        uint256 length;
        while (j != 0) {
            length++;
            j = j >> 4;
        }
        j = i;
        uint256 mask = 15;
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (j != 0) {
            uint256 curr = (j & mask);
            bstr[--k] = curr > 9
                ? bytes1(uint8(55 + curr))
                : bytes1(uint8(48 + curr));
            j = j >> 4;
        }
        string memory h = string(bstr);
        while (bytes(h).length < ml) {
            h = string(abi.encodePacked("0", h));
        }
        return h;
    }
}
