// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SocialToken is ERC20 {
    uint maxSupply;
    uint totalReward;
    constructor(uint _maxSupply, address owner) ERC20("SOCIAL", "SOC") {
        maxSupply = _maxSupply;
        totalReward = (maxSupply * 50) / 100;
        uint reward = totalReward * (10 ** 18);
        _mint(owner, reward);
    }

    // function to get total supply of token
    function maximumSupply() public view returns (uint) {
        return maxSupply;
    }

    // function to return the amount of tokens to be given out as rewards
    function totalRewards() public view returns (uint) {
        return totalReward;
    }
}