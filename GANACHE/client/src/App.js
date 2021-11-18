import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import Navbar from "./components/Navbar";
import Table from "./components/Table";
import Election from "./contracts/Election.json";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const App = () => {
  // input value
  const classes = useStyles();
  const [chooseid, setChooseid] = useState("");

  const handleChange = (e) => {
    setChooseid(e.target.value);
  };
  const [refresh, setrefresh] = useState(0);

  //things realted to web3
  let content;
  const [loading2, setloading2] = useState(false);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);

  //states related to electioncontract
  const [Electioncontract, setElectioncontract] = useState();
  const [contractowner, setContractowner] = useState("");
  const [voted, setVoted] = useState(false);
  const [showlead, setShowLead] = useState(false);
  const [Candidates, setCandidates] = useState([]);
  const [voterAddress, setVoterAddress] = useState("");
  const [leading, setLeading] = useState([]);

  const loadWeb3 = async () => {
    if (window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    } else{
      window.alert("Non Ethereum Browser Detected")
    }
  }

  const loadBlockchainData = async () => {
    setLoading(true);
    if (typeof window.ethereum == "undefined") {
      return;
    }
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0])

    const networkId = await web3.eth.net.getId();
    const networkData = Election.networks[networkId];
    console.log(networkId, networkData)

    if(networkData){
      const electionContract = new web3.eth.Contract(
        Election.abi, 
        networkData.address
      );

      setElectioncontract(electionContract);

      const owner = await electionContract.methods.admin().call();
      console.log(owner);
      setContractowner(owner);

      var x = await electionContract.methods.proposals_count().call();
      var arr = [];

      for (var i = 0; i < x; i++) {
        await electionContract.methods
          .proposals(i)
          .call()
          .then((proposal) => {
            arr = [
              ...arr,
              { id: i + 1, name: proposal[0], voteCount: proposal[1] },
            ];
          });
      }
      setCandidates(arr);
      setLoading(false);
    } else {
      window.alert("the contract not deployed to detected network.");
      setloading2(true);
    }
  };

  const walletAddress = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [ { eth_accounts: {}, }, ], 
    });
    window.location.reload();
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();

    if (refresh === 1) {
      setrefresh(0);
      loadBlockchainData();
    }
  }, [refresh]);

  const addVoter = async () => {
    
    try {
      await Electioncontract.methods
        .giveRightToVote(voterAddress)
        .send({ from: account })
        .then((a) => {
          console.log(a);
        });
    } catch ( err ) {
        window.alert( err.message);
    }
  };

  const givevote = async () => {
    try {
      let ChoiceId = chooseid - 1;
      await Electioncontract.methods
        .vote(ChoiceId)
        .send({ from: account })
        .then((a) => {
          let id_returned = a.events.votedEvent.returnValues._proposal;
          console.log(id_returned);
        });
      setVoted(!voted);
    } catch (err) {
      window.alert(err.message);
    }
  };

  const showLeader = async() => {
    try {
      var winner = await Electioncontract.methods.winnerName().call();
      if (winner.winningVoteCount_ == 0) {
        window.alert("Aucun votes pour le moment");
      } else {
        setLeading({ name: winner.winnerName_, votes: winner.winningVoteCount_ });
        setShowLead(!showlead);
      }
    } catch (err) {
      window.alert(err.message);
    }
  };

  if (loading === true) {
    content = (
      <p className="text-center">
        Loading...{loading2 ? <div>loading....</div> : ""}
      </p>
    );
  } else {
    content = (
      <div className="app">
        <div className="table">
          <Table Candidates={Candidates} />
        </div>
        <div className="do_vote">
          <h3>Select a candidate and click the "VOTE" button</h3>
        </div>
        <div className="input_id">
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Select ID</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chooseid}
              onChange={handleChange}
            >
              {Candidates.length !== 0 ? (
                  Candidates.map((candidate) => (
                    <MenuItem key={candidate.name} value={candidate.id}>
                      {candidate.id}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={0}>No candidate</MenuItem>
                )
              }
            </Select>
          </FormControl>
          <Button variant="contained" onClick={givevote}>
            VOTE
          </Button>
        </div>
        <div className="after_voting">
          {voted && <h6>THANK YOU FOR YOUR VOTE</h6>}
        </div>
        <div className="showinguser_address">
          <h4>Your Address: {account}</h4>
        </div>
        <hr className="news1" />
        <div className="lead_title">
          <h4>FIND THE LEADING CANDIDATE</h4>
          <Button variant="contained" onClick={showLeader}>
            LEADING
          </Button>
        </div>
        {showlead && (
          <div className="leader_details">
            <p>Name: {leading.name}</p>
            <p>Votes: {leading.votes}</p>
          </div>
        )}

        {contractowner === account && (
          <div className="add_voter" id="add">
            <h3>Enter the adress of new voter :</h3>
            <form className="voter_form">
              <TextField
                id="outlined-basic"
                label="Adress"
                autoComplete="off"
                variant="outlined"
                value={voterAddress}
                onChange={(e) => setVoterAddress(e.target.value)}
              />
            </form>
            <Button variant="contained" onClick={addVoter}>
              SUBMIT
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Navbar account={contractowner} />

      {account === "" ? (
        <div className="container">
          {" "}
          Connect your wallet to application{"   "}{" "}
          <button onClick={walletAddress}>metamask</button>
        </div>
      ) : (
        content
      )}
      {}
    </div>
  );
};

export default App;