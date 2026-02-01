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

2.  **Database Setup**:
    Initialize the database schema using Prisma.

    ```bash
    # Generate Prisma Client
    npx prisma generate --schema=apps/auth/prisma/schema.prisma

    # Create tables and run migrations
    ```
    npx prisma migrate dev --name init --schema=apps/auth/prisma/schema.prisma
    # note that the db should be already reated and empty to migrate and the scheema is for a specific project so please modify it as needed  
     
    #!!!!! the prisma version should be 7.3 the 6.19.2 will not work !!!!!
    #!!!!! the prisma version should be 7.3 the 6.19.2 will not work !!!!!
    #!!!!! the prisma version should be 7.3 the 6.19.2 will not work !!!!!
    

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