const xrpl = require('xrpl');
// const RippleAPI = require('ripple-lib').RippleAPI;
const wallet = xrpl.Wallet.fromSeed("sEd7CYpwtk9EQ9jUJMVwwJYWsBJ4XBj")
// const api = new RippleAPI({ server: 'wss://s.altnet.rippletest.net:51233',});
const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");





async function generateWallet() {
    try {
        const seed = xrpl.Wallet.generate()
        console.log({ responseCode: 200, responseMessage: "Wallet generated successfully", responseResult: seed })
    }
    catch (error) {
        console.log({ responseCode: 501, responseMessage: "something went wrong", responseResult: error })
    }

};
async function Balance(address) {
    try {
        await client.connect();
        const balances = await client.getBalances(address);
        console.log('balances', balances);
    }
    catch (error) {
        console.log({ responseCode: 501, responseMessage: "Internal Server Error", responseResult: error })

    }
    client.disconnect();

}
async function transfer() {
    try {
        await client.connect();
        const prepared = await client.autofill({
            "TransactionType": "Payment",
            "Account": "XVjKs2ae5EgCyKL4oPoNo7RoeBKFCbndk8gq6W6n93WeYZG",      //wallet.address,
            "Amount": xrpl.xrpToDrops("1"),
            "Destination": "rnBTkzHAH1KSAwwVfS35VwNKEHZXoPMsRs"
        })
        const max_ledger = prepared.LastLedgerSequence
        console.log("Prepared transaction instructions:", prepared)
        console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
        console.log("Transaction expires after ledger:", max_ledger)
        const signed = wallet.sign(prepared)
        console.log("Identifying hash:", signed.hash)
        console.log("Signed blob:", signed.tx_blob)
        const tx = await client.submitAndWait(signed.tx_blob)
        console.log("Transaction result:", tx.result.meta.TransactionResult)
        console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

    } catch (error) {
        console.log({ responseCode: 501, responseMessage: "Internal Server Error", responseResult: error })


    }
    client.disconnect();

}
// generateWallet()
// Balance('rnBTkzHAH1KSAwwVfS35VwNKEHZXoPMsRs')
transfer()


