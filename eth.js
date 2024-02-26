const ethers=require("ethers");
const axios = require('axios');
const bip39=require("bip39");
const web3=require("web3");

async function generateMnemonic(){
    try{
        let mnemonic= await bip39.generateMnemonic()
        console.log({responseCode:200,responseMessage:"Mnemonickey generated successfully",responseResult:mnemonic})


    }
    catch(error){
        console.log({responseCode:501,responseMessage:"something went wrong",responseResult:error})


    }

}
// generateMnemonic();

async function generateWallet(mnemonic){
    try{
        let path = `m/44'/60'/0'/0/1`;
        let secondMnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, path);
        let address = secondMnemonicWallet.address
        let publicKey = secondMnemonicWallet.publicKey
        let privateKey = secondMnemonicWallet.privateKey
        // console.log(`address: ${address} \n privateKey: ${privateKey} \n publicKey: ${publicKey} \n `);
        const obj = {
            'address': address,
            'publicKey': publicKey,
            'privateKey': privateKey
        }
        console.log(obj);

    }
    catch(error){
        console.log({responseCode:501,responseMessage:"Internal Server Error",responseResult:error})


    }

}


async function Balance(address) {
    try {
        provider = new ethers.providers.JsonRpcProvider('https://kovan.infura.io/v3/87db931e701045938136ddbb3dc8e3ec');
        let userBalance = await provider.getBalance(address);
        userBalance = ethers.utils.formatEther(userBalance)
        console.log({responseCode: 200, responseMessage: "Success",responseResult: userBalance });
        
    } catch (error) {
        console.log({responseCode:501,responseMessage:"Internal Server Error",responseResult:error})

        
    }
    
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



async function Withdraw(fromAddress,toAddress,amountToSend){

    try {

        provider = new ethers.providers.JsonRpcProvider('https://kovan.infura.io/v3/87db931e701045938136ddbb3dc8e3ec');
        const fromPrivateKey = '9767124ee416c1b5df3c541b8935ba0e1afa5d0a708effd4df9059f1209685d4';
        const withdrawValidatorResponse = await withdrawValidator(fromAddress, toAddress,amountToSend,provider);
           
        console.log(withdrawValidatorResponse.status);
        if (withdrawValidatorResponse.status == false) {
            console.log({
                Message: `Insufficient funds.`,
                TxCost: ethers.utils.formatEther(withdrawValidatorResponse.value)
            })
        }

        const transferEtherResponse = await transferEther(fromPrivateKey, toAddress, withdrawValidatorResponse.requiredAmount, withdrawValidatorResponse.gasPrice, withdrawValidatorResponse.gasAmount, provider)
        if (transferEtherResponse.status == false) {
            console.log({ Message: transferEtherResponse.message, Reason: transferEtherResponse.code });
        }
        console.log({ responseCode: 200, Status: "Success", Message: transferEtherResponse.message });

    } catch (error) {
        console.log({responseCode:501,responseMessage:"Internal Server Error",responseResult:error})

    }

}

async function Transfer(toAddress, valueToSend){
    try {
        provider = new ethers.providers.JsonRpcProvider('https://kovan.infura.io/v3/87db931e701045938136ddbb3dc8e3ec');
        const fromPrivetKey = '9767124ee416c1b5df3c541b8935ba0e1afa5d0a708effd4df9059f1209685d4';
        const wallet = new ethers.Wallet(fromPrivetKey);
        const providerWallet = wallet.connect(provider)
        const txObject = {
            to: toAddress,
            gasLimit: 21000, 
            gasPrice: 20000000000,
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

let mnemonic= 'coast rapid museum swarm stove deal heavy party exchange cupboard airport copper'
let fromAddress = '0xd99587b818dEc819230e6162b5cCd1EFc1E66980';
let toAddress = '0x8FEdf399D3Aad3736ef4815a8cc992052c7bECb8';
let amountToSend = 0.01;
// generateMnemonic();
 generateWallet(mnemonic);
//Balance ("0xd99587b81Balance8dEc819230e6162b5cCd1EFc1E66980");
// Withdraw(fromAddress,toAddress,amountToSend);
// Transfer(toAddress,amountToSend);





