import { Container, Navbar, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";

const Navbars = () => {
  const [account, setaccount] = useState("");

  useEffect(()=>{
    checkNetwork()  
  })
  const checkNetwork = async () => {
    if (window.ethereum) {
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      // return true if network id is the same
      if (currentChainId !== 4) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x4" }], // chainId must be in hexadecimal numbers
        });
      }
      // return false is network id is different
      return true;
    }
  };

  const connectWallet = async () => {
    const [accounts] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setaccount(accounts);
  };
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/Install">NFT</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
           <Container style={{textAlign:"right"}}> 
             <Button onClick={()=>connectWallet()}>{account.length > 0 ? `${account[0]}${account[1]}${account[2]}${account[3]}${account[4]}...${account[39]}${account[40]}${account[41]}` : "Connect Wallet"}</Button>
           </Container>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navbars;
