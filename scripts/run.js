const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();

    // Compile our contract.
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    
    //Deploy the contract.
    const waveContract = await waveContractFactory.deploy();
    
    //Wait for contract to be mined.
    await waveContract.deployed();
    require("@nomiclabs/hardhat-waffle");

    // Print Contract and Owner address
    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);

    // Get Current Total Waves
    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    // Wait for wave() to be mined.
    waveTxn = await waveContract.connect(randomPerson).wave();
    await waveTxn.wait();

    // Get Updated Total Waves
    waveCount = await waveContract.getTotalWaves();

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