import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { IDeleteResponse } from '../common/interfaces/delete-response.interface';
import { IFlight } from '../common/interfaces/flight.interface';
import { PassengerService } from '../passenger/passenger.service';
import { FlightDTO } from './dto/flight.dto';
import { FlightService } from './flight.service';

@ApiTags('Flights')
@Controller('api/v1/flight')
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
    private readonly passengerService: PassengerService,
  ) {}

  @Post()
  @ApiBody({ type: FlightDTO })
  @ApiOperation({ summary: 'Create flight' })
  async create(@Body() flightDTO: FlightDTO): Promise<IFlight> {
    return await this.flightService.create(flightDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Find all flights' })
  async findAll(): Promise<IFlight[]> {
    return await this.flightService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find flight by ID' })
  @ApiParam({
    type: 'string',
    name: 'id',
  })
  async findById(@Param('id') id: string): Promise<IFlight> {
    return await this.flightService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update flight' })
  @ApiParam({
    type: 'string',
    name: 'id',
  })
  @ApiBody({ type: FlightDTO })
  async update(
    @Param('id') id: string,
    @Body() flightDTO: FlightDTO,
  ): Promise<IFlight> {
    return await this.flightService.update(id, flightDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete flight' })
  @ApiParam({
    type: 'string',
    name: 'id',
  })
  async delete(@Param('id') id: string): Promise<IDeleteResponse> {
    return await this.flightService.delete(id);
  }

  @Post(':flightId/passenger/:passengerId')
  @ApiOperation({ summary: 'Add a passenger to a flight' })
  @ApiParam({
    type: 'string',
    name: 'flightId',
  })
  @ApiParam({
    type: 'string',
    name: 'passengerId',
  })
  async addPassenger(
    @Param('flightId') flightId: string,
    @Param('passengerId') passengerId: string,
  ): Promise<IFlight> {
    await this.passengerService.findById(passengerId);

    return await this.flightService.addPassenger(flightId, passengerId);
  }
}
