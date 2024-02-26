// Network Endpoint
// Cardano mainnet https://cardano-mainnet.blockfrost.io/api/v0
// Cardano testnet https://cardano-testnet.blockfrost.io/api/v0
// InterPlanetary File System https://ipfs.blockfrost.io/api/v0
const axios = require("axios").default;

const generateMnemonic = () => {

    var options = {
        method: 'GET',
        url: 'https://api-eu1.tatum.io/v3/ada/wallet',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': '3240eddc-ca09-4f94-8962-424577420983'
        }
    };

    axios.request(options).then(function(response) {
        console.log(response.data);
    }).catch(function(error) {
        console.error(error);
    });
}


const generateWallet = (count, mnemonic) => {
    var options = {
        method: 'POST',
        url: 'https://api-eu1.tatum.io/v3/ada/wallet/priv',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': '3240eddc-ca09-4f94-8962-424577420983'
        },
        data: {
            index: count,
            mnemonic: mnemonic
        }
    };

    axios.request(options).then(function(response) {
        console.log(response.data);
    }).catch(function(error) {
        console.error(error);
    });
}


const generateaddress = (privatekey, count) => {

    var options = {
        method: 'GET',
        url: `https://api-eu1.tatum.io/v3/ada/address/${privatekey}/${count}`,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': '3240eddc-ca09-4f94-8962-424577420983'
        }
    };

    axios.request(options).then(function(response) {
        console.log(response.data);
    }).catch(function(error) {
        console.error(error);
    });
}


const getbalance = (address) => {

    var options = {
        method: 'GET',
        url: `https://api-eu1.tatum.io/v3/ada/account/${address}`,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': '3240eddc-ca09-4f94-8962-424577420983'
        }
    };

    axios.request(options).then(function(response) {
        console.log("balance====>", response.data.summary.assetBalances[0].quantity / 1000000, 'ADA');
    }).catch(function(error) {
        console.error(error);
    });
}




const transfer = (senderAddress, privatekey, recieverAddress, amountToSend) => {

    var options = {
        method: 'POST',
        url: 'https://api-eu1.tatum.io/v3/ada/transaction',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': '3240eddc-ca09-4f94-8962-424577420983'
        },
        data: {
            changeAddress: senderAddress,
            fee: "0.5",
            fromAddress: [{
                address: senderAddress,
                privateKey: privatekey
            }],
            to: [{
                address: recieverAddress,
                value: amountToSend
            }]
        }
    };
    axios.request(options).then(function(response) {
        console.log("balance====>", response.data.summary.assetBalances[0].quantity / 1000000, 'ADA');
    }).catch(function(error) {
        console.error(error);
    });
}

// generateMnemonic()
let count = 0
//  let privatekey='9018e731d6225298a4d6f20eac574bf0d47aef85949e3578e6453030b84a1c50e70ba0cb61dd154497bff17caec12746e7c3ab5c437b6d7cc2f27d3625f3d32ff9e191ce72f544ca2e58aeddc32592f69fcca3b85221988f905e5ce36619660008a90a8abfac569d03fb19585838067263cba02ea8e4bdd0432887af733b3b08';
let privatekey = '611b850cef08004977c6780dfa07bef423523ec4683419bc26d74510b3dc1baadc83cc75e54113cdc73efd5e092722d9e1e165a79cc91dba0f33dc2970bd458b7bb21ddbd15fb3555c4d929c25f64e060b52c3a543c6fb8edfee0ea8e981b663a826861e79400fb80f0fb9eef0a64171490a0a31c73f1a3a95f3efad98a63530'
// generateaddress(privatekey, count)
let senderAddress='addr_test1qrfyeer9kr545xy3jy253x7zrpy53m894fgzlu8lrknemlwzusd0zudf63zzxwh2tz4s26u2pdxa9yfjcnl00fgg7nas8axsyp'



let recieverAddress = 'addr_test1qrjhgvxqtms9jkluee7s9zj7lyetenvjqavt76wlrp0fhlxq8cvh8s2dfdxhl90ra8r3h8m82fljryx8jcnfmg9hyl5qkkjkwp'
// getbalance(address)
 let mnemonic='library chair expect hub salad gallery demise over tomato palace alert often foster prison story draft urban record slab board uphold heavy episode spice'
//  generateWallet(count,mnemonic)
let amountToSend=1000;
transfer(senderAddress,privatekey,recieverAddress,amountToSend)