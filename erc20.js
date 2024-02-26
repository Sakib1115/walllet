const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/87db931e701045938136ddbb3dc8e3ec"));
const erc20ABI = require("./erc20ABI");
const contract= "0xd0827c8730a802606222913b844C60561cd270da";

const myContract = new web3.eth.Contract(erc20ABI, contract);

async function getBalance(address){
    try {

        var balance = await myContract.methods.balanceOf(address).call()
        
        balance = web3.utils.fromWei(balance)

        console.log("balance=====>", balance);
       
    } catch (error) {
        console.log(error)
            

    }
}

async function transfer(fromAddress, privateKey, toAddress) {
    try {

        var balance = await myContract.methods.balanceOf(fromAddress).call()

        const Data = await myContract.methods.transfer(toAddress, balance.toString()).encodeABI()

        const rawTransaction = {
            to: contract,
            gasPrice: web3.utils.toHex('30000000000'), 
            gasLimit: web3.utils.toHex('200000'), 
            data: Data 
        };


        const signPromise = await web3.eth.accounts.signTransaction(rawTransaction, privateKey);
        
        web3.eth.sendSignedTransaction(signPromise.rawTransaction).then(() => {


            console.log({ responseCode: 200, Status: "Transfer Successful", Hash: signPromise.transactionHash });
           
        }).catch((error) => {

            console.log({ responseCode: 501, responseMessage: "Something went wrong!", error: error });

           
        })

    } catch (error) {
        console.log(error);
       

    }
}

async function withdraw(privateKey,toAddress,amount){
    try {
        const balance = web3.utils.toWei(amount.toString())
        // console.log(balance);
        const Data = await myContract.methods.transfer(toAddress, balance.toString()).encodeABI()
        const rawTransaction = {
            to: contract,
            gasPrice: web3.utils.toHex('30000000000'), // Always in Wei (30 gwei)
            gasLimit: web3.utils.toHex('3000000'), // Always in Wei
            data:Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
        };


        const signPromise = await web3.eth.accounts.signTransaction(rawTransaction, privateKey);
        // console.log("signPromise====>",signPromise);

        web3.eth.sendSignedTransaction(signPromise.rawTransaction).then(() => {


            console.log({ responseCode: 200, Status: "Withdraw successful", Hash: signPromise.transactionHash });
        }).catch((error) => {

            console.log({ responseCode: 501, responseMessage: "Something went wrong!", error: error });

        })

    } catch (error) {
        console.log(error);

    }
}

let fromAddress = '0xd99587b818dEc819230e6162b5cCd1EFc1E66980'
let privateKey = '9767124ee416c1b5df3c541b8935ba0e1afa5d0a708effd4df9059f1209685d4'
let toAddress = '0x8FEdf399D3Aad3736ef4815a8cc992052c7bECb8'
let amount =0.00001;
// getBalance('0xd99587b818dEc819230e6162b5cCd1EFc1E66980')
// transfer(fromAddress, privateKey, toAddress)
withdraw(privateKey,toAddress,amount)
