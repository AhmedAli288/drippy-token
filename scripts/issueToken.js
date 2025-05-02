const xrpl = require("xrpl");
const fs = require("fs");

(async () => {
  const client = new xrpl.Client("https://s.altnet.rippletest.net:51234");
  await client.connect();
  const issuerWallet = xrpl.Wallet.fromSeed(JSON.parse(fs.readFileSync("accounts/issuer.json")).seed);
  const tx = {
    TransactionType: "Payment",
    Account: issuerWallet.classicAddress,
    Amount: "1000000000000000", // Total in drops (adjust based on decimals)
    Destination: issuerWallet.classicAddress,
    Flags: 0x80000000
  };
  const prepared = await client.autofill(tx);
  const signed = issuerWallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  console.log("Token Issuance Result:", result);
  await client.disconnect();
})();