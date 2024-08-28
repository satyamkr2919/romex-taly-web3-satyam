// client/src/web3.js
import Web3 from "web3";

// Connect to the local blockchain (Ganache)
const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

export default web3;
