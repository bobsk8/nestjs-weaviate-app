# NestJS Weaviate App

This application is an API built with [NestJS](https://nestjs.com/), integrating the [Weaviate](https://weaviate.io/) vector database with [OpenAI](https://openai.com/) services. The goal of this project is to provide an efficient interface for managing vector data, enabling fast queries and seamless integration with AI models.

## Features

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Weaviate**: A vector search engine powered by machine learning, designed for managing and searching through large datasets.
- **OpenAI Integration**: Utilizes OpenAI's models for advanced language processing, enhancing the capabilities of vector data operations.

## Prerequisites

Before running the application, ensure you have the following:

- Node.js (v18.x or higher)
- NPM or Yarn
- A running instance of Weaviate (local or cloud)
- Docker Compose (local only)
- OpenAI API Key

## Installation

1. Clone the repository:

```bash
git clone https://github.com/bobsk8/nestjs-weaviate-app.git
cd nestjs-weaviate-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by creating a .env file at the root of the project with the following keys:

```bash
WEAVIATE_HOST=<your_weaviate_instance>
OPENAI_API_KEY=<your_openai_api_key>
```

4. Running instance of Weaviate:

```bash
docker compose up -d
```

5. Run the application:

```bash
npm run start
```

The Swagger will be available at http://localhost:3000/api#/

### Usage

#### Vector Data Management

- <b>Create Collection:</b> Create Weaviate collection by sending a POST request to http://localhost:3000/movies/create-collection
- <b>Add data:</b> Upload data to Weaviate by sending a POST request to http://localhost:3000/movies/movies/import-data

### AI Integration

- <b>Text Processing:</b> Use OpenAI models for tasks like text generation, summarization and embeddings.

### Technologies

- <b>NestJS:</b> Backend framework
- <b>Weaviate:</b> Vector database
- <b>OpenAI API:</b> Language models for processing

## Weaviate javascript doc

https://weaviate.io/developers/academy/js/set_up_typescript

## Tags

- **nestjs**
- **weaviate**
- **openai**
- **ai** and **machine learning**
- **vector search** and **semantic search**
- **node.js**
- **api**
- **typescript**
