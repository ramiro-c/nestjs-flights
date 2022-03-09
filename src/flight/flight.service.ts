import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IFlight } from '../common/interfaces/flight.interface';
import { FlightDTO } from './dto/flight.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FLIGHT } from '../common/models/models';
import { IDeleteResponse } from '../common/interfaces/delete-response.interface';

@Injectable()
export class FlightService {
  private readonly logger: Logger = new Logger(FlightService.name, {
    timestamp: true,
  });

  constructor(
    @InjectModel(FLIGHT.name) private readonly model: Model<IFlight>,
  ) {}

  async create(flightDTO: FlightDTO): Promise<IFlight> {
    try {
      const newFlight = new this.model(flightDTO);

      return await newFlight.save();
    } catch (e) {
      this.logger.error(
        `Error creating flight: ${JSON.stringify(flightDTO)}`,
        e.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<IFlight[]> {
    return await this.model.find();
  }

  async findById(id: string): Promise<IFlight> {
    const flight = await this.model.findById(id);

    if (!flight) {
      throw new NotFoundException(`Flight with ID: ${id} was not found`);
    }

    return flight;
  }

  async update(id: string, flightDTO: FlightDTO): Promise<IFlight> {
    try {
      await this.model.findByIdAndUpdate(id, flightDTO);

      return await this.findById(id);
    } catch (e) {
      this.logger.error(
        `Error updating flight: ${JSON.stringify(flightDTO)}`,
        e.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async delete(id: string): Promise<IDeleteResponse> {
    const found = await this.model.findByIdAndRemove(id);

    if (!found) {
      throw new NotFoundException(`Flight with ID: ${id} was not found`);
    }

    return {
      status: HttpStatus.OK,
      message: 'Flight deleted successfully',
    };
  }

  async addPassenger(flightId: string, passengerId: string): Promise<IFlight> {
    try {
      await this.model
        .findByIdAndUpdate(flightId, {
          $addToSet: { passengers: passengerId },
        })
        .populate('passengers');

      return await this.findById(flightId);
    } catch (e) {
      this.logger.error(
        `Error adding passenger: ${passengerId} to flight: ${flightId}`,
        e.stack,
      );
      throw new BadRequestException(
        `Error adding passenger: ${passengerId} to flight: ${flightId}`,
      );
    }
  }
}
