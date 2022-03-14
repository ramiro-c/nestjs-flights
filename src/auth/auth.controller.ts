import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from '../common/interfaces/user.interface';
import { UserDTO } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Body() authDTO: AuthDTO): Promise<{ access_token: string }> {
    return await this.authService.signIn(authDTO);
  }

  @Post('signup')
  async signUp(@Body() userDTO: UserDTO): Promise<IUser> {
    return await this.authService.signUp(userDTO);
  }
}
