// to deploy the lottery smart contract
let Lottery=artifacts.require('./Lottery.sol');

module.exports= async function(deployer){
	await deployer.deploy(Lottery);
	
}