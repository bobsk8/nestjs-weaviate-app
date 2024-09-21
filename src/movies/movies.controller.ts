import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { WeaviateNonGenericObject } from 'weaviate-client';
import {
  MovieBM25QueryDto,
  MovieGenerativeSearchDto,
  MovieGenerativeSearchGroupDto,
  MoviehybridQueryDto,
  MovieNearTextDto,
  MovieNearTextQueryWithFilterDto,
} from './dtos';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post('create-collection')
  public createCollection(): Promise<string> {
    try {
      return this.moviesService.createCollection();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('import-data')
  public importData(): Promise<void> {
    try {
      return this.moviesService.importData();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('near-text-query')
  public nearTextQuery(
    @Body() body: MovieNearTextDto,
  ): Promise<WeaviateNonGenericObject[]> {
    try {
      return this.moviesService.nearTextQuery(body);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('mb25-query')
  public bm25Query(
    @Body() body: MovieBM25QueryDto,
  ): Promise<WeaviateNonGenericObject[]> {
    try {
      return this.moviesService.bm25Query(body);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('hybrid-query')
  public hybridQuery(
    @Body() body: MoviehybridQueryDto,
  ): Promise<WeaviateNonGenericObject[]> {
    try {
      return this.moviesService.hybridQuery(body);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('near-text-query-with-filter')
  public nearTextQueryWithFilter(
    @Body() body: MovieNearTextQueryWithFilterDto,
  ): Promise<void> {
    try {
      return this.moviesService.nearTextQueryWithFilter(body);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('generative-search-query')
  public generativeSearchQuery(@Body() body: MovieGenerativeSearchDto) {
    try {
      return this.moviesService.generativeSearchQuery(body);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('generative-search-grouped-query')
  public generativeSearchGroupedQuery(
    @Body() body: MovieGenerativeSearchGroupDto,
  ) {
    try {
      return this.moviesService.generativeSearchGroupedQuery(body);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
