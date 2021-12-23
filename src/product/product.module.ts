import { UploadController } from './upload.controller';
import { CommonModule } from './../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './models/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CommonModule],
  controllers: [ProductController, UploadController],
  providers: [ProductService],
})
export class ProductModule {}
