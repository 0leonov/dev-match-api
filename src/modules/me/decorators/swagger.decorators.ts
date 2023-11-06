import {
  ApiOperation,
  ApiOkResponse,
  ApiConsumes,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { FullUserDto } from '../../../common/dto';

export function ApiOperationGetProfile() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({ summary: 'Get current user information.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiOkResponse({
      type: FullUserDto,
      description: 'Successful get.',
    })(target, propertyKey, descriptor);
    ApiUnauthorizedResponse({ description: 'Access token is invalid.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

export function ApiOperationUpdateAvatar() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({ summary: 'Update current user avatar.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
    ApiOkResponse({
      type: FullUserDto,
      description: 'Successful get.',
    })(target, propertyKey, descriptor);
    ApiUnauthorizedResponse({ description: 'Access token is invalid.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

export function ApiOperationUpdateMe() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({ summary: 'Update current user information.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiOkResponse({
      type: FullUserDto,
      description: 'Successful update.',
    })(target, propertyKey, descriptor);
    ApiUnauthorizedResponse({ description: 'Access token is invalid.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}
