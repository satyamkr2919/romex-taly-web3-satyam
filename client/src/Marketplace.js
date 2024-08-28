// client/src/Marketplace.js
import React, { useState, useEffect } from "react";
import web3 from "./web3";
import MarketplaceContract from "./MarketplaceContract.json"; // ABI and contract details

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address
const contract = new web3.eth.Contract(
  MarketplaceContract.abi,
  contractAddress
);

function Marketplace() {
  const [contentList, setContentList] = useState([]);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [account, setAccount] = useState("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const contents = [];
      const contentCount = await contract.methods.nextContentId().call();
      for (let i = 0; i < contentCount; i++) {
        const content = await contract.methods.contents(i).call();
        contents.push(content);
      }
      setContentList(contents);
    };

    loadBlockchainData();
  }, []);

  const handleCreateContent = async () => {
    await contract.methods
      .createContent(
        newContent.title,
        newContent.description,
        web3.utils.toWei(newContent.price, "ether")
      )
      .send({ from: account });
    setNewContent({ title: "", description: "", price: "" });
    // Optionally refresh content list
  };

  const handleBuyContent = async (id, price) => {
    await contract.methods.buyContent(id).send({ from: account, value: price });
    // Optionally refresh content list
  };

  return (
    <div>
      <h1>Marketplace</h1>
      <div>
        <h2>Create New Content</h2>
        <input
          type="text"
          placeholder="Title"
          value={newContent.title}
          onChange={(e) =>
            setNewContent({ ...newContent, title: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description"
          value={newContent.description}
          onChange={(e) =>
            setNewContent({ ...newContent, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Price in ETH"
          value={newContent.price}
          onChange={(e) =>
            setNewContent({ ...newContent, price: e.target.value })
          }
        />
        <button onClick={handleCreateContent}>Create Content</button>
      </div>
      <div>
        <h2>Available Contents</h2>
        <ul>
          {contentList.map((content) => (
            <li key={content.id}>
              <h3>{content.title}</h3>
              <p>{content.description}</p>
              <p>Price: {web3.utils.fromWei(content.price, "ether")} ETH</p>
              <button
                onClick={() => handleBuyContent(content.id, content.price)}
              >
                Buy
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Marketplace;
