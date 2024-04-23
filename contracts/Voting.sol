// SPDX-License-Identifier: MIT 
// Voting.sol
pragma solidity ^0.8.0;

contract Voting {
    mapping (bytes32 => uint8) public votesReceived;
    bytes32[] public candidateList;

    function addCandidate(bytes32 candidateName) public {
        candidateList.push(candidateName);
    }

    function voteForCandidate(bytes32 candidateName) public {
        require(validCandidate(candidateName));
        votesReceived[candidateName] += 1;
    }

    function totalVotesFor(bytes32 candidateName) public view returns (uint8) {
        require(validCandidate(candidateName));
        return votesReceived[candidateName];
    }

    function validCandidate(bytes32 candidateName) public view returns (bool) {
        for (uint i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidateName) {
                return true;
            }
        }
        return false;
    }

    // Function to count the number of candidates
    function countCandidates() public view returns (uint) {
        return candidateList.length;
    }
}
