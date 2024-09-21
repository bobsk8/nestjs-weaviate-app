import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MovieBM25QueryDto {
  @ApiProperty({
    example: 'history',
    description: 'The text for bm25 query',
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
