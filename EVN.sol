//pragma solidity >=0.7.0 <0.9.0;
pragma solidity >=0.5.17;
/** 
 * @title EVN
 * @dev Implements voting process along with vote delegation
 */
contract Election {
    
    struct Candidate {
        string name;
        uint voteCount;
    }    

    struct Voter {
        bool voted;
        uint voteIndex;
        uint weight;
    }

    address public owner;
    string public name;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    uint public actionEnd;
    
    event ElectionResult(string name, uint voteCount);
    
    constructor(string memory _name, uint durationMinutes, string memory candidate1, string memory candidate2) public {
        owner = msg.sender;
        name = _name;
        actionEnd = now + (durationMinutes * 1 minutes);
        
        candidates.push(Candidate(candidate1,0));
        candidates.push(Candidate(candidate2,0));
    }
    
    function authorize(address voter) public {
        require(msg.sender == owner);
        require(!voters[voter].voted);
        
        voters[voter].weight = 1;
    }
    
    
    function vote(uint voteIndex) public {
        require(now < actionEnd);
        require(!voters[msg.sender].voted);
        
        voters[msg.sender].voted = true;
        voters[msg.sender].voteIndex = voteIndex;
        
        candidates[voteIndex].voteCount += voters[msg.sender].weight;
    }
    
    function end() public {
        require(msg.sender == owner);
        require(now >= actionEnd);
        
        for( uint i = 0 ; i < candidates.length ; i++ ) {
            emit ElectionResult(candidates[i].name, candidates[i].voteCount);
        }
    }
    
}