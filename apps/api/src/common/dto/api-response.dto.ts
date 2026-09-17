// apps/api/src/common/dto/api-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty()
  data: T;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  timestamp: string;
}