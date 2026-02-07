import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class AdviceErrorDto {
  @ApiPropertyOptional({
    description: 'Error ID to get advice for. If not provided, advice for last 10 errors will be generated.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  errorId?: string;
}
