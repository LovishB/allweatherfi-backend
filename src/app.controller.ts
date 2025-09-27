import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';
import type { CheckMintRequest, CheckMintResponse, GetPortfolioRequest, GetPortfolioResponse } from './app.service';

@ApiTags('finance')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({ status: 200, description: 'Returns hello world message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('checkMint')
  @ApiOperation({ summary: 'Check mint calculation for asset allocation' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns calculated allocations and tokens to mint',
    type: 'CheckMintResponse'
  })
  @ApiBody({
    description: 'Request body with user wallet address, HBAR amount, prices, and weights',
    schema: {
      type: 'object',
      properties: {
        userWalletAddress: {
          type: 'string',
          example: '0x1234567890123456789012345678901234567890',
          description: 'Ethereum wallet address of the user'
        },
        amountHbar: {
          type: 'number',
          example: 1000,
          description: 'Amount of HBAR to invest'
        },
        priceHbar: {
          type: 'number',
          example: 0.06,
          description: 'Price of HBAR in USD'
        },
        priceEquity: {
          type: 'number',
          example: 1.2,
          description: 'Price of equity token in USD'
        },
        priceBonds: {
          type: 'number',
          example: 1.0,
          description: 'Price of bonds token in USD'
        },
        priceGold: {
          type: 'number',
          example: 2.5,
          description: 'Price of gold token in USD'
        },
        weightEquity: {
          type: 'number',
          example: 0.6,
          description: 'Weight allocation for equity (as decimal)'
        },
        weightGold: {
          type: 'number',
          example: 0.2,
          description: 'Weight allocation for gold (as decimal)'
        },
        weightBonds: {
          type: 'number',
          example: 0.2,
          description: 'Weight allocation for bonds (as decimal)'
        }
      },
      required: [
        'userWalletAddress',
        'amountHbar',
        'priceHbar',
        'priceEquity',
        'priceBonds',
        'priceGold',
        'weightEquity',
        'weightGold',
        'weightBonds'
      ]
    }
  })
  checkMint(@Body() body: CheckMintRequest): Promise<CheckMintResponse> {
    return this.appService.checkMint(body);
  }

  @Post('getPortfolio')
  @ApiOperation({ summary: 'Get user portfolio with current allocations and weights' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns user portfolio with token balances, values, and weights',
    type: 'GetPortfolioResponse'
  })
  @ApiBody({
    description: 'Request body with user wallet address and current asset prices',
    schema: {
      type: 'object',
      properties: {
        userWallet: {
          type: 'string',
          example: '0.0.1234567',
          description: 'Hedera account ID of the user'
        },
        priceEquity: {
          type: 'number',
          example: 1.2,
          description: 'Current price of equity token in USD'
        },
        priceBonds: {
          type: 'number',
          example: 1.0,
          description: 'Current price of bonds token in USD'
        },
        priceGold: {
          type: 'number',
          example: 2.5,
          description: 'Current price of gold token in USD'
        }
      },
      required: [
        'userWallet',
        'priceEquity',
        'priceBonds',
        'priceGold'
      ]
    }
  })
  getPortfolio(@Body() body: GetPortfolioRequest): Promise<GetPortfolioResponse> {
    return this.appService.getPortfolio(body);
  }
}
