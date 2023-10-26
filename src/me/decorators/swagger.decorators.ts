import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { CurrentUserResponse } from '../../users/responses';

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
      type: CurrentUserResponse,
      description: 'Successful get.',
    })(target, propertyKey, descriptor);
    ApiNotFoundResponse({
      description: 'Access token is missing.',
    })(target, propertyKey, descriptor);
  };
}
