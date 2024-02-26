const axios = require('axios');
const generateWallet = async() => {
    var config = {
        method: 'post',
        url: 'https://api.cryptoapis.io/v1/bc/btc/testnet/address',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': '47fbd8fdd45c8dd9d6d38201d58118692c9f5e48'
        }
    };

    axios(config)
        .then(function(response) {
            console.log(JSON.stringify(response.data));
            console.log({ responseCode: 200, responseMessage: "Address generated successfully.", address: response.data.payload.address, privateKey: response.data.payload.privateKey, wif: response.data.payload.wif });

        })
        .catch(function(error) {
            console.log(error.responce.data);
            console.log({ responseCode: 501, responseMessage: "Something went wrong!", error: error.responce.data })


        });
}



const getBalance = async(address) => {
    try {
        var config = {
            method: 'get',
            url: `https://api.cryptoapis.io/v1/bc/btc/testnet/address/${address}`,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': '47fbd8fdd45c8dd9d6d38201d58118692c9f5e48'
            }
        };
        const datas = await axios(config);

        console.log(datas.data.payload);
        console.log(datas.data.payload.balance);
        console.log({ responseCode: 200, responseMessage: "balance Fetch Successfully", address: datas.data.payload.address, balance: datas.data.payload.balance, totalSpent: datas.data.payload.totalSpent, totalReceived: datas.data.payload.totalReceived });

    } catch (error) {
        console.log(error);
        console.log({ responseCode: 501, responseMessage: "Something went wrong!", error: error })

    }


}



const withdraw = (req, res) => {
    const senderAddress = "";
    const senderWifs = "";
    const recieverAddress = "";
    const balance = "";

    var data = JSON.stringify({
        "createTx": {
            "inputs": [{
                "address": `${senderAddress}`,
                "value": balance
            }],
            "outputs": [{
                "address": `${recieverAddress}`,
                "value": balance
            }],

            "fee": {
                "value": 0.00023141
            }
        },
        "wifs": [
            `${senderWifs}`
        ]
    });

    var config = {
        method: 'post',
        url: 'https://api.cryptoapis.io/v1/bc/btc/testnet/txs/new',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': '47fbd8fdd45c8dd9d6d38201d58118692c9f5e48'
        },
        data: data
    };

    axios(config)
        .then(function(response) {
            console.log(JSON.stringify(response.data));
            console.log({ responseCode: 200, responseMessage: "balance Fetch Successfully", txid: response.data.payload.txid });

        })
        .catch(function(error) {
            console.log(error);
            console.log({ responseCode: 501, responseMessage: "Something went wrong!", error: error })

        });
}



const transfer = async(req, res) => {
    const senderAddress = "";
    const senderWifs = "";
    const recieverAddress = "";


    var config = {
        method: 'get',
        url: `https://api.cryptoapis.io/v1/bc/btc/testnet/address/${senderAddress}`,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': '47fbd8fdd45c8dd9d6d38201d58118692c9f5e48'
        }
    };
    const datas = await axios(config);

    

    const balance = Number(datas.data.payload.balance) - 0.00023141


    var data = JSON.stringify({
        "createTx": {
            "inputs": [{
                "address": `${senderAddress}`,
                "value": balance
            }],
            "outputs": [{
                "address": `${recieverAddress}`,
                "value": balance
            }],

            "fee": {
                "value": 0.00023141
            }
        },
        "wifs": [
            `${senderWifs}`
        ]
    });

    var config = {
        method: 'post',
        url: 'https://api.cryptoapis.io/v1/bc/btc/testnet/txs/new',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': '47fbd8fdd45c8dd9d6d38201d58118692c9f5e48'
        },
        data: data
    };

    axios(config)
        .then(function(response) {
            console.log(JSON.stringify(response.data));
            console.log({ responseCode: 200, responseMessage: "balance Fetch Successfully", txid: response.data.payload.txid });

        })
        .catch(function(error) {
            console.log(error.response);
            console.log({ responseCode: 501, responseMessage: "Something went wrong!", error: error.response.data })

        });


}
let senderAddress="mgqnncNXy5XoHoZtGs4RL7uivvUKiCcKL6";
//  generateWallet();
getBalance(senderAddress);                       
 // withdraw(senderAddress, recieverAddress, amountToSend, privateKey);
// transfer(senderAddress, recieverAddress, privateKey);