import weaviate, {
  CollectionConfigCreate,
  WeaviateClient,
} from 'weaviate-client';

export abstract class BaseService {
  protected client: WeaviateClient;

  constructor(private collectionConfig: CollectionConfigCreate) {}

  public async createCollection(): Promise<string> {
    try {
      if (await this.client.isLive()) {
        const collection = await this.client.collections.create(
          this.collectionConfig,
        );
        return `Collection ${collection.name} created!`;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong in collection creation!');
    } finally {
      this.client.close();
    }
  }

  protected async getClient(): Promise<WeaviateClient> {
    try {
      this.client = await weaviate.connectToLocal({
        host: process.env.WEAVIATE_HOST,
        port: Number(process.env.WEAVIATE_PORT) || 8080,
        headers: {
          'X-OpenAI-Api-Key': process.env.OPENAI_APIKEY,
        },
      });
      return this.client;
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong in client creation!');
    }
  }
}
