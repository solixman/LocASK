# ProSets Workspace

This is a NestJS monorepo application using Prisma for database management and microservices architecture.

## Prerequisites

Before starting, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [PostgreSQL](https://www.postgresql.org/) (running locally or accessible via URL)

## Installation

1.  **Clone the repository** (if you haven't already).

    ```
    git clone https://github.com/solixman/google-Oauth-nest-microservices.git
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Configuration

1.  **Environment Variables**:
    Create a `.env` file in the root directory. You can use the following example as a template:

    ```env
    # Database Connection
    # Replace user, password, localhost:5432, and db_name with your actual PostgreSQL credentials
    DATABASE_URL="postgresql://postgres:password@localhost:5432/auth_db?schema=public"

    # Security
    JWT_SECRET="your_super_secret_jwt_key"



    # you should get the client id from the google console:


    Go to Google Cloud Console
    . https://console.cloud.google.com/welcome

    Create a new project (or select an existing one).

    Navigate to APIs & Services → Credentials.

    Click Create Credentials → OAuth client ID.

    Choose Web application and add an authorized redirect URI (e.g. https://developers.google.com/oauthplayground for testing).

    Copy the Client ID, then add it to your .env:
    GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"



    # Application Port
    PORT=4000
    ```

2. **Database Setup**:
    Initialize the database schema using TypeORM and environment config.

    - Set DB connection string in `.env`:
      - `AUTH_DB_URL=postgresql://postgres:123123@localhost:5432/LocAsk_auth`
      - `QUESTIONS_DB_URL=postgresql://postgres:123123@localhost:5432/LocAsk_questions`
      - `ANSWERS_DB_URL=postgresql://postgres:123123@localhost:5432/LocAsk_answers`

    - In each microservice (`apps/auth`, `apps/questions-service`, `apps/answers-service`), the module is already configured with `TypeOrmModule.forRoot(...)` and `autoLoadEntities: true`.
    - TypeORM schema synchronization is enabled in development (`synchronize: true`).

    - Ensure PostgreSQL is running and databases exist (create manually or with SQL):
      ```sql
      CREATE DATABASE "LocAsk_auth";
      CREATE DATABASE "LocAsk_questions";
      CREATE DATABASE "LocAsk_answers";
      ```

    - Run services (TypeORM will auto-create tables):
      ```bash
      npm run start:auth
      npm run start:questions-service
      npm run start:answers-service
      ```

    - If you want migrations later, generate with `typeorm migration:generate` commands.
    


## Running the Application

This project consists of multiple services. You will need to run them in separate terminals and both from root.

**1. API Gateway** (Main Entry Point)
```bash
npm run build api-gateway

npm run start:dev api-gateway
```
The gateway typically runs on `http://localhost:4000`.

**2. Auth Service**
```bash
npm run build auth

npm run start:dev auth

```
#  the ":dev" si optional and for debugging only you can run

```bash
npm run start auth 
```







# I got the calculate distance with lat & lon logic from:
.https://www.movable-type.co.uk/scripts/latlong.html