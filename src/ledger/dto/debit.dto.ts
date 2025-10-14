import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class DebitDto {
  @ApiProperty({ example: 100, description: 'Amount in dollars (e.g., 100 = $100.00)' })
  @IsNumber()
  @IsPositive()
  amount!: number; // dollars

  @ApiProperty({ required: false, description: 'Idempotency key (order id, payment id, etc.)' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  idempotencyKey?: string;
}
