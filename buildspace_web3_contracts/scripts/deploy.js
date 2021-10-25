const main = async () => {
    // const [deployer] = await await hre.ethers.getSigners();
    // const accountBalance = await deployer.getBalance();

    // console.log('Deploying contracts with account: ', deployer.address);
    // console.log('Acccount balance: ', accountBalance.toString());

    // const Token = await hre.ethers.getContractFactory('WavePortal');
    // const portal = await Token.deploy();
    // await portal.deployed();

    // console.log('WavePortal address: ', portal.address);

    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.0001'),
  });

  await waveContract.deployed();

  console.log('WavePortal address: ', waveContract.address);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

runMain();