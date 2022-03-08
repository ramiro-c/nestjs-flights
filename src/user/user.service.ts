import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER } from '../common/models/models';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name, {
    timestamp: true,
  });

  constructor(@InjectModel(USER.name) private readonly model: Model<IUser>) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async create(userDTO: UserDTO): Promise<IUser> {
    const hashedPassword = await this.hashPassword(userDTO.password);

    try {
      const newUser = new this.model({
        ...userDTO,
        password: hashedPassword,
      });

      return await newUser.save();
    } catch (e) {
      if (e.code === 11000) {
        const message = e.message
          .substring(
            e.message.lastIndexOf('{') + 2,
            e.message.lastIndexOf('}') - 1,
          )
          .replaceAll(`"`, `'`);

        throw new ConflictException(
          `Username not created. Duplicated ${message}`,
        );
      } else {
        this.logger.error(`Error creating user: ${userDTO.username}`, e.stack);
        throw new InternalServerErrorException();
      }
    }
  }
}
