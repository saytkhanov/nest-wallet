import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const u = await this.users.getOr404(id);
    return { id: u.id, balanceCents: u.balanceCents };
  }
}
