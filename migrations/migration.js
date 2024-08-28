// migrations/2_deploy_contracts.js
const Marketplace = artifacts.require("Marketplace");

module.exports = function (deployer) {
  deployer.deploy(Marketplace);
};
