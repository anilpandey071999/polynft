import { Container, Navbar, Nav, Button } from "react-bootstrap";
import Install from "./install";
import { ethers } from "ethers";
// import { LinkContainer } from "react-router-bootstrap";
// import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// ReactDOM.render(
//   <React.StrictMode>
//        <Router>
//       <Routes>
//         <Route exact path="/" component={Install} />
//         {/* <Route path="/service" component={Service} />
//         <Route path="/about" component={About} /> */}

//       </Routes>
//     </Router>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

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
      if (currentChainId !== 80001) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }], // chainId must be in hexadecimal numbers
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
          <Navbar.Brand href="/Install">ERC721 Market Place</Navbar.Brand>
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
