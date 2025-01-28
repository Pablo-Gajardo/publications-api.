import { Module } from '@nestjs/common';
import { PublicationModule } from './module/publication/publication.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306, 
      database: 'publications',
      username: 'root',
      password: 'mysqladmin',
      entities: [__dirname+'/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PublicationModule,
    ConfigModule.forRoot(),
  ],
})

export class AppModule {}
