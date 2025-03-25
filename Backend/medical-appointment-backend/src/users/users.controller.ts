// src/users/users.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../shared/guards/role.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe'; // Import custom pipe

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'patient')
  findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'patient')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ): Promise<UserResponseDto> {
    if (req.user.role === 'patient' && req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}