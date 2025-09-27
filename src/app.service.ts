import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  AccountId,
  PrivateKey,
  Client,
  TokenMintTransaction,
  TransferTransaction,
  TokenId,
} from '@hashgraph/sdk';

export class CheckMintRequest {
  @ApiProperty({ 
    description: 'Ethereum wallet address of the user', 
    example: '0x1234567890123456789012345678901234567890' 
  })
  userWalletAddress: string;

  @ApiProperty({ 
    description: 'Amount of HBAR to invest', 
    example: 1000 
  })
  amountHbar: number;

  @ApiProperty({ 
    description: 'Price of HBAR in USD', 
    example: 0.06 
  })
  priceHbar: number;

  @ApiProperty({ 
    description: 'Price of equity token in USD', 
    example: 1.2 
  })
  priceEquity: number;

  @ApiProperty({ 
    description: 'Price of bonds token in USD', 
    example: 1.0 
  })
  priceBonds: number;

  @ApiProperty({ 
    description: 'Price of gold token in USD', 
    example: 2.5 
  })
  priceGold: number;

  @ApiProperty({ 
    description: 'Weight allocation for equity (as decimal)', 
    example: 0.6 
  })
  weightEquity: number;

  @ApiProperty({ 
    description: 'Weight allocation for gold (as decimal)', 
    example: 0.2 
  })
  weightGold: number;

  @ApiProperty({ 
    description: 'Weight allocation for bonds (as decimal)', 
    example: 0.2 
  })
  weightBonds: number;
}

export class CheckMintResponse {
  @ApiProperty({ 
    description: 'Ethereum wallet address of the user', 
    example: '0x1234567890123456789012345678901234567890' 
  })
  userWalletAddress: string;

  @ApiProperty({ 
    description: 'Total investment amount in USD', 
    example: 60 
  })
  totalInvestmentUsd: number;

  @ApiProperty({
    description: 'Asset allocations in USD',
    type: 'object',
    properties: {
      equity: { type: 'number', example: 36 },
      gold: { type: 'number', example: 12 },
      bonds: { type: 'number', example: 12 }
    }
  })
  allocations: {
    equity: number;
    gold: number;
    bonds: number;
  };

  @ApiProperty({
    description: 'Number of tokens to mint for each asset',
    type: 'object',
    properties: {
      equity: { type: 'number', example: 30 },
      gold: { type: 'number', example: 4.8 },
      bonds: { type: 'number', example: 12 }
    }
  })
  tokensToMint: {
    equity: number;
    gold: number;
    bonds: number;
  };

  @ApiProperty({
    description: 'Transaction details for minting and transfers',
    type: 'object',
    properties: {
      equity: {
        type: 'object',
        properties: {
          mintTxId: { type: 'string' },
          transferTxId: { type: 'string' },
          hashscanMintUrl: { type: 'string' },
          hashscanTransferUrl: { type: 'string' }
        }
      },
      gold: {
        type: 'object',
        properties: {
          mintTxId: { type: 'string' },
          transferTxId: { type: 'string' },
          hashscanMintUrl: { type: 'string' },
          hashscanTransferUrl: { type: 'string' }
        }
      },
      bonds: {
        type: 'object',
        properties: {
          mintTxId: { type: 'string' },
          transferTxId: { type: 'string' },
          hashscanMintUrl: { type: 'string' },
          hashscanTransferUrl: { type: 'string' }
        }
      }
    }
  })
  transactions?: {
    equity: {
      mintTxId: string;
      transferTxId: string;
      hashscanMintUrl: string;
      hashscanTransferUrl: string;
    };
    gold: {
      mintTxId: string;
      transferTxId: string;
      hashscanMintUrl: string;
      hashscanTransferUrl: string;
    };
    bonds: {
      mintTxId: string;
      transferTxId: string;
      hashscanMintUrl: string;
      hashscanTransferUrl: string;
    };
  };
}

@Injectable()
export class AppService {
  // Hedera configuration - using hardcoded values for now, but should use environment variables in production
  private readonly MY_ACCOUNT_ID = AccountId.fromString("0.0.6914821");
  private readonly MY_PRIVATE_KEY = PrivateKey.fromStringECDSA("2fa739a2ceb096287d555034ce6c6f9e5fe46b6f8872a473b70cccffcff338a0");
  
  // Token IDs for different assets - Updated with actual token IDs
  private readonly EQUITY_TOKEN_ID = TokenId.fromString("0.0.6915966");
  private readonly GOLD_TOKEN_ID = TokenId.fromString("0.0.6915961");
  private readonly BONDS_TOKEN_ID = TokenId.fromString("0.0.6915965");

  private createHederaClient(): Client {
    const client = Client.forTestnet();
    client.setOperator(this.MY_ACCOUNT_ID, this.MY_PRIVATE_KEY);
    return client;
  }

