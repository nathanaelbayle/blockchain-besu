var Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  deployer.deploy(Election, ["Pain Au Chocolat", "Chocolatine", "Petit Pain"]);
};
