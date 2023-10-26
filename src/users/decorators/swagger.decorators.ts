import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserResponse } from '../responses';

export function ApiOperationFindAll() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({ summary: 'Get all users information.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiOkResponse({
      type: UserResponse,
      isArray: true,
      description: 'Successful get.',
    })(target, propertyKey, descriptor);
  };
}

export function ApiOperationFindOne() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({ summary: 'Get user information by username.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiOkResponse({
      type: UserResponse,
      description: 'Successful get.',
    })(target, propertyKey, descriptor);
    ApiNotFoundResponse({
      description: 'User with this username not found.',
    })(target, propertyKey, descriptor);
  };
}

export function ApiOperationUpdate() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({ summary: 'Update user information.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiOkResponse({
      type: UserResponse,
      description: 'Successful get.',
    })(target, propertyKey, descriptor);
    ApiBadRequestResponse({
      description: 'Invalid id (uuid is expected).',
    })(target, propertyKey, descriptor);
    ApiUnauthorizedResponse({ description: 'Access token is missing.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiForbiddenResponse({
      description: 'The current user does not possess admin rights.',
    })(target, propertyKey, descriptor);
    ApiNotFoundResponse({ description: 'User with this id not found.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

export function ApiOperationDelete() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({ summary: 'Delete user.' })(target, propertyKey, descriptor);
    ApiOkResponse({
      type: UserResponse,
      description: 'Successful delete.',
    })(target, propertyKey, descriptor);
    ApiBadRequestResponse({
      description: 'Invalid id (uuid is expected).',
    })(target, propertyKey, descriptor);
    ApiUnauthorizedResponse({ description: 'Access token is missing.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiForbiddenResponse({
      description: 'The current user does not possess admin rights.',
    })(target, propertyKey, descriptor);
    ApiNotFoundResponse({ description: 'User with this id not found.' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}
