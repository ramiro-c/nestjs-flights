import { HttpStatus } from '@nestjs/common';

export interface IDeleteResponse {
  status: HttpStatus;
  message: string;
}
