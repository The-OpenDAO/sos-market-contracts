/* eslint-disable prefer-const */
/* eslint-disable node/no-missing-import */
/* eslint-disable prettier/prettier */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { OpenDAOStakingDev, MyERC20 } from "../typechain";
import { timestampInSecond } from "../utils/timestamp";
import { MONTH, MINUTE, DAY, YEAR, HOUR } from "../utils/constants";
// 0.000000001 Ether = 1Gwei
const provider = ethers.provider;
let now = timestampInSecond();

// eslint-disable-next-line no-unused-vars
const utils = ethers.utils;

let owner: SignerWithAddress;
// eslint-disable-next-line no-unused-vars
let alice: SignerWithAddress;
// eslint-disable-next-line no-unused-vars
let bob: SignerWithAddress;
// eslint-disable-next-line no-unused-vars
let charlie: SignerWithAddress;
// eslint-disable-next-line no-unused-vars
let david: SignerWithAddress;

let SOS: MyERC20;
let veSOS: OpenDAOStakingDev;

async function init(start: number, duration: number) {
  expect(31337).eq((await provider.getNetwork()).chainId);
  [owner, alice, bob, charlie, david] = await ethers.getSigners();

  const MyERC20Factory = await ethers.getContractFactory("MyERC20");
  SOS = await MyERC20Factory.connect(owner).deploy("SOS");

  const OpenDAOPoolFactory = await ethers.getContractFactory("OpenDAOStakingDev");
  veSOS = await OpenDAOPoolFactory.connect(owner).deploy(SOS.address, start, duration);

  await veSOS.setblockTime(now);
}

async function depositSOS(signer: SignerWithAddress, amount: bigint) {
  await SOS.connect(signer).mint(e(amount));
  await SOS.connect(signer).approve(veSOS.address, e(BigInt(1e14)));
}

// eslint-disable-next-line no-unused-vars
function e2b(amount: bigint): BigNumber { return BigNumber.from(amount.toString()) }
function e(amount: bigint): bigint { return amount * BigInt(1e18) }
function b(amount: bigint): BigNumber { return utils.parseEther(amount.toString()) }
function b2e(amount: BigNumber): bigint { return BigInt(amount.toString()) }

async function advance(duration: number): Promise<number> {
  const t = (await veSOS.blockTime()).toNumber() + duration;
  now = t;
  await veSOS.connect(owner).setblockTime(t);
  return t;
}

/*
npx hardhat test test/test-pool.ts
*/
describe("test-pool.ts", function () {
  it("limitation min", async () => {
    await init(now + DAY, YEAR);

  });

});

// uint256 _fee, 0.02 ether %
// IERC20 _token, 0xbde45657Ca430D6dc01f3F51aE9C1a49669cE3F6
// uint256 _requiredBalance, 1000 ether
// address _realitioAddress, RealitioERC20 0x7247ed44cb86214f8ff84bb83b265d411613367b
// uint256 _realitioTimeout, 3 days
// address _treasury

