import config from "./config.js ";

// Define the audio element and load the sound file
const alertSound = new Audio(`inalert.mp3`);
alertSound.volume = 1; // Set volume to 1 (100%)


let lastProposeGasPrice = 0;
let lastFastGasPrice = 0;
let gasPriceThreshold = 200;
let phoneNumber = 0;
const TEL_API_KEY = config.TEL_API_KEY;
const TelegramBot = require('node-telegram-bot-api');

// Create a new instance of the TelegramBot with your API token
const bot = new TelegramBot(TEL_API_KEY, { polling: true });

// Function to send a message to a phone number
function sendTelegramMessage(phoneNumber, message) {
  // Format the phone number with the country code
  const formattedPhoneNumber = `+${phoneNumber}`;

  // Send the message to the phone number
  bot.sendMessage(formattedPhoneNumber, message)
    .then(() => {
      console.log(`Message sent to ${formattedPhoneNumber}: ${message}`);
    })
    .catch((error) => {
      console.error(`Failed to send message to ${formattedPhoneNumber}: ${error}`);
    });
}

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
});

//Submiting the phonenumber for sending to telegram bot 
document.getElementById("phoneNumberForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  phoneNumber = document.getElementById("phoneNumber").value; // Get the value of gasPriceThreshold input field
  sendTelegramMessage(phoneNumber, "Current gas price is hit"); // Send a message to the phone number

  // Call a function in custom.js to handle the parsed value  console.log(phoneNumber);
  // handlePhoneNumber(phoneNumber);
});
