import React, { useState } from "react";
import { ethers } from "ethers";
import { Alert, Button, Col, Container, Row } from "reactstrap";
import greet from "./abi/greet.json";
import { web3Provider, signer } from "./utils/web3Provider";

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [contract, setContract] = useState("");
  const [contractValue, setContractValue] = useState("");
  const [greetings, setGreetings] = useState("");

  const handleLogin = async () => {
    if (!window.ethereum) {
      alert("Please install the metamask");
      return;
    }

    await web3Provider.send("eth_requestAccounts");

    const address = await signer.getAddress();
    setWalletAddress(address);

    let balance = await web3Provider.getBalance(address);
    balance = ethers.utils.formatEther(balance);
    setWalletBalance(balance);

    // Initiate the contract
    // make sure you have the correct value of 'CONTRACT_ADDRESS' when
    // you will apply the command 'npx hardhat run scripts/deploy.js --network localhost
    const contract = new ethers.Contract(CONTRACT_ADDRESS, greet.abi, signer);
    setContract(contract);
  };

  const getGreetings = async () => {
    const message = await contract.greet();
    setContractValue(message);
  };

  const handleSubmitGreetings = async () => {
    const transaction = await contract.setGreeting(greetings);

    const transactionReceipt = await web3Provider.getTransactionReceipt(
      transaction.hash
    );

    if (transactionReceipt.confirmations === 1) {
      await getGreetings();
      setGreetings("");
      alert("Transaction Confirmed!");
    }
  };

  return (
    <Container className="mt-5">
      {!walletAddress && (
        <div className="text-center">
          <Button color="primary" onClick={handleLogin}>
            Login With Metamask
          </Button>
        </div>
      )}
      {walletAddress && (
        <>
          <Row className="mt-5">
            <h2 className="text-center mb-3">Wallet Details</h2>
            <Col md={6}>
              <Alert color="primary">
                <strong>Wallet Address:</strong> {walletAddress}
              </Alert>
            </Col>
            <Col md={6}>
              <Alert color="primary">
                <strong>Wallet Balance:</strong> {walletBalance}{" "}
                <strong>ETH</strong>
              </Alert>
            </Col>
          </Row>

          <div className="mt-5">
            <Button color="primary" className="mb-2" onClick={getGreetings}>
              Get Smart Contract Greetings
            </Button>
            {contractValue && <Alert color="success">{contractValue}</Alert>}
          </div>

          <div className="mt-5">
            <h2 className="mb-2">Send Greetings to Smart Contract</h2>
            <input
              placeholder="enter your greetings..."
              className="form-control mb-2"
              value={greetings}
              onChange={({ target: { value } }) => setGreetings(value)}
            />
            <Button color="success" onClick={handleSubmitGreetings}>
              SEND
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default App;
