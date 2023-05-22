import { useState } from "react";
import { ethers } from "ethers";

import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import axios from "axios";


import { marketplaceAddress } from "../config";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";



export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxContentLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: "570c879df80544dd2c62",
            pinata_secret_api_key: "51cb8f48c5aa38e8aa53f6551d27df69afae45837f60931adc4be63d4a243a41",
          },
        }
      );
      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    console.log("fileurl", fileUrl);
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const formData = new FormData();
      formData.append("file", new Blob([data], { type: "application/json" }));
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxContentLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: "570c879df80544dd2c62",
            pinata_secret_api_key: "51cb8f48c5aa38e8aa53f6551d27df69afae45837f60931adc4be63d4a243a41",
          },
        }
      );
      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  async function listNFTForSale() {
  if (!fileUrl) {
    console.log("Please select a file");
    return;
  }
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const price = ethers.utils.parseUnits(formInput.price, "ether");
  let contract = new ethers.Contract(
    marketplaceAddress,
    NFTMarketplace.abi,
    signer
  );
  let listingPrice = await contract.getListingPrice();
  listingPrice = listingPrice.toString();
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
  const url = await uploadToIPFS();
  let transaction = await contract.createToken(url, price, {
    value: listingPrice,
  });
  await transaction.wait();
  router.push("/");
}

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create NFT
        </button>
      </div>
    </div>
  );
}