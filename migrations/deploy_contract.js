const TxnBundler = artifacts.require("TxnBundler");

module.exports = function (deployer) {
  deployer.deploy(TxnBundler);
};
