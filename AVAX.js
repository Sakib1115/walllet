const web3=require("web3");
const axios = require('axios');
const bip39 = require('bip39');
const ethers = require('ethers');



 async function generateMnemonic(){
    try {
        let mnemonic =await bip39.generateMnemonic();
        console.log({ responseCode: 200, responseMessage: "Generated.", responseResult: mnemonic });
    } catch (error) {
        console.log({ responseMessage: "Couldn't Generate Wallet", responseResult: error });
    }
}



const walletGenerate = (count, mnemonic) => {

    try {       
        let path = `m/44'/60'/0'/0/${count}`;
        let secondMnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, path);
        let address = secondMnemonicWallet.address
        let publicKey = secondMnemonicWallet.publicKey
        let privateKey = secondMnemonicWallet.privateKey
        console.log(`address: ${address} \n privateKey: ${privateKey} \n publicKey: ${publicKey} \n `);
        const obj = {
            'address': address,
            'publicKey': publicKey,
            'privateKey': privateKey.substring(2)
        }
        console.log(obj);
    } catch (error) {
        // console.log(error);
        console.log({ responseMessage: "Couldn't Generate Wallet", responseResult: error });

    }
}



const getbalance = async(address) => {
    try {

        provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
        let userBalance = await provider.getBalance(address);
        userBalance = ethers.utils.formatEther(userBalance)

        console.log({ responseCode: 200, Status: "Success", Balance: userBalance });
    } catch (error) {
        console.log(error);
        console.log({ Status: "Failed", Message: `Internal Server Error`, Error: `${error}` })
    }
}
async function Transfer(toAddress,privateKey,valueToSend){
    try {
        provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
        const wallet = new ethers.Wallet(privateKey);
        const providerWallet = wallet.connect(provider)
        const txObject = {
            to: toAddress,
            gasLimit: 21000, 
            gasPrice: 25000000000,
            value:web3.utils.toHex(web3.utils.toWei(valueToSend.toString(),"ether")),
        }
        console.log(txObject);
        providerWallet.signTransaction(txObject)
        const txHash = await providerWallet.sendTransaction(txObject)
        await txHash.wait()
        console.log("Transfer success");
        return { message: 'Transfer Success', hash: txHash.hash, status: true }
    } catch (error) {
        console.log({responseCode:501,responseMessage:"Internal Server Error",responseResult:error})
        return { message: `Transfer Ether to ${toAddress} Failed`, code: error.code, status: false }
    }
}


const getTxAccepted = async(txid) => {
    const txStatus = await xchain.getTxStatus(txid)
    console.log(txStatus === 'Accepted' ? true : false)
}

const withdrawValidator = async(fromAddress, toAddress, sendAmount, provider) => {
    const givenAmount = ethers.utils.parseEther(sendAmount.toString())

    const userBalance = await provider.getBalance(fromAddress);
    var gasPrice = await fetchGasStationPrice();
    const { txFee, gasAmount } = await transactionFees(fromAddress, toAddress, '0x00', gasPrice, provider) // Calculates tx Fees for sending ether to User
    return { status: userBalance.gte(givenAmount.add(txFee)), value: givenAmount.add(txFee), gasPrice: gasPrice, gasAmount: gasAmount, requiredAmount: givenAmount }
}

const fetchGasStationPrice = async() => {
    const result = await axios.get(`https://ethgasstation.info/api/ethgasAPI.json?api-key=ce8da4d2e680dad6465330e7869efe101517aad8274be133e44a8119d5c0`); // Put this api-key in the service file
    let fast = (result.data.fast) / 10 
    fast = Math.round(fast) 
    console.log(`Current Gas Price ${fast} Gwei`);
    return ethers.utils.parseUnits(fast.toString(), "gwei") 
}

const transactionFees = async(fromAddress, toAddress, data, gasPrice, provider) => {
    try {
        const gasAmount = await provider.estimateGas({
            to: toAddress,
            from: fromAddress,
            data: data,
        });

        var txFee = gasPrice.mul(gasAmount);

        return { txFee, gasAmount }

    } catch (error) {
        console.log('transactionFees Error', error);
        return
    }
}

const transferEther = async(fromPrivKey, toAddress, valueToSend, gasPrice, gasAmount, provider) => {
    try {
        const wallet = new ethers.Wallet(fromPrivKey)
        const providerWallet = wallet.connect(provider)
        const txObject = {
            to: toAddress,
            gasLimit: gasAmount, 
            gasPrice: gasPrice,
            value: valueToSend,
        }
        console.log(txObject);
        providerWallet.signTransaction(txObject)
        const txHash = await providerWallet.sendTransaction(txObject)
        await txHash.wait()
        console.log("success");
        return { message: 'Transfer Success', hash: txHash.hash, status: true }
    } catch (error) {
        console.log(`Transfer Ether to ${toAddress} Failed`, error);
        return { message: `Transfer Ether to ${toAddress} Failed`, code: error.code, status: false }
    }
}



async function withdraw(fromAddress,toAddress,amountToSend,privateKey){

    try {

        provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
        const withdrawValidatorResponse = await withdrawValidator(fromAddress, toAddress,amountToSend,provider);   
        console.log(withdrawValidatorResponse.status);
        if (withdrawValidatorResponse.status == false) {
            console.log({
                Message: `Insufficient funds.`,
                TxCost: ethers.utils.formatEther(withdrawValidatorResponse.value)
            })
        }

        const transferEtherResponse = await transferEther(privateKey, toAddress, withdrawValidatorResponse.requiredAmount, withdrawValidatorResponse.gasPrice, withdrawValidatorResponse.gasAmount, provider)
        if (transferEtherResponse.status == false) {
            console.log({ Message: transferEtherResponse.message, Reason: transferEtherResponse.code });
        }
        console.log({ responseCode: 200, Status: "Success", Message: transferEtherResponse.message });

    } catch (error) {
        console.log({responseCode:501,responseMessage:"Internal Server Error",responseResult:error})

    }

}




let fromAddress = '0xd99587b818dEc819230e6162b5cCd1EFc1E66980'
let privateKey = '9767124ee416c1b5df3c541b8935ba0e1afa5d0a708effd4df9059f1209685d4'
let toAddress = '0x8FEdf399D3Aad3736ef4815a8cc992052c7bECb8'
let valueToSend= 1000000;
// generateMnemonic()
walletGenerate(0,"update ghost upon today original claw position swallow buzz weasel stable exist")
// getbalance("0xd99587b818dEc819230e6162b5cCd1EFc1E66980");
// Transfer(toAddress,privateKey,valueToSend);
// withdraw(fromAddress, toAddress, valueToSend, privateKey);



