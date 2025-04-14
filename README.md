# AI Application Assistant

An intelligent tool that helps job seekers generate personalized application responses using AI.

## Features

- Upload your resume (PDF format)
- Enter job details and company information
- Generate tailored responses for:
  - Interest in the company
  - Cover letter
  - Why you're a good fit
  - Value you'll bring
  - LinkedIn message
  - Short-form answers
  - Interview preparation questions
- View, copy, and regenerate responses
- Save and manage response history

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **UI**: Tailwind CSS 4 with DaisyUI and Shadcn UI components
- **AI**: AI SDK with Groq LLama 3.3 model for response generation
- **PDF Processing**: pdf-parse for resume extraction
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: Zustand for global state
- **File Upload**: React Dropzone
- **Notifications**: React Hot Toast

## Getting Started

First, run the development server with Turbopack for faster development:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

1. Users upload their resume (PDF) and enter job details
2. The `/api/parse-resume` endpoint extracts text from the resume PDF
3. The extracted text is structured using AI
4. The `/api/generate` endpoint uses Groq's LLama 3.3 model to create personalized application responses
5. Users can copy, regenerate, and save these responses
6. All responses are saved to history for future reference

## Project Structure

- `/app`: Next.js App Router pages and API routes
  - `/api`: Backend API endpoints for resume parsing, response generation, and regeneration
  - `/history`: View saved application responses
  - `/response/[id]`: View individual response details with regeneration capability
- `/components`: UI components including forms, response sections, and layout elements
- `/lib`: Utility functions, types, and schemas
- `/public`: Static assets

## Development

This project uses:

- TypeScript for type safety
- ESLint for code quality
- Turbopack for fast development builds
- Tailwind CSS for styling with custom theme configuration

## Deployment

Deploy on Vercel for the best experience:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRithb898%2Fai-application-assistant)
