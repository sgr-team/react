# Books

This concise example demonstrates the creation of a CRUD API using @sgrnext/api. To handle 
request parsing and validation, the @sgrnext/api-parse plugin is employed, seamlessly integrating 
with the core library to extract and validate data from NextRequest objects based on defined schemas. 

This combination enables developers to build robust, type-safe APIs with minimal boilerplate, showcasing 
the power and simplicity of the @sgrnext/api ecosystem.

## Getting Started

### Run dev environment

First, run the development environment:

```
npm run dev-env
```

### Run dev server

Second, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tests

For testing purposes, it is necessary to have the development server running.

It’s important to note that running tests will clear the local database. If there is any critical 
data stored locally, it may be prudent to create a backup beforehand to prevent unintended loss of 
information during the testing process.

```bash
npm run example:test
```
