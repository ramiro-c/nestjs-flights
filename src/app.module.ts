import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PassengerModule } from './passenger/passenger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.dev'], isGlobal: true }),
    MongooseModule.forRoot(process.env.URI_MONGODB),
    UserModule,
    PassengerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
