import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../common/interfaces/jwt-payload.interface';
import { IUser } from '../common/interfaces/user.interface';
import { UserDTO } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { AuthDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<IUser> {
    const user: IUser = await this.userService.findByUsername(username);

    const isValidPassword: boolean = await this.userService.checkPassword(
      password,
      user.password,
    );

    return isValidPassword ? user : null;
  }

  async signIn(authDTO: AuthDTO): Promise<{ access_token: string }> {
    const { _id, username } = authDTO;

    const payload: IJwtPayload = {
      sub: _id,
      username: username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(userDTO: UserDTO): Promise<IUser> {
    return await this.userService.create(userDTO);
  }
}
