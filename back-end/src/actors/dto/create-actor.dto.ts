import { ApiProperty } from '@nestjs/swagger';

export class CreateActorDto {
  @ApiProperty({ description: 'Actor type', example: 'user' })
  type: string;

  @ApiProperty({ description: 'Actor name', example: 'John Doe' })
  name: string;
}
