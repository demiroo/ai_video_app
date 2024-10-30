# Next.js/Revideo AI Video Generator SaaS app Boilerplate

A ready-to-use boilerplate for building AI-powered video generation apps using Next.js and [Revideo](https://re.video/). It’s designed for seamless content creation, supporting dynamic video generation and customization. Perfect for developers building SaaS platforms with scalable, high-performance video generation capabilities.

## Getting Started

### Installation

1. Install the dependencies in both the frontend and backend directories:

```bash
(cd frontend && npm install) &&
(cd backend && npm install)
```

2. In frontend directory, rename the sample.env.local to .env.local and add your OpenAI API key, Redis URL and Base URL.
   
   ```bash
   OPENAI_API_KEY=your_openai_api_key
   REDIS_URL=your_redis_url
   NEXT_PUBLIC_BASE_URL=your_base_url
   ```


3. Then, serve the Revideo project using the CLI:

```bash
(cd backend && npx revideo serve)
```

4. Now you can start your NextJS app using the following command:

```bash
(cd frontend && npm run dev)
```

5. Open http://localhost:3000/dashboard with your browser to see the result. Happy developing!
