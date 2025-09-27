import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import OpenAI from 'openai';
import {
  AccountId,
  PrivateKey,
  Client,
  TokenMintTransaction,
  TransferTransaction,
  TokenId,
  AccountBalanceQuery,
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

export class GetPortfolioRequest {
  @ApiProperty({ 
    description: 'User wallet address (Hedera Account ID)', 
    example: '0.0.1234567' 
  })
  userWallet: string;

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
}

export class GetPortfolioResponse {
  @ApiProperty({ 
    description: 'User wallet address', 
    example: '0.0.1234567' 
  })
  userWallet: string;

  @ApiProperty({
    description: 'Token balances',
    type: 'object',
    properties: {
      equity: { type: 'number', example: 30 },
      gold: { type: 'number', example: 4.8 },
      bonds: { type: 'number', example: 12 }
    }
  })
  balances: {
    equity: number;
    gold: number;
    bonds: number;
  };

  @ApiProperty({
    description: 'Asset values in USD',
    type: 'object',
    properties: {
      equity: { type: 'number', example: 36 },
      gold: { type: 'number', example: 12 },
      bonds: { type: 'number', example: 12 }
    }
  })
  values: {
    equity: number;
    gold: number;
    bonds: number;
  };

  @ApiProperty({ 
    description: 'Total portfolio value in USD', 
    example: 60 
  })
  totalValue: number;

  @ApiProperty({
    description: 'Portfolio weights (as decimals)',
    type: 'object',
    properties: {
      equity: { type: 'number', example: 0.6 },
      gold: { type: 'number', example: 0.2 },
      bonds: { type: 'number', example: 0.2 }
    }
  })
  weights: {
    equity: number;
    gold: number;
    bonds: number;
  };
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

export class RebalanceCheckRequest {
  @ApiProperty({ 
    description: 'User wallet address', 
    example: '0x1234567890123456789012345678901234567890' 
  })
  userWallet: string;

  @ApiProperty({ 
    description: 'Current balance of equity tokens', 
    example: 24 
  })
  balanceOfEquity: number;

  @ApiProperty({ 
    description: 'Current balance of gold tokens', 
    example: 103 
  })
  balanceOfGold: number;

  @ApiProperty({ 
    description: 'Current balance of bonds tokens', 
    example: 46 
  })
  balanceOfBonds: number;

  @ApiProperty({ 
    description: 'Current price of equity token in USD', 
    example: 600 
  })
  priceOfEquity: number;

  @ApiProperty({ 
    description: 'Current price of gold token in USD', 
    example: 50 
  })
  priceOfGold: number;

  @ApiProperty({ 
    description: 'Current price of bonds token in USD', 
    example: 100 
  })
  priceOfBonds: number;

  @ApiProperty({ 
    description: 'Current weight of equity in portfolio', 
    example: 0.6 
  })
  currentWeightEquity: number;

  @ApiProperty({ 
    description: 'Current weight of gold in portfolio', 
    example: 0.2 
  })
  currentWeightGold: number;

  @ApiProperty({ 
    description: 'Current weight of bonds in portfolio', 
    example: 0.2 
  })
  currentWeightBonds: number;

  @ApiProperty({ 
    description: 'Target weight of equity in portfolio', 
    example: 0.5 
  })
  targetWeightEquity: number;

  @ApiProperty({ 
    description: 'Target weight of gold in portfolio', 
    example: 0.1 
  })
  targetWeightGold: number;

  @ApiProperty({ 
    description: 'Target weight of bonds in portfolio', 
    example: 0.4 
  })
  targetWeightBonds: number;
}

export class RebalanceCheckResponse {
  @ApiProperty({ 
    description: 'User wallet address', 
    example: '0x1234567890123456789012345678901234567890' 
  })
  userWallet: string;

  @ApiProperty({
    description: 'Rebalance plan with tokens to mint and burn',
    type: 'object',
    properties: {
      mint: {
        type: 'object',
        properties: {
          equity: { type: 'number', example: 10 },
          gold: { type: 'number', example: 0 },
          bonds: { type: 'number', example: 50 }
        }
      },
      burn: {
        type: 'object',
        properties: {
          equity: { type: 'number', example: 0 },
          gold: { type: 'number', example: 20 },
          bonds: { type: 'number', example: 0 }
        }
      }
    }
  })
  rebalancePlan: {
    mint: {
      equity: number;
      gold: number;
      bonds: number;
    };
    burn: {
      equity: number;
      gold: number;
      bonds: number;
    };
  };

  @ApiProperty({ 
    description: 'Detailed explanation of the rebalancing calculations', 
    example: 'Based on the current portfolio allocation and target weights, the following adjustments are needed...' 
  })
  explanation: string;
}

@Injectable()
export class AppService {
  // Hedera configuration - using hardcoded values for now, but should use environment variables in production
  private readonly MY_ACCOUNT_ID = AccountId.fromString("0.0.6914821");
  private readonly MY_PRIVATE_KEY = PrivateKey.fromStringECDSA("");
  
  // Token IDs for different assets - Updated with actual token IDs
  private readonly EQUITY_TOKEN_ID = TokenId.fromString("0.0.6915966");
  private readonly GOLD_TOKEN_ID = TokenId.fromString("0.0.6915961");
  private readonly BONDS_TOKEN_ID = TokenId.fromString("0.0.6915965");

  // OpenAI configuration
  private readonly openai = new OpenAI({
    apiKey: '',
  });

  private readonly REBALANCE_PROMPT = `You are a portfolio rebalancing assistant for an RWA (Real World Assets) platform.  
Your task is to calculate how many tokens of each asset (equity, gold, bonds) must be minted or burned in order to rebalance the user's portfolio according to their new target weights.

### Input Data
User Wallet: {{userWallet}}
Current Balances (tokens):
{{balancesofTokens}}

Asset Prices (USD):
{{PriceOfAssets}}

Current Total Value (USD): {{totalValueUsd}}

Target Weights:
{{targetWeights}}

### Instructions
1. Calculate the current USD value of each asset = balance * price.
2. Calculate the target USD value for each asset = total portfolio value * target weight.
3. Compare current vs. target values to determine if tokens should be minted (if target > current) or burned (if target < current).
4. Convert the USD difference into token amounts using the asset price.
5. Return ONLY a valid JSON object with this exact structure (no explanations or additional text):
{
  "rebalancePlan": {
    "mint": {
      "equity": <tokens to mint>,
      "gold": <tokens to mint>,
      "bonds": <tokens to mint>
    },
    "burn": {
      "equity": <tokens to burn>,
      "gold": <tokens to burn>,
      "bonds": <tokens to burn>
    }
  },
  "explanation": "<brief explanation of the calculations step by step a) calcualtion of current values b) calculation of target values c) calculation of tokens to mint/burn make sure use new line to separate steps>"
}`;

  getHello(): string {
    return 'Hello World!';
  }

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

  async getPortfolio(request: GetPortfolioRequest): Promise<GetPortfolioResponse> {
    const {
      userWallet,
      priceEquity,
      priceBonds,
      priceGold
    } = request;

    console.log(`Getting portfolio for user: ${userWallet}`);

    // Convert user wallet to Hedera Account ID
    let userAccountId: AccountId;
    try {
      userAccountId = AccountId.fromString(userWallet);
    } catch (error) {
      console.error('Invalid account ID format:', userWallet);
      throw new Error(`Invalid account ID format: ${userWallet}. Expected format: 0.0.xxxxx`);
    }

    // Create Hedera client
    const client = this.createHederaClient();
    
    try {
      // Query account balance for the user
      const query = new AccountBalanceQuery()
        .setAccountId(userAccountId);

      const balance = await query.execute(client);
      
      // Extract token balances - handle null tokens map
      const tokensMap = balance.tokens || new Map();
      const equityBalance = tokensMap.get(this.EQUITY_TOKEN_ID) || 0;
      const goldBalance = tokensMap.get(this.GOLD_TOKEN_ID) || 0;
      const bondsBalance = tokensMap.get(this.BONDS_TOKEN_ID) || 0;

      console.log(`Token balances - Equity: ${equityBalance}, Gold: ${goldBalance}, Bonds: ${bondsBalance}`);

      // Convert balances from smallest unit to actual tokens
      // Note: Hedera token balances are returned in the smallest unit (like wei for ETH)
      // Assuming your tokens have 0 decimals, so no conversion needed
      const equityTokens = Number(equityBalance);
      const goldTokens = Number(goldBalance);
      const bondsTokens = Number(bondsBalance);

      // Calculate values in USD
      const equityValue = equityTokens * priceEquity;
      const goldValue = goldTokens * priceGold;
      const bondsValue = bondsTokens * priceBonds;
      const totalValue = equityValue + goldValue + bondsValue;

      console.log(`Values - Equity: $${equityValue}, Gold: $${goldValue}, Bonds: $${bondsValue}, Total: $${totalValue}`);

      // Calculate weights
      let weights = { equity: 0, gold: 0, bonds: 0 };
      if (totalValue > 0) {
        weights = {
          equity: equityValue / totalValue,
          gold: goldValue / totalValue,
          bonds: bondsValue / totalValue
        };
      }

      console.log(`Weights - Equity: ${weights.equity}, Gold: ${weights.gold}, Bonds: ${weights.bonds}`);

      const response: GetPortfolioResponse = {
        userWallet,
        balances: {
          equity: equityTokens,
          gold: goldTokens,
          bonds: bondsTokens,
        },
        values: {
          equity: equityValue,
          gold: goldValue,
          bonds: bondsValue,
        },
        totalValue,
        weights,
      };

      console.log('Portfolio response:', JSON.stringify(response, null, 2));

      return response;

    } catch (error) {
      console.error('Error querying account balance:', error);
      throw error;
    } finally {
      // Close the client connection
      client.close();
    }
  }

  async rebalanceCheck(request: RebalanceCheckRequest): Promise<RebalanceCheckResponse> {
    const {
      userWallet,
      balanceOfEquity,
      balanceOfGold,
      balanceOfBonds,
      priceOfEquity,
      priceOfGold,
      priceOfBonds,
      currentWeightEquity,
      currentWeightGold,
      currentWeightBonds,
      targetWeightEquity,
      targetWeightGold,
      targetWeightBonds
    } = request;

    console.log(`Processing rebalance check for user: ${userWallet}`);

    // Calculate current total value
    const currentEquityValue = balanceOfEquity * priceOfEquity;
    const currentGoldValue = balanceOfGold * priceOfGold;
    const currentBondsValue = balanceOfBonds * priceOfBonds;
    const totalValueUsd = currentEquityValue + currentGoldValue + currentBondsValue;

    // Prepare the prompt with actual values
    const populatedPrompt = this.REBALANCE_PROMPT
      .replace('{{userWallet}}', userWallet)
      .replace('{{balancesofTokens}}', `Equity: ${balanceOfEquity} tokens, Gold: ${balanceOfGold} tokens, Bonds: ${balanceOfBonds} tokens`)
      .replace('{{PriceOfAssets}}', `Equity: $${priceOfEquity}, Gold: $${priceOfGold}, Bonds: $${priceOfBonds}`)
      .replace('{{totalValueUsd}}', `$${totalValueUsd}`)
      .replace('{{targetWeights}}', `Equity: ${targetWeightEquity}, Gold: ${targetWeightGold}, Bonds: ${targetWeightBonds}`);

    try {
      console.log('Sending request to OpenAI...');
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a precise financial calculator. You MUST return ONLY valid JSON responses with no additional explanations, comments, or text. Use only plain ASCII characters. Do not include any text before or after the JSON object. The response should start with { and end with }."
          },
          {
            role: "user",
            content: populatedPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      });

      const responseContent = completion.choices[0].message.content;
      console.log('OpenAI Response:', responseContent);

      if (!responseContent) {
        throw new Error('Empty response from AI service');
      }

      // Extract JSON from the response
      let rebalanceData;
      try {
        // First try to parse the entire response as JSON
        rebalanceData = JSON.parse(responseContent);
      } catch (parseError) {
        console.error('Failed to parse entire response as JSON, attempting to extract JSON portion:', parseError);
        console.error('Raw response content:', responseContent);
        
        try {
          // Look for JSON object in the response - find the opening and closing braces
          const jsonStart = responseContent.indexOf('{');
          const jsonEnd = responseContent.lastIndexOf('}') + 1;
          
          if (jsonStart === -1 || jsonEnd === 0) {
            throw new Error('No JSON object found in response');
          }
          
          const jsonString = responseContent.substring(jsonStart, jsonEnd);
          console.log('Extracted JSON string:', jsonString);
          
          rebalanceData = JSON.parse(jsonString);
          console.log('Successfully parsed extracted JSON');
          
        } catch (extractError) {
          console.error('Failed to extract and parse JSON from response:', extractError);
          
          // Last resort: try to clean the response and parse again
          try {
            const cleanedContent = responseContent
              .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
              .replace(/[\u2000-\u206F\u2E00-\u2E7F\u3000-\u303F]/g, '') // Remove various Unicode spaces and punctuation
              .replace(/[\u{1F000}-\u{1F9FF}]/gu, '') // Remove emojis
              .replace(/[^\x00-\x7F]/g, ''); // Keep only ASCII characters
            
            const cleanJsonStart = cleanedContent.indexOf('{');
            const cleanJsonEnd = cleanedContent.lastIndexOf('}') + 1;
            
            if (cleanJsonStart !== -1 && cleanJsonEnd !== 0) {
              const cleanJsonString = cleanedContent.substring(cleanJsonStart, cleanJsonEnd);
              console.log('Attempting to parse cleaned JSON:', cleanJsonString);
              rebalanceData = JSON.parse(cleanJsonString);
              console.log('Successfully parsed cleaned JSON');
            } else {
              throw new Error('Unable to extract JSON from cleaned content');
            }
          } catch (cleanError) {
            console.error('Failed to parse cleaned response:', cleanError);
            throw new Error('Invalid response format from AI service - unable to parse JSON');
          }
        }
      }

      // Validate the response structure
      if (!rebalanceData.rebalancePlan || !rebalanceData.explanation) {
        throw new Error('Invalid response structure from AI service');
      }

      const response: RebalanceCheckResponse = {
        userWallet,
        rebalancePlan: rebalanceData.rebalancePlan,
        explanation: rebalanceData.explanation
      };

      console.log('Rebalance check response:', JSON.stringify(response, null, 2));
      return response;

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error(`Failed to process rebalance check: ${error.message}`);
    }
  }
}
