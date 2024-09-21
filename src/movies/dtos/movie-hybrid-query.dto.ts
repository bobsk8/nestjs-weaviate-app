import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MoviehybridQueryDto {
  @ApiProperty({
    example: 'history',
    description: 'The text for hybrid query',
    type: String,
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The limit for the query',
    default: 2,
    type: Number,
  })
  @IsNumber()
  limit: number;
}
