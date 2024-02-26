const matic=require('@maticnetwork/maticjs');

async function generateWallet() {
    try {
        const seed = matic.Wallet.generateWallet()
        console.log({ responseCode: 200, responseMessage: "Wallet generated successfully", responseResult: seed })
    }
    catch (error) {
        console.log({ responseCode: 501, responseMessage: "something went wrong", responseResult: error})
    }

}
async function getBalance(address) {
    try {
        const balances = await matic.getBalance(address);
        console.log('balance===>', balances);
    }
    catch (error) {
        console.log({ responseCode: 501, responseMessage: "Internal Server Error", responseResult: error })
    }

}

generateWallet();
// getBalance("0x08fDd83ad7FfEb270BAe56707489A9e57867EF98")
