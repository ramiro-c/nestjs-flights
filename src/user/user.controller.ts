import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IDeleteResponse } from '../common/interfaces/delete-response.interface';
import { IUser } from '../common/interfaces/user.interface';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userDTO: UserDTO): Promise<IUser> {
    return await this.userService.create(userDTO);
  }

  @Get()
  async findAll(): Promise<IUser[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<IUser> {
    return await this.userService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userDTO: UserDTO,
  ): Promise<IUser> {
    return await this.userService.update(id, userDTO);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IDeleteResponse> {
    return await this.userService.delete(id);
  }
}
