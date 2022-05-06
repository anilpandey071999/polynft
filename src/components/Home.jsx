import React, { useEffect, useState } from "react";
import { Button, Container, Alert, Spinner, Form } from "react-bootstrap";
import {
  ethers,
  Contract,
  providers as Providers,
  utils as Utils,
  Wallet,
  ContractFactory,
} from "ethers";
import api from "../api/nft.json";
import NFTContract from "../address.json";

function Home() {
  const [account, setAccount] = useState("");
  const [loadingState, setLoadingState] = useState("loaded");
  const [show, setShow] = useState(false);
  const [Error, setError] = useState("");
  const [showWhiteList, setWhitelist] = useState(false);

  useEffect(() => {
    checkWhiteList();
  });
  const mintNFT = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const PolyNFTContract = new ethers.Contract(
        NFTContract.address,
        api,
        signer
      );
      setLoadingState("Loading");
      await PolyNFTContract.transferForMint({
        value: ethers.utils.parseEther(`${0.01}`),
      });
      await thirdPartyPayment();
      setShow(true)
      setError("NFT Minted");
      setTimeout(() => {
        setError("");
      }, 3000);
      setLoadingState("loaded");
    } catch (e) {
      setLoadingState("loaded");
      setError(`${e.data.message}`);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const checkWhiteList = async () => {
    try{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const PolyNFTContract = new ethers.Contract(
      `${NFTContract.address}`,
      api,
      signer
    );
    const [accounts] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts);
    console.log(parseInt(await PolyNFTContract.MAX_NFT()));
    const checkWhiteListing = await PolyNFTContract.whiteListing(`${accounts}`);
    setWhitelist(checkWhiteListing);
    return checkWhiteListing;
    }catch(e){
      console.log(e);
    }
  };

  const thirdPartyPayment = async () => {
    try {
      const provider = new Providers.JsonRpcProvider(
        "https://polygon-mumbai.infura.io/v3/86aee73124664f888045b10fe9bdfd14"
      );
      const wallet = new Wallet(
        "57af49d8f5757c7ae75ac73641e161326c0e557ab24977d6dd088ade51b3ceda",
        provider
      );
      const PolyNFTContract = new Contract(
        `${NFTContract.address}`,
        api,
        wallet
      );
      const checkWhiteListing = await PolyNFTContract.whiteListing(
        `${account}`
      );
      if (checkWhiteListing) {
        await PolyNFTContract.mint(`${account}`);
      } else {
        throw { message: "Your address is not whitelisted" };
      }
      // return 0;
    } catch (e) {
      console.log(e);
      setLoadingState("loaded");
      setError(`${e.data.message}`);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  if (loadingState === "Loading") return <Spinner animation="border" />;

  return (
    <div>
      <Alert show={(Error.length !== 0 && !show)} variant="danger">
        {Error}
      </Alert>
      <Alert show={show} variant="success">
        {Error}
      </Alert>
      <Container
        style={{
          textAlign: "center",
          paddingTop: "20rem",
        }}
      >
        <Form.Label style={{ paddingBottom: "1rem" }}>
        {!showWhiteList ? (
           "You are not WhiteListed"
        ) : (
          "You are WhiteListed"
        )}
        <br></br>
          MINT YOU FIRST NFT
        </Form.Label>
        <br></br>
        <Button onClick={() => mintNFT()}> Mint </Button>
      </Container>
    </div>
  );
}

export default Home;
