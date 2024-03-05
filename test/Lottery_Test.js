let Lottery=artifacts.require('./Lottery.sol'); // retrieve the contract


contract('Lottery', function(accounts){//this is to define the test script/ this returna list of network it deploy

   let lottery;
   let firstAccount;

   beforeEach(async function() {
       contractCreator=accounts[0];
       firstAccount = accounts[1]
       secondAccount = accounts[2]

       lottery= await Lottery.new({from: contractCreator, gas: 2000000});;

   });

   //now lets initialize test cases above is test suite

   it('deploy a contract', async function() { // let get address it was created

       let lottery_add= await lottery.address;
       console.log("Contract address --> ", lottery_add)
   });
	
    it ('allows one account to enter', async function(){
        await lottery.Enter({
            from:firstAccount,
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players=await lottery.getPlayers.call();

         expect(firstAccount).to.equal(players[0]);
         expect(1).to.equal(players.length); // expect is part of chai which is part of macha
      });

    it ('allows one multiple to enter', async function(){

            await lottery.Enter({
            from:firstAccount,
            value: web3.utils.toWei('0.02', 'ether')
        });


         await lottery.Enter({
            from:secondAccount,
            value: web3.utils.toWei('0.02', 'ether')
        });

         const players=await lottery.getPlayers.call();

         expect(firstAccount).to.equal(players[0]);
         expect(secondAccount).to.equal(players[1]);

         expect(2).to.equal(players.length);
    });

    it('Only manager can call pickWinner()', async function() {

        const manager=await lottery.manager.call();
        console.log("Manager/Contract Creator --> ", manager);
        expect(manager).to.equal(contractCreator);

        try{
            await lottery.PickWinner({
                from: firstAccount,
            });
        } catch(error){
           console.log("Error --> ", error.message) 
        }
    });
    it('send money to the winner and resets the players array', async function(){

            await lottery.Enter({
            from:firstAccount,
            value: web3.utils.toWei('0.02', 'ether')
        });

            let players= await lottery.getPlayers.call();
            expect(1).to.equal(players.length);

            let initialBalance= await web3.eth.getBalance(firstAccount);

            await lottery.PickWinner({
                from: contractCreator
            });

            let finalBalance= await web3.eth.getBalance(firstAccount);
            const difference= finalBalance - initialBalance;

            let winningPrice=await web3.utils.toWei('0.018', 'ether');
            expect(Number(difference)).to.be.at.least(Number(winningPrice));

            // below is to ensure the array is reset after picking a winner

            players= await lottery.getPlayers.call();
            expect(0).to.equal(players.length);
    });
});