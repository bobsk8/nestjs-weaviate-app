import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MovieNearTextQueryWithFilterDto {
  @ApiProperty({
    example: 'dystopian future',
    description: 'The text for nearTextQuery query',
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
