import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IPassenger } from '../common/interfaces/passenger.interface';
import { PassengerDTO } from './dto/passenger.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PASSENGER } from '../common/models/models';
import { IDeleteResponse } from '../common/interfaces/delete-response.interface';

@Injectable()
export class PassengerService {
  private readonly logger: Logger = new Logger(PassengerService.name, {
    timestamp: true,
  });

  constructor(
    @InjectModel(PASSENGER.name) private readonly model: Model<IPassenger>,
  ) {}

  async create(passengerDTO: PassengerDTO): Promise<IPassenger> {
    try {
      const newPassenger = new this.model(passengerDTO);

      return await newPassenger.save();
    } catch (e) {
      if (e.code === 11000) {
        const message = e.message
          .substring(
            e.message.lastIndexOf('{') + 2,
            e.message.lastIndexOf('}') - 1,
          )
          .replaceAll(`"`, `'`);

        throw new ConflictException(
          `Passenger not created. Duplicated ${message}`,
        );
      } else {
        this.logger.error(
          `Error creating passenger: ${passengerDTO.email}`,
          e.stack,
        );
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll(): Promise<IPassenger[]> {
    return await this.model.find();
  }

  async findById(id: string): Promise<IPassenger> {
    const passenger = await this.model.findById(id);

    if (!passenger) {
      throw new NotFoundException(`Passenger with ID: ${id} was not found`);
    }

    return passenger;
  }

  async update(id: string, passengerDTO: PassengerDTO): Promise<IPassenger> {
    try {
      await this.model.findByIdAndUpdate(id, passengerDTO);

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
          `Passenger not updated. Already exists ${message}`,
        );
      } else {
        this.logger.error(
          `Error updating passenger: ${
            passengerDTO.email
          } Data: ${JSON.stringify(passengerDTO)}`,
          e.stack,
        );
        throw new InternalServerErrorException();
      }
    }
  }

  async delete(id: string): Promise<IDeleteResponse> {
    const found = await this.model.findByIdAndRemove(id);

    if (!found) {
      throw new NotFoundException(`Passenger with ID: ${id} was not found`);
    }

    return {
      status: HttpStatus.OK,
      message: 'Passenger deleted successfully',
    };
  }
}
