async function main() {
    const { ethers } = require("hardhat");
    const { API_URL, PRIVATE_KEY, CON_ADD } = process.env;

    // Deploy your contract
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    console.log("Voting contract deployed to:", voting.address);

    // Add candidates
    const candidateNames = ["Shem Payad", "Reden Gopez", "Mark Furton"]; // Add more candidate names as needed
    for (let i = 0; i < candidateNames.length; i++) {
        const candidateNameBytes32 = ethers.utils.formatBytes32String(candidateNames[i]);
        await voting.addCandidate(candidateNameBytes32);
        console.log(`Added candidate: ${candidateNames[i]}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
