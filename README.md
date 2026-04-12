# Housebuilder
TAFE assessment application

## Features

- Express MVC app
- Express-validator business rule schemas
- In-memory data (no database at this stage)
- End-points do not render views, only return data (at this stage)
- Swagger implementation /api-docs
- Unit tests (with JEST), including code coverage /coverage
- Code documentation with JSDOC /docs
- CORS for localhost and 127.0.0.1
- Enhanced logging in development environment
- GitHub Pages for this doco
- Docker support
- Multi-environment support for dev and prod
- GitHub Workflows 
  - Docker image build on push with tags
  - Docker Hub `:latest` and `:n` incrementing docker images
  - GitHub pages build on push
  - Unit test execute on push
  - Copy GitHub doco to DockerHub 

### Run scripts

- `npm run prod` - Runs app using `.envprod` values, specific idempotency options, minimal logging, and hidden error stacktraces.
- `npm run dev` - Runs app using `.env` values
- `npm run doc` - Creates JSDoc doco in /docs
- `npm run test` - Runs unit tests with coverage report /coverage

### Server-side implementation

- house showcase CRUD
- pricing R
- companies R

### Custom middleware

- Sanitiser - removes prohibitted characters from requests
- ErrorMiddleware - only allows error stacktraces to be visible in a development environment
- Idempotency - uses stored tokens to manage non-idempotent methods (e.g Post)

### Install

Clone repo and run `npm i` from the project folder


