import { Module } from '@nestjs/common';
import { PublicationModule } from './module/publication/publication.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PublicationModule,
    ConfigModule.forRoot(),
  ],
})

export class AppModule {}
