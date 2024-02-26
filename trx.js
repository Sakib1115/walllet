const TronWeb=require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "B64FFCE99F4C803A6B3ABA3136192C999FE8C5DA887D5E818375BC1BEEB99A00";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

async function generateWallet() {
    try {
        const wallet = await tronWeb.createAccount();
        console.log({ responseCode: 200, responseMessage: "Wallet generated successfully", responseResult:wallet })
    }
    catch (error) {
        console.log({ responseCode: 501, responseMessage: "something went wrong", responseResult: error })
    }

};
async function Balance(address) {
    try {
        const balances = await tronWeb.trx.getBalance(address);
        console.log('balance===>', balances);
    }
    catch (error) {
        console.log({ responseCode: 501, responseMessage: "Internal Server Error", responseResult: error })
    }

}

async function transfer(){
    try {
        
        
        
    }
     catch (error) {
    console.log({ responseCode: 501, responseMessage: "Internal Server Error", responseResult: error })  
    }
}
// generateWallet()
// Balance("TNDFkUNA2TukukC1Moeqj61pAS53NFchGF") 
transfer()


