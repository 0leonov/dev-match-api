import { Injectable } from '@nestjs/common';
import * as bufferToStream from 'buffer-to-stream';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  UploadApiOptions,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
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

  delete(path: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return cloudinary.uploader.destroy(path);
  }
}
