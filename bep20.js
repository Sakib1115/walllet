var Web3 = require('web3');


const web3 = new Web3(new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545/"))

const bep20ABI = require("./bep20ABI");
const contract="0x893651D3A57b3f369129109CF4Ad86D462C2Ed25";


const myContract = new web3.eth.Contract(bep20ABI,contract)


async function getBalance(address){
    try {

        var balance = await myContract.methods.balanceOf(address).call()

        balance = web3.utils.fromWei(balance)

        console.log("balance=====>", balance);
        
    } catch (error) {
        console.log(error)
            

    }
}

async function transfer(fromAddress,toAddress,privateKey){
    try {
        var balance = await myContract.methods.balanceOf(fromAddress).call()
        const Data = await myContract.methods.transfer(toAddress, balance).encodeABI()
        const rawTransaction = {
            to: contract,
            gasPrice: web3.utils.toHex('30000000000'), 
            gasLimit: web3.utils.toHex('3000000'), 
            data: Data 
        };


        const signPromise = await web3.eth.accounts.signTransaction(rawTransaction, privateKey);
        // console.log("signPromise====>",signPromise);

        web3.eth.sendSignedTransaction(signPromise.rawTransaction).then(() => {


            console.log({ responseCode: 200, Status: "Transfer successful", Hash: signPromise.transactionHash });
        }).catch((error) => {

            console.log({ responseCode: 501, responseMessage: "Something went wrong!", error: error });

        })

    } catch (error) {
        console.log(error);

    }
}

async function withdraw (privateKey,toAddress,amount){
    try {
        const balance = web3.utils.toWei(amount.toString())
        // console.log(balance);

        const Data = await myContract.methods.transfer(toAddress, balance.toString()).encodeABI()

        const rawTransaction = {
            to: contract,
            gasPrice: web3.utils.toHex('30000000000'), // Always in Wei (30 gwei)
            gasLimit: web3.utils.toHex('3000000'), // Always in Wei
            data:Data,
        };


        const signPromise = await web3.eth.accounts.signTransaction(rawTransaction, privateKey);
        // console.log("signPromise====>",signPromise);

        web3.eth.sendSignedTransaction(signPromise.rawTransaction).then(() => {


            console.log({ responseCode: 200, Status: "Withdraw successful", Hash: signPromise.transactionHash });
        }).catch((error) => {

            console.log({responseCode: 501, responseMessage: "Something went wrong", error: error });

        })

    } catch (error) {
        console.log(error);

    }
}

let fromAddress = '0x8FEdf399D3Aad3736ef4815a8cc992052c7bECb8'
let privateKey = '796ec1292a19dce4f0d8e921efb15e07861c05882552d86121670d0d75d55965'
let toAddress = '0xd99587b818dEc819230e6162b5cCd1EFc1E66980'
let amountToSend =0.00001
// getBalance("0xd99587b818dEc819230e6162b5cCd1EFc1E66980");
withdraw(privateKey,toAddress,amountToSend);
// transfer(fromAddress,toAddress,privateKey);