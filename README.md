# 🚀 Polygon Gas Tracker Alert Messenger

This project is a simple gas tracker alert messenger for the Polygon network, which sends a Telegram message when the gas price exceeds a certain threshold. It is built using JavaScript and the [Polygon Gas Tracker API](https://polygonscan.com/apis#gas-tracking-api).

## 💻 Installation

To run this project, you need to have Node.js installed on your computer. Clone this repository and install the dependencies by running the following commands:

```bash
git clone https://github.com/<your-username>/polygon-gas-tracker-alert-messenger.git
cd polygon-gas-tracker-alert-messenger
npm install
```

You also need to create a `config.js` file with your Telegram bot token and chat ID, like so:

```javascript
module.exports = {
  telegramBotToken: 'YOUR_TELEGRAM_BOT_TOKEN_HERE',
  telegramChatId: 'YOUR_TELEGRAM_CHAT_ID_HERE',
};
```

## 🚀 Usage

To start the gas tracker alert messenger, simply run the following command:

```bash
npm start
```

The program will run continuously and check the gas price every 5 seconds. If the gas price exceeds the threshold (default is 200), it will send a message to your Telegram chat with the current gas price.

## 📝 Contributing

Contributions are welcome! If you find a bug or want to add a feature, feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the [GNU General Public License](https://github.com/ColaborateBC/polygon-gas-tracker-alert/blob/main/LICENSE).

---

Have fun with your Polygon Gas Tracker Alert Messenger! 🎉
