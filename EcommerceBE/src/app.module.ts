import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './module/users/users.module';
import { CategoryModule } from './module/category/category.module';
import { ProductModule } from './module/product/product.module';
import { OrderModule } from './module/order/order.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { StatsModule } from './module/stats/stats.module';
import { PaymentsModule } from './module/payments/payments.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
  }), 
  ThrottlerModule.forRoot([{
    ttl: 60,
    limit: 100
  }]), UsersModule, CategoryModule, ProductModule, OrderModule, StatsModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
