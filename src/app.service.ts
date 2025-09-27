import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

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
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  checkMint(request: CheckMintRequest): CheckMintResponse {
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
    };

    console.log('Check mint response:', JSON.stringify(response, null, 2));

    return response;
  }
}
