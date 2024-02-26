const web3 = require('@solana/web3.js')

const connection = new web3.Connection("https://api.testnet.solana.com", "confirmed");

const walletGenerate = async() => {
    try {
        let privateKey = [];
        const wallet = await web3.Keypair.generate();
        privateKey.push(wallet.secretKey.toString());
        console.log("address===>", (wallet.publicKey));
        console.log("address===>", (wallet.publicKey.toString()));
        console.log("pvtKey===>", (privateKey));
        console.log("pvtKey===>", wallet);

    } catch (error) {
        console.log(error);
    }
}


const airdrop = async(address) => {
    const myAddress = new web3.PublicKey(address);
    var airdropSignature = await connection.requestAirdrop(
        myAddress,
        web3.LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(airdropSignature);


    let account = await connection.getAccountInfo(myAddress);
    console.log("====>account=====>", (account));
}



const getBalance = async(address) => {
    const myAddress = new web3.PublicKey(address);
    let account = await connection.getAccountInfo(myAddress);
    console.log("account Balance=====>", (account.lamports / web3.LAMPORTS_PER_SOL), "SOL");
}


const transaction = async(fromaddress, toaddress) => {
    const fromAddress = new web3.PublicKey(fromaddress);
    const toAddress = new web3.PublicKey("DDTkkbpAgVTtL41WJTqnCU12QRLe7sXup6kPPbZ3qgPJ");
    const fromPrivateKey = Uint8Array.from([18, 143, 114, 25, 72, 147, 124, 56, 122, 149, 8, 127, 92, 184, 233, 86, 59, 61, 71, 5, 64, 92, 166, 192, 73, 214, 85, 175, 9, 65, 88, 85, 200, 194, 102, 82, 14, 132, 105, 195, 201, 176, 174, 50, 111, 239, 34, 191, 212, 94, 29, 4, 185, 5, 13, 77, 121, 11, 35, 195, 150, 114, 66, 232]);
    const from = web3.Keypair.fromSecretKey(fromPrivateKey)
    var transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
            fromPubkey: fromAddress,
            toPubkey: toAddress,
            lamports: web3.LAMPORTS_PER_SOL / 100,
        }),
    );
    var signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction, [from],
    );
    console.log('SIGNATURE', signature);
}

const importWallet = () => {
    let secretKey = Uint8Array.from([
        202, 171, 192, 129, 150, 189, 204, 241, 142, 71, 205,
        2, 81, 97, 2, 176, 48, 81, 45, 1, 96, 138,
        220, 132, 231, 131, 120, 77, 66, 40, 97, 172, 91,
        245, 84, 221, 157, 190, 9, 145, 176, 130, 25, 43,
        72, 107, 190, 229, 75, 88, 191, 136, 7, 167, 109,
        91, 170, 164, 186, 15, 142, 36, 12, 23

    ]);

    let keypair = web3.Keypair.fromSecretKey(secretKey);
    console.log(keypair.publicKey.toString());
    console.log(keypair.secretKey.toString());
}

const fromaddress = 'EWgU85u8ixgJatsLSGx64fVF2J7rtbuSTekDLohLN3Pm'
const fromPrivateKey = Uint8Array.from([18, 143, 114, 25, 72, 147, 124, 56, 122, 149, 8, 127, 92, 184, 233, 86, 59, 61, 71, 5, 64, 92, 166, 192, 73, 214, 85, 175, 9, 65, 88, 85, 200, 194, 102, 82, 14, 132, 105, 195, 201, 176, 174, 50, 111, 239, 34, 191, 212, 94, 29, 4, 185, 5, 13, 77, 121, 11, 35, 195, 150, 114, 66, 232]);
const toaddress = 'DDTkkbpAgVTtL41WJTqnCU12QRLe7sXup6kPPbZ3qgPJ'

// walletGenerate()
// getBalance("EWgU85u8ixgJatsLSGx64fVF2J7rtbuSTekDLohLN3Pm")

transaction(fromaddress, fromPrivateKey, toaddress)