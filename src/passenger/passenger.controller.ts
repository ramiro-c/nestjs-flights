import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { IDeleteResponse } from '../common/interfaces/delete-response.interface';
import { IPassenger } from '../common/interfaces/passenger.interface';
import { PassengerDTO } from './dto/passenger.dto';
import { PassengerService } from './passenger.service';

@ApiTags('Passengers')
@Controller('api/v1/passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post()
  @ApiOperation({ summary: 'Create passenger' })
  @ApiBody({ type: PassengerDTO })
  async create(@Body() passengerDTO: PassengerDTO): Promise<IPassenger> {
    return await this.passengerService.create(passengerDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Find all passengers' })
  async findAll(): Promise<IPassenger[]> {
    return await this.passengerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find passenger by ID' })
  @ApiParam({
    type: 'string',
    name: 'id',
  })
  async findById(@Param('id') id: string): Promise<IPassenger> {
    return await this.passengerService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update passenger' })
  @ApiParam({
    type: 'string',
    name: 'id',
  })
  @ApiBody({ type: PassengerDTO })
  async update(
    @Param('id') id: string,
    @Body() passengerDTO: PassengerDTO,
  ): Promise<IPassenger> {
    return await this.passengerService.update(id, passengerDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete passenger' })
  @ApiParam({
    type: 'string',
    name: 'id',
  })
  async delete(@Param('id') id: string): Promise<IDeleteResponse> {
    return await this.passengerService.delete(id);
  }
}
