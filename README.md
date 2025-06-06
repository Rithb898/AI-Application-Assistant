# FitForJob - AI Application Assistant

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
- User authentication with Clerk

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **UI**: Tailwind CSS 4 with Shadcn UI components
- **AI**: AI SDK with Groq Deepsheek ,LLama 3.3 model for response generation
- **PDF Processing**: pdf-parse for resume extraction
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: Local storage and MongoDB for persistence
- **Authentication**: Clerk for user management
- **File Upload**: React Dropzone
- **Notifications**: React Hot Toast and Sonner
- **Animation**: Motion library for UI animations
- **Analytics**: PostHog for usage tracking
- **Database**: MongoDB for storing user data and responses

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/YourUsername/fitforjob.git
cd fitforjob
npm install
# or
pnpm install
# or
yarn install
```

Create a `.env.local` file in the root directory with the following variables:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Groq API
GROQ_API_KEY=your_groq_api_key

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
```

Then, run the development server with Turbopack for faster development:

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
2. The `/api/parse-resume` endpoint extracts text from the resume PDF using pdf-parse
3. The extracted text is structured using Groq's LLama 3.1 model
4. The `/api/generate` endpoint uses Groq's LLama 3.3 model to create personalized application responses
5. Users can copy, regenerate, and save these responses
6. All responses are saved to local storage and MongoDB for authenticated users

## Project Structure

- `/app`: Next.js App Router pages and API routes
  - `/api`: Backend API endpoints for resume parsing, response generation, and regeneration
  - `/api/webhooks`: Webhook handlers for Clerk authentication
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
- MongoDB for database storage
- Firebase for additional storage options

## Deployment

Deploy on Vercel for the best experience:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYourUsername%2Ffitforjob)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
