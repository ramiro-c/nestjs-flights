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
import { IFlight } from '../common/interfaces/flight.interface';
import { PassengerService } from '../passenger/passenger.service';
import { FlightDTO } from './dto/flight.dto';
import { FlightService } from './flight.service';

@Controller('api/v1/flight')
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
    private readonly passengerService: PassengerService,
  ) {}

  @Post()
  async create(@Body() flightDTO: FlightDTO): Promise<IFlight> {
    return await this.flightService.create(flightDTO);
  }

  @Get()
  async findAll(): Promise<IFlight[]> {
    return await this.flightService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<IFlight> {
    return await this.flightService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() flightDTO: FlightDTO,
  ): Promise<IFlight> {
    return await this.flightService.update(id, flightDTO);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IDeleteResponse> {
    return await this.flightService.delete(id);
  }

  @Post(':flightId/passenger/:passengerId')
  async addPassenger(
    @Param('flightId') flightId: string,
    @Param('passengerId') passengerId: string,
  ): Promise<IFlight> {
    await this.passengerService.findById(passengerId);

    return await this.flightService.addPassenger(flightId, passengerId);
  }
}
