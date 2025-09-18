import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.providers';
import { CloudinaryController, PdfController } from './cloudinary.controller';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
  controllers: [CloudinaryController, PdfController],
})
export class CloudinaryModule { }
