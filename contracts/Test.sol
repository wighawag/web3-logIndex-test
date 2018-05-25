pragma solidity ^0.4.23;
contract Test {

    event Event1(address from, bool active);
    event Event2(address from, int value);
    
    function testEvents() public {
        emit Event1(msg.sender, true);
        emit Event2(msg.sender, 3);
    }
}