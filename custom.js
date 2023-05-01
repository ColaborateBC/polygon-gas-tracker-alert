// Define the audio element and load the sound file
const alertSound = new Audio(`inalert.mp3`);
alertSound.volume = 1; // Set volume to 1 (100%)


let lastProposeGasPrice = 0;
let lastFastGasPrice = 0;
let gasPriceThreshold = 200;
let telId;

// Function to fetch gas price and update the DOM
const fetchAndUpdateGasPrice = async () => {
  try {
    const response = await fetch(`http://localhost:3000/get-data`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (!data || !data.ProposeGasPrice || !data.FastGasPrice) {
      // throw new Error("Response data is not structured properly");
      // console.log(data);
    }
    const proposeGasPrice = +data.proposeGasPrice;
    const fastGasPrice = +data.fastGasPrice;
    // Check if the values are numbers using isNaN() function
    if (!isNaN(proposeGasPrice) && !isNaN(fastGasPrice)) {
      // Update the #proposedGasPrice element with the proposed gas price
      document.title = `${proposeGasPrice} - ${fastGasPrice} Polygon GasTracker`;
      document.getElementById(
        "proposedGasPrice"
      ).textContent = `Proposed Gas Price: ${proposeGasPrice}`;
      document.getElementById(
        "fastGasPrice"
      ).textContent = `Fast Gas Price: ${fastGasPrice}`;
      if (proposeGasPrice <= gasPriceThreshold || fastGasPrice <= gasPriceThreshold) {
        // Sound an alert
        alertSound.play();
      }

      // Store last fetched values in localStorage
      localStorage.setItem("lastProposeGasPrice", proposeGasPrice);
      localStorage.setItem("lastFastGasPrice", fastGasPrice);
    } else {
      // Handle case when values are NaN by using last fetched values from localStorage
      console.error("Fetched data contains NaN values. Using last fetched values from localStorage.");
      const lastProposeGasPrice = localStorage.getItem("lastProposeGasPrice");
      const lastFastGasPrice = localStorage.getItem("lastFastGasPrice");
      if (lastProposeGasPrice !== null && lastFastGasPrice !== null) {
        // Update the DOM with last fetched values from localStorage
        document.title = `${lastProposeGasPrice} - ${lastFastGasPrice} Polygon GasTracker`;
        document.getElementById(
          "proposedGasPrice"
        ).textContent = `Proposed Gas Price: ${lastProposeGasPrice}`;
        document.getElementById(
          "fastGasPrice"
        ).textContent = `Fast Gas Price: ${lastFastGasPrice}`;
      } else {
        // If localStorage values are not available, use default values
        console.error("No last fetched values found in localStorage. Using default values.");
        document.title = `0 - 0 Polygon GasTracker`;
        document.getElementById(
          "proposedGasPrice"
        ).textContent = `Proposed Gas Price: 0`;
        document.getElementById(
          "fastGasPrice"
        ).textContent = `Fast Gas Price: 0`;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

// Fetch and update gas price initially
fetchAndUpdateGasPrice();

//Update description class in html
const handleGasPriceThreshold = (gasPriceThreshold) => {
  document.getElementById("gasPriceInfo").textContent = `Alert will ring at ${gasPriceThreshold} gasPriceInfo (reloads / 5 seconds)`
};

// Set interval to fetch and update gas price every 10 seconds
setInterval(() => {
  fetchAndUpdateGasPrice();
}, 5000); // 5 seconds in milliseconds

// Add event listener to the preview button
document.getElementById("previewButton").addEventListener("click", () => {
  // Play the alert sound
  alertSound.play();
});

//Submiting the threashholder for new gasTracker values
document.getElementById("gasPriceThresholdForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  gasPriceThreshold = document.getElementById("gasPriceThreshold").value; // Get the value of gasPriceThreshold input field
  // Call a function in custom.js to handle the parsed value
  handleGasPriceThreshold(gasPriceThreshold);
  // fetch(`http://localhost:3000/send-message`, {
  //   method: "POST",
  // headers: {
  //   "Content-Type": "application/json"
  // },
  //   body: JSON.stringify({ gasPriceThreshold })
  // })
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  //   .catch(error => console.error(error));
});

//Submiting the phonenumber for sending to telegram bot 
document.getElementById("telegramIdForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  telId = document.getElementById("telegramId").value; // Get the value of gasPriceThreshold input field
  fetch(`http://localhost:3000/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ telId, gasPriceThreshold })
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  // Call a function in custom.js to handle the parsed value  console.log(phoneNumber);
  // handlePhoneNumber(phoneNumber);
});
