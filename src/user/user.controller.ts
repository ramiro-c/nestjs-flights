import { Body, Controller, Post } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userDTO: UserDTO): Promise<IUser> {
    return await this.userService.create(userDTO);
  }
}
