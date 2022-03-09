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
import { ILocation } from '../common/interfaces/location.interface';
import axios from 'axios';
import { IWeather } from '../common/interfaces/weather.interface';
import { format } from 'date-fns';
@Injectable()
export class FlightService {
  private readonly logger: Logger = new Logger(FlightService.name, {
    timestamp: true,
  });

  private readonly API_WEATHER: string = 'https://www.metaweather.com/api';

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

    const location: ILocation | Record<string, never> = await this.getLocation(
      flight.destinationCity,
    );

    const weather: IWeather[] = await this.getWeather(
      location?.woeid,
      flight.flightDate,
    );

    return this.assing(flight, weather);
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

  assing(flight: IFlight, weather: IWeather[]): IFlight {
    const { _id, pilot, airplane, destinationCity, flightDate, passengers } =
      flight;

    return Object.assign({
      _id,
      pilot,
      airplane,
      destinationCity,
      flightDate,
      passengers,
      weather,
    });
  }

  async getLocation(
    destinationCity: string,
  ): Promise<ILocation | Record<string, never>> {
    const { data } = await axios.get(
      `${this.API_WEATHER}/location/search?query=${destinationCity}`,
    );

    if (data.length) return data[0];

    return {};
  }

  async getWeather(
    woeid: number | undefined,
    flightDate: Date,
  ): Promise<IWeather[]> {
    if (!woeid) return [];

    const date = format(flightDate, 'yyyy/mm/dd');
    const year = date.split('/')[0];
    const month = String(parseInt(date.split('/')[1]) + 1);
    const day = String(parseInt(date.split('/')[2]) + 1);

    const { data } = await axios.get(
      `${this.API_WEATHER}/location/${woeid}/${year}/${month}/${day}`,
    );

    return data;
  }
}
