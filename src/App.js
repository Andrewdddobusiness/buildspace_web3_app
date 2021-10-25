import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import WavePortal from "./utils/WavePortal.json"

import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

const App = () => {

  // Just a state variable we use to store our user's public wallet
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentWaveCount, setWaveCount] = useState("0");

  const [currentLoading, setLoading] = useState(false);
  const [message, setMessage] = React.useState('');

  const[allWaves, setAllWaves] = useState([]);

  // Create a variable here that holds the contract address after you deploy!
  const contractAddress = "0xb22bB5106a845aFEC5a4b92Bb75841E0a83335B0";
  const contractABI = WavePortal.abi

  const getAllWaves = async () => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // Call the getAllWaves method form your Smart Contract
        const waves = await wavePortalContract.getAllWaves();

        // We only need address, timestamp and message in our UI so let's pick those out
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        // Store our data in React State
        setAllWaves(wavesCleaned)

        // Listen in for emitter events!
        wavePortalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);

          setAllWaves(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          }])
        })

      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
    
  }


  const checkIfWalletIsConnected = async () => {
    // First make sure we have access to window.ethereum
    try{
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have Metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({method: 'eth_accounts' });

      if (accounts.length !== 0) {
        // accounts[0] grabs the first wallet
        const account = accounts[0];
        console.log("Found an authorized account:", account);        
        setCurrentAccount(account)
        getAllWaves()
      } else {
        console.log("No authorized account found");
      }

    } catch (error) {
        console.log(error);
    }
  }

  // Implement your connectWallet method here
  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    setLoading(true)
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retreived total wave count...", count.toNumber());

         // Execute the actual wave from your smart contract
        //const waveTxn = await wavePortalContract.wave();
        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 })
        console.log("Mining...", waveTxn.hash)

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setWaveCount(count.toNumber())
        setLoading(false)
        

      } else {
        console.log("Ethereum object doesn't exist!");
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleMessage = message => {
    setMessage(message.target.value)
  }


  // This runs our function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am Andrew! Connect your Ethereum wallet and wave at me!
        </div>

        <div className="bio">
          Total Wave Count: {currentWaveCount}
        </div>

        {currentLoading &&
          (<div className="bio">
            <CircularProgress />
          </div>)
        }
        
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {/* If there is no currentAccount render this button */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect wallet
          </button>
        )}

        <div className="bio">
          <TextField
            id="standard-multiline-flexible"
            label="Multiline"
            multiline
            maxRows={4}
            value={message}
            onChange={handleMessage}
            variant="standard"
          />
        </div>

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
        
      </div>
    </div>
  )
}

export default App