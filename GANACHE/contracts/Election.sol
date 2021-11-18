pragma experimental ABIEncoderV2;
pragma solidity >=0.5.16;

/**
* Implémentation d'un système de vote avec délégation
* @title E-Voting Network
* @author Bayle Nathanaël & Guy Adrien
*/
contract Election {
    
    /**
     * Structure Proposal
     */
    struct Proposal {
        // Nom du l'option
        string name;   
        // Nombre total de votes
        uint voteCount;
    }

    /**
     * Structure Voters
     */
    struct Voter {
        // Le poid du vote en fonction de la délégation
        uint weight; 
        // Si vrai, la personne à déjà voté
        bool voted; 
        // L'adresse pour la délégation
        address delegate;
        // L'index du choix du vote
        uint vote;  
    }

    // Adresse de l'admin
    address public admin;

    // Déclaration d'un mapping
    // Pour chaque adresse on associe un participant au vote 
    mapping(address => Voter) public voters;

    // Tableau dynamique représentant la liste des options pour le vote
    Proposal[] public proposals;

    uint public proposals_count;

    // voted event
    event votedEvent (
        uint indexed _proposal
    );

    /**
     * Constructeur d'un nouveau vote à choisir parmis les 'proposalNames'
     */
    constructor ( string[] memory proposalNames ) public {
        admin = msg.sender;
        voters[admin].weight = 1;

        // Pour chaque élément dnas 'proposalNames'
        // Création d'un nouveau objet 'Proposal'
        for ( uint i = 0 ; i < proposalNames.length ; i++ ) {
            // Création d'un 'Propoosal' et l'ajoute a la fin de la liste 'proposals'
            proposals.push( Proposal({ name: proposalNames[i], voteCount: 0 } ) ) ;
            proposals_count = proposals_count + 1;
        }
    }

    /**
     * Donne le vote (et celui de la délégation) au proposal passé en paramètre  
     */
    function vote ( uint proposal ) public {
        Voter storage sender = voters[msg.sender];
        require( !sender.voted, "Vous avez deja vote.");
        require( sender.weight != 0, "Vous n'avez pas le droit de vote.");
        sender.voted = true;
        sender.vote = proposal;

        proposals[proposal].voteCount += sender.weight;
        emit votedEvent ( proposal );
    }

    /**
     * Donne le droit au un voter de voter pour cette élection
     */
    function giveRightToVote ( address voter ) public {
        // Vérification de l'admin
        require( msg.sender == admin, "Seul l'admin peut donner le droit de vote." );
        // Vérification pour le Voter
        require( !voters[voter].voted, "Le Voter a deja vote." );
        require( voters[voter].weight == 0, "Le Voter a deja le droit de vote" );
        // Affectation du poid au voter
        voters[voter].weight = 1;
    }

    /**
     * Appelle la fonction winningProposal() pour obtenir 
     * l'index du vainqueur, et retourne son nom.
     */
    function winnerName() public view returns (string memory winnerName_, uint winningVoteCount_ ) {
        winnerName_ = proposals[ winningProposal() ].name;
        winningVoteCount_ = proposals[ winningProposal() ].voteCount;
    }

    /**
     * Calcule le vainqueur de l'éléction. 
     */
    function winningProposal() public view returns ( uint winningProposal_ ) {
        uint winningVoteCount = 0;
        for ( uint p = 0 ; p < proposals.length ; p++ ) {
            if ( proposals[p].voteCount > winningVoteCount ) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /**
     * Délégation pour le vote
     */
    function delegate ( address to ) public {
        Voter storage sender = voters[msg.sender];
        require( !sender.voted, "Vous avez deja vote." );

        require( to != msg.sender, "L'auto delegation n'est pas autorise.");

        while ( voters[to].delegate != address( 0 ) ) {
            to = voters[to].delegate;

            require ( to != msg.sender, "Delegation circulaire.");
        }

        sender.voted = true;
        sender.delegate = to;

        Voter storage delegate_ = voters[to];

        if ( delegate_.voted ) {
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            delegate_.weight += sender.weight;
        }
    }
}