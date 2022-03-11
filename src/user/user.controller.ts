import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { IDeleteResponse } from '../common/interfaces/delete-response.interface';
import { IUser } from '../common/interfaces/user.interface';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: UserDTO })
  async create(@Body() userDTO: UserDTO): Promise<IUser> {
    return await this.userService.create(userDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  async findAll(): Promise<IUser[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiParam({
    type: 'string',
    name: 'id',
  })
  async findById(@Param('id') id: string): Promise<IUser> {
    return await this.userService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({
    type: 'string',
    name: 'id',
  })
  @ApiBody({ type: UserDTO })
  async update(
    @Param('id') id: string,
    @Body() userDTO: UserDTO,
  ): Promise<IUser> {
    return await this.userService.update(id, userDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    type: 'string',
    name: 'id',
  })
  async delete(@Param('id') id: string): Promise<IDeleteResponse> {
    return await this.userService.delete(id);
  }
}
