import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/base/base.service';
import {
  CollectionConfigCreate,
  configure,
  generateUuid5,
  vectorizer,
  WeaviateClient,
  WeaviateNonGenericObject,
} from 'weaviate-client';
import {
  MovieBM25QueryDto,
  MovieGenerativeSearchDto,
  MovieGenerativeSearchGroupDto,
  MoviehybridQueryDto,
  MovieNearTextDto,
  MovieNearTextQueryWithFilterDto,
} from './dtos';

const collectionName = 'Movie';

@Injectable()
export class MoviesService extends BaseService {
  constructor() {
    const name = collectionName;
    const movie: CollectionConfigCreate = {
      name,
      properties: [
        { name: 'title', dataType: configure.dataType.TEXT },
        { name: 'overview', dataType: configure.dataType.TEXT },
        { name: 'vote_average', dataType: configure.dataType.NUMBER },
        { name: 'genre_ids', dataType: configure.dataType.INT_ARRAY },
        { name: 'release_date', dataType: configure.dataType.DATE },
        { name: 'tmdb_id', dataType: configure.dataType.INT },
      ],
      vectorizers: vectorizer.text2VecOpenAI(),
      generative: configure.generative.openAI(),
    };
    super(movie);
  }

  public async importData(): Promise<void> {
    let client: WeaviateClient;
    try {
      client = await this.getClient();

      if (!client?.isLive()) {
        throw new Error('Client is not live!');
      }

      const dataUrl =
        'https://raw.githubusercontent.com/weaviate-tutorials/edu-datasets/main/movies_data_1990_2024.json';
      const response = await fetch(dataUrl);
      const data = await response.json();

      const collection = client.collections.get(collectionName);

      let itemsToInsert = [];
      let counter = 0;

      // Iterate through data
      for (const key of Object.keys(data['title'])) {
        counter++;
        if (counter % 1000 == 0) console.log(`Import: ${counter}`);

        // Format genre_ids and release_date
        const parsedArray = JSON.parse(data['genre_ids'][key]);
        const genreIds = parsedArray.map((item) => parseInt(item, 10));
        const releaseDate = new Date(data['release_date'][key]);

        // Build the object payload
        const movieObject = {
          title: data['title'][key],
          overview: data['overview'][key],
          vote_average: data['vote_average'][key],
          genre_ids: genreIds,
          release_date: releaseDate,
          tmdb_id: data['id'][key],
        };
        // Insert
        const objectToInsert = {
          properties: movieObject,
          uuid: generateUuid5(data['title'][key]),
        };

        // Add object to batching array
        itemsToInsert.push(objectToInsert);

        if (itemsToInsert.length == 2000) {
          // Batch insert 2000 items and clear batch array
          const response = await collection.data.insertMany(itemsToInsert);
          itemsToInsert = [];
          if (response.hasErrors) {
            throw new Error('Something went wrong in import!');
          }
        }
      }
      // insert the remaining objects
      if (itemsToInsert.length > 0) {
        // Batch insert any remaining items
        const response = await collection.data.insertMany(itemsToInsert);
        console.log('Done Importing');

        if (response.hasErrors) {
          throw new Error('Something went wrong in import!');
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong in importData!');
    } finally {
      client?.close();
    }
  }

  public async nearTextQuery(
    body: MovieNearTextDto,
  ): Promise<WeaviateNonGenericObject[]> {
    const { text } = body;
    let client: WeaviateClient;

    try {
      client = await this.getClient();

      if (!client?.isLive()) {
        throw new Error('Client is not live!');
      }

      const collection = client.collections.get(collectionName);
      const result = await collection.query.nearText(text, {
        limit: 2,
      });

      return (
        result?.objects?.length > 0 &&
        result.objects.map((item) => this.itemMapper(item))
      );
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong in nearTextQuery!');
    } finally {
      client?.close();
    }
  }

  public async bm25Query(
    body: MovieBM25QueryDto,
  ): Promise<WeaviateNonGenericObject[]> {
    const { text, limit } = body;
    let client: WeaviateClient;

    try {
      client = await this.getClient();

      if (!client?.isLive()) {
        throw new Error('Client is not live!');
      }
      const collection = client.collections.get(collectionName);
      const result = await collection.query.bm25(text, {
        limit,
        returnMetadata: ['score'],
      });

      return (
        result?.objects?.length > 0 &&
        result.objects.map((item) => this.itemMapper(item))
      );
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong in bm25Query!');
    } finally {
      client?.close();
    }
  }

  public async hybridQuery(
    body: MoviehybridQueryDto,
  ): Promise<WeaviateNonGenericObject[]> {
    const { text, limit } = body;
    let client: WeaviateClient;

    try {
      client = await this.getClient();

      if (!client?.isLive()) {
        throw new Error('Client is not live!');
      }

      const collection = client.collections.get(collectionName);
      const result = await collection.query.hybrid(text, {
        limit,
        returnMetadata: ['score'],
      });

      return (
        result?.objects?.length > 0 &&
        result.objects.map((item) => this.itemMapper(item))
      );
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong in bm25Query!');
    } finally {
      client?.close();
    }
  }

  public async nearTextQueryWithFilter(
    body: MovieNearTextQueryWithFilterDto,
  ): Promise<any> {
    const { text, limit } = body;
    let client: WeaviateClient;

    try {
      client = await this.getClient();

      if (!client?.isLive()) {
        throw new Error('Client is not live!');
      }

      const collection = client.collections.get(collectionName);
      const result = await collection.query.nearText(text, {
        filters: collection.filter
          .byProperty('release_date')
          .greaterThan(new Date('December 17, 1995')),
        limit,
      });

      return (
        result?.objects?.length > 0 &&
        result.objects.map((item) => this.itemMapper(item))
      );
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong in nearTextWhereQuery!');
    } finally {
      client?.close();
    }
  }

  public async generativeSearchQuery(
    body: MovieGenerativeSearchDto,
  ): Promise<any> {
    const { text, singlePrompt } = body;
    let client: WeaviateClient;

    try {
      client = await this.getClient();

      if (!client?.isLive()) {
        throw new Error('Client is not live!');
      }

      const collection = client.collections.get(collectionName);
      const result = await collection.generate.nearText(
        text,
        { singlePrompt },
        { limit: 2 },
      );

      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong in generativeSearchQuery!');
    } finally {
      client?.close();
    }
  }

  public async generativeSearchGroupedQuery(
    body: MovieGenerativeSearchGroupDto,
  ): Promise<any> {
    const { text, groupedTask } = body;
    let client: WeaviateClient;

    try {
      client = await this.getClient();

      if (!client?.isLive()) {
        throw new Error('Client is not live!');
      }

      const collection = client.collections.get(collectionName);
      const result = await collection.generate.nearText(
        text,
        { groupedTask, groupedProperties: ['title', 'overview'] },
        { limit: 2 },
      );

      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong in generativeSearchGroupedQuery!');
    } finally {
      client?.close();
    }
  }

  private itemMapper(item: any): any {
    return {
      title: item.properties.title,
      overview: item.properties.overview,
      vote_average: item.properties.vote_average,
      genre_ids: item.properties.genre_ids,
      release_date: item.properties.release_date,
      tmdb_id: item.properties.tmdb_id,
    };
  }
}
