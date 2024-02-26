const bip39 = require('bip39')
const axios = require('axios')
const { BncClient } = require("@binance-chain/javascript-sdk")

const { hdkey } = require('ethereumjs-wallet');

const BNB_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545/';

const Web3 = require("web3");
const EthereumTx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common');

const web3 = new Web3(new Web3.providers.HttpProvider(BNB_URL));



const generateAddress = (req, res) => {
    try {
        const address = crypto.generatePrivateKey();
        return res.status(200).send({ responseCode: 200, responseMessage: "Address generated successfully.", address: address });
    }
    catch (error) {
        console.log("Error===>>", error)
        return res.status(501).send({ responseCode: 501, responseMessage: "Something went wrong!", error: error })
    }
}

    getCurrentGasPrices = async () => {
      

        let response = await axios.get('https://ethgasstation.info/api/ethgasAPI.json?api-key=ce8da4d2e680dad6465330e7869efe101517aad8274be133e44a8119d5c0');
        let prices = {
            low: response.data.safeLow / 10,
            medium: response.data.average / 10,
            high: response.data.fast / 10
        };
        
        return prices;
    },

    accountBalance = async (senderAddress) => {

        const response = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=balance&address=${senderAddress}&apikey=GQWQPRVJXUI35NTS2VK4J8KEMZCRXJAI4S`)
        console.log(response.data.result);
        let balance = web3.utils.fromWei(response.data.result, "ether");
        return Number(balance)
    },

    preTransfer = async (senderAddress, amountToSend) => {

        const { fee } = await EthHelper()
        let balance = await accountBalance(senderAddress)

        if (balance - amountToSend - fee < 0) {
            console.log('insufficient funds', balance);
            return { status: false, message: 'Low Balance' }

        } else {
            
            return { status: true, message: 'Transfer Possible' }

        }

    },

    EthHelper = async () => {
        let currentGasPrice = await getCurrentGasPrices();

        let gasPrice = currentGasPrice.high * 1000000000

        let gasLimit = 21000;
        let fee = gasLimit * gasPrice;

        let txFee = Number(web3.utils.fromWei(fee.toString(), "ether"));


        return { fee: txFee, gasPrice: gasPrice }
    },




    generateMnemonic = () => {
        try {
            let mnemonic = bip39.generateMnemonic();
            console.log({ responseCode: 200, responseMessage: "Generated.", responseResult: mnemonic });
        } catch (error) {
            console.log({ responseMessage: "Couldn't Generate Wallet", responseResult: error });
        }
    },

    generateBNBWallet = (count, mnemonic) => {
        try {
            
            const seed = bip39.mnemonicToSeedSync(mnemonic)

            let hdwallet = hdkey.fromMasterSeed(seed);
            // console.log('hrlloooo');
            let path = `m/44'/60'/0'/0/${count}`;

            let wallet = hdwallet.derivePath(path).getWallet();
            let address = "0x" + wallet.getAddress().toString("hex");
            let privateKey = wallet.getPrivateKey().toString("hex");
           

            console.log({ responseCode: 200, responseMessage: "Account Created successfully.", Address: address, PrivateKey: privateKey });


        } 
        catch (error) {
            console.log({ responseCode: 501, responseMessage: "Something went wrong!", error: error })

        }

    },
    getBalance = async (senderAddress) => {
        try {
           
            const response = await axios.get(`https://api-testnet.bscscan.com/api?module=account&action=balance&address=${senderAddress}&apikey=GQWQPRVJXUI35NTS2VK4J8KEMZCRXJAI4S`)
            let balance = web3.utils.fromWei(response.data.result);

            console.log({ responseCode: 200, responseMessage: "Balance fetched successfully.", Balance: balance });


        } catch (error) {

            console.log({ responseCode: 501, responseMessage: "Something went wrong!", error: error })

        }
    },




    withdraw = async (senderAddress, privateKey, recieverAddress, amountToSend) => {
        try {
            var nonce = await web3.eth.getTransactionCount(senderAddress);
          

            const { gasPrice } = await EthHelper()

            const { status } = await preTransfer(senderAddress, amountToSend)
            if (status == false) {
                console.log({ status: status, message: 'Low Balance' })
            }


            let txObject = {
                "to": recieverAddress,
                "value": web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether')),
                "gas": 21000,
                "gasPrice": gasPrice,
                "nonce": nonce,
                
            };

            const common = Common.default.forCustomChain(
                'mainnet', {
                name: 'bnb',
                networkId: '0x61',
                chainId: '0x61',
            },
                "petersburg",
            );

            const transaction = new EthereumTx(txObject, { common: common });

            let privKey = Buffer.from(privateKey, 'hex');
            transaction.sign(privKey);

            const serializedTransaction = transaction.serialize();


            const raw = '0x' + Buffer.from(serializedTransaction).toString('hex')
            const signTransaction = await web3.eth.sendSignedTransaction(raw)


            console.log({ responseCode: 200, Status: "Success", Hash: signTransaction.transactionHash });

        } catch (error) {

            console.log({ responseCode: 501, responseMessage: "Something went wrong!", error: error })

        }
    },


    transfer = async (senderAddress, privateKey, recieverAddress) => {
        try {


            var nonce = await web3.eth.getTransactionCount(senderAddress);

            const { fee, gasPrice } = await EthHelper()

            let balance = await accountBalance(senderAddress)

            let amountToSend = balance - fee;
           

            if (amountToSend > 0) {

                let txObject = {
                    "to": recieverAddress,
                    "value": web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether')),
                    "gas": 21000,
                    "gasPrice": gasPrice,
                    "nonce": nonce,
                
                };

                const common = Common.default.forCustomChain(
                    'mainnet', {
                    name: 'bnb',
                    networkId: '0x61',
                    chainId: '0x61',
                },
                    "petersburg",
                );

                const transaction = new EthereumTx(txObject, { common: common });

                let privKey = Buffer.from(privateKey, 'hex');
                

                transaction.sign(privKey);

                const serializedTransaction = transaction.serialize();
                const signTransaction = await web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))

                console.log(signTransaction.transactionHash);

                console.log({ responseCode: 200, Status: "Success", Hash: signTransaction.transactionHash });

            } else {
                console.log('Transfer Possible==>', balance);
                console.log({ status: true, message: 'Transfer Possible' })

            }
        } catch (error) {

            console.log({ responseCode: 501, responseMessage: "Something went wrong!", error: error })

        }
    }

    let senderAddress = '0xd99587b818dEc819230e6162b5cCd1EFc1E66980'
    let privateKey = '9767124ee416c1b5df3c541b8935ba0e1afa5d0a708effd4df9059f1209685d4'
    let recieverAddress = '0x8FEdf399D3Aad3736ef4815a8cc992052c7bECb8'
    let amountToSend = 1000000
// generateMnemonic();
// generateBNBWallet('message maple jump artefact captain canal dash school awesome tiny lemon invite');
// getBalance("0xea6Dfa67d2f34008C178640779aD31b8b651873C");
transfer(senderAddress, recieverAddress, privateKey);
// withdraw(senderAddress, recieverAddress, amountToSend, privateKey);