// Call loadCandidates function when DOM content is loaded
document.addEventListener('DOMContentLoaded', async () => {
  if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
  } else {
      alert("Please install MetaMask extension!");
      return; // Stop execution if MetaMask is not installed
  }

  const contractAddress = "0x281c4855f87EE32A39f9D86AD0f1880670c96f10"; // Replace with your deployed contract address
  const contractABI = [{"inputs":[{"internalType":"bytes32","name":"candidateName","type":"bytes32"}],"name":"addCandidate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidateList","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"countCandidates","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"candidateName","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"candidateName","type":"bytes32"}],"name":"validCandidate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"candidateName","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}];
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  const candidateSelect = document.getElementById("candidate");
  const voteForm = document.getElementById("voteForm");
  const candidatesDiv = document.getElementById("candidates");

  async function loadCandidates() {
      try {
          console.log("Loading candidates...");
          const candidateCount = await contract.methods.countCandidates().call();
          candidateSelect.innerHTML = ""; // Clear previous options
          candidatesDiv.innerHTML = ""; // Clear previous candidate names and votes
          for (let i = 0; i < candidateCount; i++) {
              const candidate = await contract.methods.candidateList(i).call();
              const candidateName = web3.utils.hexToUtf8(candidate);
              const totalVotes = await contract.methods.totalVotesFor(candidate).call();
              const candidateInfo = `${candidateName} - Total Votes: ${totalVotes}`;
              const option = document.createElement("option");
              option.text = candidateInfo;
              option.value = candidateName; // Set option value to candidate name
              candidateSelect.add(option);

              // Create a div to display candidate name and total votes
              const candidateDiv = document.createElement("div");
              candidateDiv.textContent = candidateInfo;
              candidatesDiv.appendChild(candidateDiv);
          }
          console.log("Candidates loaded");
      } catch (error) {
          console.error("Error loading candidates:", error);
      }
  }

  // Load candidates initially
  await loadCandidates();

  // Event listener for form submission
  voteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const selectedCandidate = candidateSelect.value;
      const accounts = await web3.eth.getAccounts(); // Get accounts from MetaMask
      const fromAddress = accounts[0]; // Assuming the user has at least one account connected
      await contract.methods.voteForCandidate(web3.utils.utf8ToHex(selectedCandidate)).send({ from: fromAddress });
      alert(`You voted for ${selectedCandidate}.`);
      // Update displayed candidates and their votes after voting
      await loadCandidates();
  });

  const addCandidateForm = document.getElementById("addCandidateForm");
  const newCandidateInput = document.getElementById("newCandidate");

  addCandidateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newCandidateName = newCandidateInput.value;
      const accounts = await web3.eth.getAccounts(); // Get accounts from MetaMask
      const fromAddress = accounts[0]; // Assuming the user has at least one account connected

      // Check if the input is not empty
      if (newCandidateName.trim() !== "") {
          try {
              // Interact with the contract to add the new candidate
              await contract.methods.addCandidate(web3.utils.utf8ToHex(newCandidateName)).send({ from: fromAddress });
              alert(`New candidate "${newCandidateName}" added successfully.`);
              // Update the candidate list after adding the new candidate
              await loadCandidates();
              // Clear the input field after adding the candidate
              newCandidateInput.value = "";
          } catch (error) {
              console.error("Error adding candidate:", error);
              alert("Failed to add new candidate. Please try again.");
          }
      } else {
          alert("Please enter a candidate name.");
      }
  });


});
