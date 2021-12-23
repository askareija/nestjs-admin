import { Order } from './models/order.entity';
import { OrderItem } from './models/order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './../common/common.module';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
