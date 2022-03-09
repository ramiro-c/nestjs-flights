import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IUser } from '../common/interfaces/user.interface';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER } from '../common/models/models';
import { IDeleteResponse } from '../common/interfaces/delete-response.interface';

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

        throw new ConflictException(`User not created. Duplicated ${message}`);
      } else {
        this.logger.error(`Error creating user: ${userDTO.username}`, e.stack);
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll(): Promise<IUser[]> {
    return await this.model.find();
  }

  async findById(id: string): Promise<IUser> {
    const user = await this.model.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID: ${id} was not found`);
    }

    return user;
  }

  async update(id: string, userDTO: UserDTO): Promise<IUser> {
    const hashedPassword = await this.hashPassword(userDTO.password);

    try {
      await this.model.findByIdAndUpdate(id, {
        ...userDTO,
        password: hashedPassword,
      });

      return await this.findById(id);
    } catch (e) {
      if (e.code === 11000) {
        const message = e.message
          .substring(
            e.message.lastIndexOf('{') + 2,
            e.message.lastIndexOf('}') - 1,
          )
          .replaceAll(`"`, `'`);

        throw new ConflictException(
          `User not updated. Already exists ${message}`,
        );
      } else {
        this.logger.error(
          `Error updating user: ${userDTO.username} Data: ${JSON.stringify(
            userDTO,
          )}`,
          e.stack,
        );
        throw new InternalServerErrorException();
      }
    }
  }

  async delete(id: string): Promise<IDeleteResponse> {
    const found = await this.model.findByIdAndRemove(id);

    if (!found) {
      throw new NotFoundException(`User with ID: ${id} was not found`);
    }

    return {
      status: HttpStatus.OK,
      message: 'User deleted successfully',
    };
  }
}
