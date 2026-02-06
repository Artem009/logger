import { ApiProperty } from '@nestjs/swagger';

export class CreateErrorDto {
  @ApiProperty({ description: 'Error data', example: 'Something went wrong' })
  data: string;

  @ApiProperty({ description: 'Error occurrence counter', example: 0, default: 0, required: false })
  counter?: number;
}
