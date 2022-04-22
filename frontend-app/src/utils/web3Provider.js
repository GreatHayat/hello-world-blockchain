import { ethers } from "ethers";

export const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
export const signer = web3Provider.getSigner();
