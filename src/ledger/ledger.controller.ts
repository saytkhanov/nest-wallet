import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LedgerService } from './ledger.service';
import { DebitDto } from './dto/debit.dto';

@ApiTags('ledger')
@Controller('users/:id')
export class LedgerController {
  constructor(private readonly ledger: LedgerService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get current balance (in cents)' })
  async getBalance(@Param('id', ParseIntPipe) id: number) {
    const balanceCents = await this.ledger.getBalance(id);
    return { userId: id, balanceCents };
  }

  @Post('debit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Debit user balance by amount in dollars' })
  @ApiResponse({ status: 200, description: 'Debit applied and balance recomputed from history' })
  async debit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DebitDto,
    @Headers('idempotency-key') idemHeader?: string,
  ) {
    const idempotencyKey = dto.idempotencyKey ?? idemHeader ?? undefined;
    return this.ledger.debit(id, dto.amount, idempotencyKey);
  }
}
