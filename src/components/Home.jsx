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
import { GroupedButtons, slotvalue } from "./GroupedButtons";

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
      let whiteListingPrice = parseInt(
        await PolyNFTContract.whiteListingPrice()
      );
      let trx = await PolyNFTContract.Minting(slotvalue, {
        value: `${whiteListingPrice * slotvalue}`,
      });
      // await thirdPartyPayment();
      await trx.wait();
      setShow(true);
      setError("NFT Minted");
      setTimeout(() => {
        setShow(false);
        setError("");
      }, 3000);
      setLoadingState("loaded");
    } catch (e) {
      setLoadingState("loaded");
      setError(`${e.data?.message === undefined ? e.code : e.data.message}`);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const checkWhiteList = async () => {
    try {
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
      // console.log(parseInt(await PolyNFTContract.MAX_NFT()));
      const checkWhiteListing = await PolyNFTContract.whiteListing(
        `${accounts}`
      );
      setWhitelist(checkWhiteListing);
      return checkWhiteListing;
    } catch (e) {
      console.log(`${e}`);
    }
  };

  if (loadingState === "Loading") return <Spinner animation="border" />;

  return (
    <div>
      <Alert show={Error.length !== 0 && !show} variant="danger">
        {Error}
      </Alert>
      <Alert show={show} variant="success">
        {Error}
      </Alert>
      <Container
        style={{
          textAlign: "center",
          paddingTop: "5rem",
        }}
      >
        <div className="TokenDetails">
          <h1 className="tokenMinted">Points to note:</h1>
          <h3 className="tokenMinted">
            1. This is the ONLY Official site for minting Hungry Whales.
          </h3>
          <h3 className="tokenMinted">
            2. A maximum of 15 HW NFTs can be minted per wallet.
          </h3>
          <h3 className="tokenMinted">
            3. A maximum of 15 HW NFTs can be minted in one minting attempt.
          </h3>
          <h3 className="tokenMinted">
            4. You shall be contacted by someone from HW admin team after
            successful mint for on-boarding process within 24 hours. If not
            contacted, you can write to <a href="mailto:hungrywhalesnft@gmail.com">hungrywhalesnft@gmail.com</a>
          </h3>
          <h3 className="tokenMinted">
            5. You may write any queries or concerns to <a href="mailto:hungrywhalesnft@gmail.com">hungrywhalesnft@gmail.com</a>
          </h3>
          <h3 className="tokenMinted">See you on the other side!</h3>
        </div>
        <Form.Label style={{ paddingBottom: "1rem" }}>
          
          {!showWhiteList ? "You are not WhiteListed" : "You are WhiteListed"}
          <br></br>
          MINT YOU FIRST NFT
        </Form.Label>
        <GroupedButtons />
        <br></br>
        <Button onClick={() => mintNFT()}> Mint </Button>
      </Container>
    </div>
  );
}

export default Home;
