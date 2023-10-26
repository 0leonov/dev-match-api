import { Injectable } from '@nestjs/common';
import * as bufferToStream from 'buffer-to-stream';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });

      bufferToStream(file.buffer).pipe(upload);
    });
  }
}
