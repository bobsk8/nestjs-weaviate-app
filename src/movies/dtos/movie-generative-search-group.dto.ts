import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MovieGenerativeSearchGroupDto {
  @ApiProperty({
    description: 'The text for generative query',
    example: 'dystopian future',
    type: String,
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The groupedTask for the query',
    example: 'What do these movies have in common?',
    type: String,
  })
  @IsString()
  groupedTask: string;

  @ApiProperty({
    description: 'The limit for the query',
    default: 2,
    type: Number,
  })
  @IsNumber()
  limit: number;
}
