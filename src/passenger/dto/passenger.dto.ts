import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class PassengerDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    default: 'passenger@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
