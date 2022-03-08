import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IDeleteResponse } from '../interfaces/delete-response.interface';
import { IPassenger } from '../interfaces/passenger.interface';
import { PassengerDTO } from './dto/passenger.dto';
import { PassengerService } from './passenger.service';

@Controller('api/v1/passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post()
  async create(@Body() userDTO: PassengerDTO): Promise<IPassenger> {
    return await this.passengerService.create(userDTO);
  }

  @Get()
  async findAll(): Promise<IPassenger[]> {
    return await this.passengerService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<IPassenger> {
    return await this.passengerService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userDTO: PassengerDTO,
  ): Promise<IPassenger> {
    return await this.passengerService.update(id, userDTO);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IDeleteResponse> {
    return await this.passengerService.delete(id);
  }
}
