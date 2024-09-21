import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MovieGenerativeSearchDto {
  @ApiProperty({
    description: 'The text for generative query',
    example: 'dystopian future',
    type: String,
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The singlePrompt for the query',
    example: 'Translate this into French: {title}',
    type: String,
  })
  @IsString()
  singlePrompt: string;

  @ApiProperty({
    description: 'The limit for the query',
    default: 2,
    type: Number,
  })
  @IsNumber()
  limit: number;
}
