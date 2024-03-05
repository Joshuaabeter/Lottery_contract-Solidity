const Migrations=artifacts.require('./Migration.sol');

module.exports=function(deployer){
	deployer.deploy(Migrations);
	
}