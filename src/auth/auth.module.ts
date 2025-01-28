import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './token/token_handler';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Clave secreta para firmar los tokens
      signOptions: { expiresIn: '1h' }, // Opciones del token
    }),
  ],
  providers: [JwtService], // Agrega el servicio aquí
  exports: [JwtService, JwtModule], // Exporta el servicio y el módulo
})
export class AuthModule {}
