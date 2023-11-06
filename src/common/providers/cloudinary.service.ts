import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bufferToStream from 'buffer-to-stream';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  UploadApiOptions,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(
    file: Express.Multer.File,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        },
      );

      bufferToStream(file.buffer).pipe(upload);
    });
  }
}
