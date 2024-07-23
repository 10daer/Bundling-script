const express = require("express");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const contract = require("../build/contracts/TxnBundler.json");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const web3 = new Web3("http://localhost:8545"); // Connect to your Ethereum node

async function getContract() {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = contract.networks[networkId];
  return new web3.eth.Contract(
    contract.abi,
    deployedNetwork && deployedNetwork.address
  );
}

app.post("/bundle", async (req, res) => {
  const { from, to, amount } = req.body;

  try {
    const txnBundler = await getContract();
    const receipt = await txnBundler.methods.bundleTransaction(to).send({
      from: from,
      value: web3.utils.toWei(amount, "ether"),
    });
    res.json({ status: "Transaction Bundled", receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/executeBundle", async (req, res) => {
  const { from } = req.body;

  try {
    const txnBundler = await getContract();
    const receipt = await txnBundler.methods
      .executeBundle()
      .send({ from: from });
    res.json({ status: "Bundle Executed", receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