  private async mintAndTransferTokens(
    tokenId: TokenId,
    amount: number,
    receiverAccountId: AccountId,
    client: Client
  ): Promise<{ mintTxId: string; transferTxId: string; hashscanMintUrl: string; hashscanTransferUrl: string }> {
    try {
      const mintAmount = amount;

      // Mint tokens
      const txTokenMint = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(mintAmount)
        .freezeWith(client);

      // Sign with the supply private key (using the same key as operator for simplicity)
      const signTxTokenMint = await txTokenMint.sign(this.MY_PRIVATE_KEY);

      // Submit the mint transaction
      const txTokenMintResponse = await signTxTokenMint.execute(client);
      const receiptTokenMintTx = await txTokenMintResponse.getReceipt(client);
      const mintTxId = txTokenMintResponse.transactionId.toString();

      console.log(`Token mint successful. TX ID: ${mintTxId}`);

      // Transfer tokens to user
      const txTransfer = await new TransferTransaction()
        .addTokenTransfer(tokenId, this.MY_ACCOUNT_ID, -mintAmount)
        .addTokenTransfer(tokenId, receiverAccountId, mintAmount)
        .freezeWith(client);

      // Sign with the sender account private key
      const signTxTransfer = await txTransfer.sign(this.MY_PRIVATE_KEY);

      // Submit the transfer transaction
      const txTransferResponse = await signTxTransfer.execute(client);
      const receiptTransferTx = await txTransferResponse.getReceipt(client);
      const transferTxId = txTransferResponse.transactionId.toString();

      console.log(`Token transfer successful. TX ID: ${transferTxId}`);

      return {
        mintTxId,
        transferTxId,
        hashscanMintUrl: `https://hashscan.io/testnet/tx/${mintTxId}`,
        hashscanTransferUrl: `https://hashscan.io/testnet/tx/${transferTxId}`
      };

    } catch (error) {
      console.error(`Error minting/transferring tokens for ${tokenId.toString()}:`, error);
      throw error;
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async checkMint(request: CheckMintRequest): Promise<CheckMintResponse> {
    const {
      userWalletAddress,
      amountHbar,
      priceHbar,
      priceEquity,
      priceBonds,
      priceGold,
      weightEquity,
      weightGold,
      weightBonds
    } = request;

    // Calculate total investment in USD
    const totalInvestmentUsd = priceHbar * amountHbar;
    console.log(`Total investment USD: ${totalInvestmentUsd}`);

    // Calculate allocations based on weights
    const equityAllocation = totalInvestmentUsd * weightEquity;
    const goldAllocation = totalInvestmentUsd * weightGold;
    const bondsAllocation = totalInvestmentUsd * weightBonds;
    
    console.log(`Equity allocation: ${equityAllocation}`);
    console.log(`Gold allocation: ${goldAllocation}`);
    console.log(`Bonds allocation: ${bondsAllocation}`);

    // Calculate tokens to mint for each asset
    const equityTokensToMint = equityAllocation / priceEquity;
    const goldTokensToMint = goldAllocation / priceGold;
    const bondsTokensToMint = bondsAllocation / priceBonds;

    console.log(`Equity tokens to mint: ${equityTokensToMint}`);
    console.log(`Gold tokens to mint: ${goldTokensToMint}`);
    console.log(`Bonds tokens to mint: ${bondsTokensToMint}`);

    // Convert user wallet address to Hedera Account ID
    // Note: This assumes the userWalletAddress is already a Hedera Account ID format (0.0.xxxxx)
    // If it's an Ethereum address, you'll need to convert it appropriately
    let receiverAccountId: AccountId;
    try {
      receiverAccountId = AccountId.fromString(userWalletAddress);
    } catch (error) {
      console.error('Invalid account ID format:', userWalletAddress);
      throw new Error(`Invalid account ID format: ${userWalletAddress}. Expected format: 0.0.xxxxx`);
    }

    // Create Hedera client
    const client = this.createHederaClient();
    
    let transactions;
    try {
      // Mint and transfer tokens for each asset in parallel
      const [equityTx, goldTx, bondsTx] = await Promise.all([
        this.mintAndTransferTokens(this.EQUITY_TOKEN_ID, equityTokensToMint, receiverAccountId, client),
        this.mintAndTransferTokens(this.GOLD_TOKEN_ID, goldTokensToMint, receiverAccountId, client),
        this.mintAndTransferTokens(this.BONDS_TOKEN_ID, bondsTokensToMint, receiverAccountId, client)
      ]);

      transactions = {
        equity: equityTx,
        gold: goldTx,
        bonds: bondsTx
      };

      console.log('All token minting and transfers completed successfully');

    } catch (error) {
      console.error('Error during token minting/transfer process:', error);
      throw error;
    } finally {
      // Close the client connection
      client.close();
    }

    const response: CheckMintResponse = {
      userWalletAddress,
      totalInvestmentUsd,
      allocations: {
        equity: equityAllocation,
        gold: goldAllocation,
        bonds: bondsAllocation,
      },
      tokensToMint: {
        equity: equityTokensToMint,
        gold: goldTokensToMint,
        bonds: bondsTokensToMint,
      },
      transactions,
    };

    console.log('Check mint response:', JSON.stringify(response, null, 2));

    return response;
  }
}
