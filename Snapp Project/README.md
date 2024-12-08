# Snapp - AI Fashion Discovery

Snapp is an AI-powered fashion discovery platform that helps users find and shop similar clothing styles instantly. Simply take a photo of any clothing item you love, and our advanced AI will analyze it to find matching styles from thousands of products across multiple stores.

## Features

- 📸 Instant photo analysis
- 🔍 AI-powered visual search
- 🛍️ Multi-store price comparison
- 🎯 Real-time style matching
- 📱 Mobile-first design
- 🌐 Multi-language support
- 🔄 Cross-browser compatibility

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Framer Motion
  - i18next

- **Backend Services:**
  - AWS Rekognition
  - AWS S3
  - Redis
  - PostgreSQL
  - Express.js

- **Infrastructure:**
  - Docker
  - Kubernetes
  - Netlify (Frontend Hosting)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/deviljin17/snapp.git
   cd snapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your AWS credentials:
   ```
   VITE_AWS_REGION=your_region
   VITE_AWS_ACCESS_KEY_ID=your_access_key
   VITE_AWS_SECRET_ACCESS_KEY=your_secret_key
   VITE_AWS_S3_BUCKET=your_bucket_name
   DATABASE_URL=your_database_url
   REDIS_URL=your_redis_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- **Frontend Development:**
  ```bash
  npm run dev
  ```

- **Build for Production:**
  ```bash
  npm run build
  ```

- **Docker Development:**
  ```bash
  docker-compose up
  ```

## Testing

Run the test suite:
```bash
npm run test
```

## Deployment

The application is automatically deployed to Netlify when changes are pushed to the main branch.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a Pull Request.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/deviljin17/snapp/issues).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.