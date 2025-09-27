import {
  AccountId,
  PrivateKey,
  Client,
  TokenCreateTransaction,
  TokenType,
  PublicKey,
} from "@hashgraph/sdk";

async function main() {
  let client: Client | null = null;
  try {
    // // Custom RPC URL for testnet
    // const RPC_URL = "https://testnet.hashio.io/api";
    
    // Create client for testnet and set custom mirror network
    client = Client.forTestnet();
    
    // Your account ID and private key from provided values
    const MY_ACCOUNT_ID = AccountId.fromString("");
    const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA("");
    
    // Use the public key derived from the private key as the supply key
    const SUPPLY_KEY = MY_PRIVATE_KEY.publicKey;

    // Set the operator with the account ID and private key
    client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

    console.log("Creating token...");

    // Create the transaction and freeze for manual signing
    const txTokenCreate = await new TokenCreateTransaction()
      .setTokenName("AllWeather Finance Equity")
      .setTokenSymbol("AWFEQT")
      .setTokenType(TokenType.FungibleCommon)
      .setSupplyKey(SUPPLY_KEY)
      .setTreasuryAccountId(MY_ACCOUNT_ID)
      .setInitialSupply(5000)
      .freezeWith(client);

    // Sign the transaction with the token treasury account private key
    const signTxTokenCreate = await txTokenCreate.sign(MY_PRIVATE_KEY);

    // Sign the transaction with the client operator private key and submit to a Hedera network
    const txTokenCreateResponse = await signTxTokenCreate.execute(client);

    // Get the receipt of the transaction
    const receiptTokenCreateTx = await txTokenCreateResponse.getReceipt(client);

    // Get the token ID from the receipt
    const tokenId = receiptTokenCreateTx.tokenId;

    // Get the transaction consensus status
    const statusTokenCreateTx = receiptTokenCreateTx.status;

    // Get the Transaction ID
    const txTokenCreateId = txTokenCreateResponse.transactionId.toString();

    console.log("--------------------------------- Token Creation ---------------------------------");
    console.log("Receipt status           :", statusTokenCreateTx.toString());
    console.log("Transaction ID           :", txTokenCreateId);
    console.log("Hashscan URL             :", "https://hashscan.io/testnet/tx/" + txTokenCreateId);
    console.log("Token ID                 :", tokenId?.toString());
    console.log("-------------------------------------------------------------------------------");

  } catch (error) {
    console.error("Error creating token:", error);
  } finally {
    if (client) {
      client.close();
    }
  }
}

// Execute the main function
main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
