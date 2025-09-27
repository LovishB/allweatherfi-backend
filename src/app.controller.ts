import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';
import type { CheckMintRequest, CheckMintResponse, GetPortfolioRequest, GetPortfolioResponse, RebalanceCheckRequest, RebalanceCheckResponse } from './app.service';

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

  @Post('rebalanceCheck')
  @ApiOperation({ summary: 'Check rebalancing requirements using AI analysis' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns rebalancing plan with tokens to mint/burn and detailed explanation',
    type: 'RebalanceCheckResponse'
  })
  @ApiBody({
    description: 'Request body with current portfolio state and target weights',
    schema: {
      type: 'object',
      properties: {
        userWallet: {
          type: 'string',
          example: '0x1234567890123456789012345678901234567890',
          description: 'User wallet address'
        },
        balanceOfEquity: {
          type: 'number',
          example: 24,
          description: 'Current balance of equity tokens'
        },
        balanceOfGold: {
          type: 'number',
          example: 103,
          description: 'Current balance of gold tokens'
        },
        balanceOfBonds: {
          type: 'number',
          example: 46,
          description: 'Current balance of bonds tokens'
        },
        priceOfEquity: {
          type: 'number',
          example: 600,
          description: 'Current price of equity token in USD'
        },
        priceOfGold: {
          type: 'number',
          example: 50,
          description: 'Current price of gold token in USD'
        },
        priceOfBonds: {
          type: 'number',
          example: 100,
          description: 'Current price of bonds token in USD'
        },
        currentWeightEquity: {
          type: 'number',
          example: 0.6,
          description: 'Current weight of equity in portfolio'
        },
        currentWeightGold: {
          type: 'number',
          example: 0.2,
          description: 'Current weight of gold in portfolio'
        },
        currentWeightBonds: {
          type: 'number',
          example: 0.2,
          description: 'Current weight of bonds in portfolio'
        },
        targetWeightEquity: {
          type: 'number',
          example: 0.5,
          description: 'Target weight of equity in portfolio'
        },
        targetWeightGold: {
          type: 'number',
          example: 0.1,
          description: 'Target weight of gold in portfolio'
        },
        targetWeightBonds: {
          type: 'number',
          example: 0.4,
          description: 'Target weight of bonds in portfolio'
        }
      },
      required: [
        'userWallet',
        'balanceOfEquity',
        'balanceOfGold',
        'balanceOfBonds',
        'priceOfEquity',
        'priceOfGold',
        'priceOfBonds',
        'currentWeightEquity',
        'currentWeightGold',
        'currentWeightBonds',
        'targetWeightEquity',
        'targetWeightGold',
        'targetWeightBonds'
      ]
    }
  })
  rebalanceCheck(@Body() body: RebalanceCheckRequest): Promise<RebalanceCheckResponse> {
    return this.appService.rebalanceCheck(body);
  }
}
