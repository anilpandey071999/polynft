const { expect } = require("chai");
const { ethers } = require("hardhat");

let PolyNFTContract
let polyNFTContract
beforeEach(async ()=>{
  PolyNFTContract = await ethers.getContractFactory("PolyNFT");
    polyNFTContract = await PolyNFTContract.deploy(
      3000,
      "ipfs://bafkreignkbzn4nhtxixs5u7x3zprgzg653kzi3pkljxlyb3bag5e7vhx3u",
      "ipfs://bafybeic26wp7ck2bsjhjm5pcdigxqebnthqrmugsygxj5fov2r2qwhxyqu/"
    );
  
    await polyNFTContract.deployed();
})

describe("POLYGON NFT", function () {
  it("Checking Max NFT Count", async function () {
    await polyNFTContract.deployed();
    expect(parseInt(await polyNFTContract.MAX_NFT())).to.equal(3000);
  });
  
  it("Checking Sale Status",async ()=>{
    await polyNFTContract.ToggleWhitelist();
    expect(await polyNFTContract.saleIsActiveWhiteList()).to.equal(true)
  });

  it("Checking Whitelist",async ()=>{
    let [owner] = await ethers.getSigners();

    await polyNFTContract.ToggleWhitelist();
    await polyNFTContract.Whitelistings(owner.address);
    expect(await polyNFTContract.whiteListing(owner.address)).to.equal(true)
  });

  it("Checking PayWall",async ()=>{
    let [owner] = await ethers.getSigners();

    await polyNFTContract.ToggleWhitelist();
    await polyNFTContract.Whitelistings(owner.address);
    await polyNFTContract.transferForMint({value: ethers.utils.parseEther(`${0.01}`)});
    expect(parseInt(await polyNFTContract.payWall(owner.address))).to.equal(10000000000000000)
  });

  it("Checking mint",async ()=>{
    let [owner] = await ethers.getSigners();

    await polyNFTContract.ToggleWhitelist();
    await polyNFTContract.Whitelistings(owner.address);
    await polyNFTContract.transferForMint({value: ethers.utils.parseEther(`${0.01}`)});
    await polyNFTContract.mint(owner.address);
    expect(parseInt(await polyNFTContract.balanceOf(owner.address))).to.equal(1)
  });

  it("trying to more then one nft mint",async ()=>{
    let [owner] = await ethers.getSigners();
try{
    await polyNFTContract.ToggleWhitelist();
    await polyNFTContract.Whitelistings(owner.address);
    await polyNFTContract.transferForMint({value: ethers.utils.parseEther(`${0.01}`)});
    await polyNFTContract.mint(owner.address);
    await polyNFTContract.Whitelistings(owner.address);
    await polyNFTContract.transferForMint({value: ethers.utils.parseEther(`${0.01}`)});
    await polyNFTContract.mint(owner.address)
    }catch(e){
      expect(e).to.not.equal("Error: VM Exception while processing transaction: reverted with reason string 'You can only mine 1 NFT per Address")
    }
  });

});
