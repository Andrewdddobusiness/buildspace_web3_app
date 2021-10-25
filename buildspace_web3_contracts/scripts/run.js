const { hexToRgb } = require("@mui/system");

require("@nomiclabs/hardhat-waffle");

const main = async () => {
    //const [owner, randomPerson] = await hre.ethers.getSigners();

    // // Compile our contract.
    // const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    
    // //Deploy the contract.
    // const waveContract = await waveContractFactory.deploy();
    
    // //Wait for contract to be mined.
    // await waveContract.deployed();
    // console.log('Contract addy:', waveContract.address);

    // let waveCount;
    // waveCount = await waveContract.getTotalWaves();
    // console.log(waveCount.toNumber());

    // // Let's send a few waves!
    // let waveTxn = await waveContract.wave('A message!');
    // await waveTxn.wait(); // Wait for the transaction to be mined

    // const [_, randomPerson] = await hre.ethers.getSigners();
    // waveTxn = await waveContract.connect(randomPerson).wave('Another message!');
    // await waveTxn.wait(); // Wait for the transaction to be mined

    // let allWaves = await waveContract.getAllWaves();
    // console.log(allWaves);

    // // Print Contract and Owner address
    // console.log("Contract deployed to:", waveContract.address);
    // console.log("Contract deployed by:", owner.address);

    // // Get Current Total Waves
    // let waveCount;
    // waveCount = await waveContract.getTotalWaves();

    // // Wait for wave() to be mined.
    // waveTxn = await waveContract.connect(randomPerson).wave();
    // await waveTxn.wait();

    // // Get Updated Total Waves
    // waveCount = await waveContract.getTotalWaves();

    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal')
    const waveContract = await waveContractFactory.deploy({
      value: hre.ethers.utils.parseEther('0.1'), //deploy contract and fund with 0.1 ETH
    });
    await waveContract.deployed();
    console.log('Contract addy:', waveContract.address);

  
    // Get Contract balance
    let contractBalance = await hre.ethers.provider.getBalance(
      waveContract.address
    );
    console.log(
      'Contract balance:',
      hre.ethers.utils.formatEther(contractBalance) // tests with contract has balance of 0.1
    );

    // Send Waves
    const waveTxn = await waveContract.wave('This is wave #1');
    await waveTxn.wait();

    const waveTxn2 = await waveContract.wave('This is wave #2');
    await waveTxn2.wait();

    // Get contract balance to see what happened!
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
      'Contract balance:',
      hre.ethers.utils.formatEther(contractBalance) // check if contract has removed 0.0001ETH
    );

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
};


const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

runMain();