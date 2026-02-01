# LocASK - Local Community Q&A Platform

LocASK is a modern, microservices-based platform that allows users to ask and answer questions based on their geographic location. It features a Next.js frontend and a NestJS backend architecture with specialized microservices.

## 🏗️ Architecture

- **Front-end**: Next.js 15+ (React 19) with Tailwind CSS.
- **API Gateway**: Entry point for all HTTP requests, routing to microservices.
- **Auth Service**: Handles user registration, login, and Google OAuth.
- **Questions Service**: Manages local questions, location-based filtering, and likes.
- **Answers Service**: Manages answers for specific questions.
- **Database**: PostgreSQL with Prisma ORM (Separate DBs for each service).

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ 
- **npm**: v9+
- **PostgreSQL**: Running instance (Local or Cloud)
- **Prisma**: !!!!!!!! IMPORTANT   V7+  IMPORTANT !!!!!!!!

### 2. Global Installation
Clone the repository and install dependencies in both main folders:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../front-end
npm install
```

---

## ⚙️ Backend Setup

### 1. Environment Variables
Create a `.env` file in the `backend/` directory using the following values:

```env
# Database URLs (One for each service) 
AUTH_DB_URL="postgresql://user:pass@localhost:5555/locask_auth_db"
QUESTIONS_DB_URL="postgresql://user:pass@localhost:5555/locask_questions_db"
ANSWERS_DB_URL="postgresql://user:pass@localhost:5555/locask_answers_db"

#!!! note that the databases should be already made and empty and here's the prisma docs 
.https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres


# Security
JWT_SECRET="your_secret_key"
GOOGLE_CLIENT_ID="your_google_id.apps.googleusercontent.com"

# API Port (api-gateway)
PORT=4000
```

### 2. Database Migrations
Run migrations for each microservice from the `backend/` directory:
!!!!!! make sure you use v7+ for prisma  


```bash
# Auth Service
npx prisma migrate dev --name init --schema=apps/auth/prisma/schema.prisma

# Questions Service
npx prisma migrate dev --name init --schema=apps/questions-service/prisma/schema.prisma

# Answers Service
npx prisma migrate dev --name init --schema=apps/answers-service/prisma/schema.prisma
```


### 3. Running the Backend
You need to run the Gateway and all Microservices. Open separate terminals in `backend/`:

```bash
# Terminal 1: API Gateway
npm run start:dev api-gateway

# Terminal 2: Auth Service
npm run start:dev auth

# Terminal 3: Questions Service
npm run start:dev questions-service

# Terminal 4: Answers Service
npm run start:dev answers-service
```

---

## 🎨 Frontend Setup

### 1. Running the Frontend
Navigate to the `front-end/` directory and start the development server:

```bash
cd front-end
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tech Stack Features
- **Location-Based Filtering**: The backend uses the Haversine formula to sort questions by proximity to the user.
- **Google OAuth**: Integrated with `@react-oauth/google` for seamless social login.
- **Microservices Communication**: Services communicate via TCP using NestJS `ClientProxy`.
- **Responsive Design**: Fully optimized for mobile and desktop using modern CSS/Tailwind.

## 🗺️ Credits
- **Distance Logic**: Based on [Movable Type Scripts](https://www.movable-type.co.uk/scripts/latlong.html) for latitude/longitude calculations.










note: I have been too bussy i made this in a day and a half, I can't continue working on it for the
 next days cause  I need to be working on a the 2nd exam project of the year from monday, I really 
 wish i could perfect this. 


SOLIXMAN.