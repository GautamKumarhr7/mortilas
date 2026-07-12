# CRM API Project

A layered API project built using Node.js, Express, TypeScript, PostgreSQL, and Drizzle ORM.

## Project Architecture

This project follows an Object-Oriented, layered architecture:
- **Models** (\`src/models\`): Drizzle ORM schemas.
- **Repositories** (\`src/repositories\`): Classes handling direct database CRUD interactions.
- **Services** (\`src/services\`): Classes handling core business logic.
- **Controllers** (\`src/controllers\`): Classes handling Express requests and responses.
- **Routers** (\`src/routers\`): Express route definitions mapped to controllers.
- **Middlewares** (\`src/middlewares\`): Express middlewares for error handling, validation, etc.

## Prerequisites

- Node.js (v18+)
- PostgreSQL Database

## Getting Started

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**
   Ensure you have a \`.env\` file in the root of the project with the following (update with your actual DB credentials):
   \`\`\`env
   DATABASE_URL=postgres://user:password@localhost:5432/crm_db
   PORT=3000
   \`\`\`

3. **Start the Development Server**
   Runs the server using \`tsx\` with hot-reloading:
   \`\`\`bash
   npm run dev
   \`\`\`

## Database Migrations (Drizzle)

This project uses Drizzle ORM. Database schemas are defined in \`src/models\`.

- **Generating a Migration**: Whenever you add a new model or change an existing schema in \`src/models\`, run:
  \`\`\`bash
  npm run generate
  \`\`\`
  This creates a new \`.sql\` file in the \`drizzle/\` directory representing your changes.

- **Applying a Migration**: To apply these \`.sql\` files to your actual PostgreSQL database, run:
  \`\`\`bash
  npm run migrate
  \`\`\`

## Build, Types, and Compilation

Because we are using TypeScript, you have a few tools available to verify and compile your code.

- **Type Checking (No Compilation)**
  If you want to verify that your code doesn't have any TypeScript errors without actually building the \`dist\` folder, run:
  \`\`\`bash
  npx tsc --noEmit
  \`\`\`
  *You should run this before committing your code to ensure type safety.*

- **Building for Production**
  To compile the TypeScript code into pure ES Modules JavaScript (placed in the \`dist/\` directory), run:
  \`\`\`bash
  npm run build
  \`\`\`

- **Starting Production Build**
  To run the compiled JavaScript code:
  \`\`\`bash
  npm run start
  \`\`\`

## Types

We have added a \`src/types/env.d.ts\` file to provide strict typing for the \`process.env\` variables. If you add new environment variables to your \`.env\` file, make sure to add their types in \`env.d.ts\` so the TypeScript compiler recognizes them properly across the codebase!
