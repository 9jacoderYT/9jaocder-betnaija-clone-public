# Project Setup Guide

This guide provides step-by-step instructions to set up the project, including configuring the database, obtaining API keys, and setting up environment variables. Follow the steps below to get started.

## Prerequisites

Before you begin, ensure you have the following:
- A code editor (e.g., VS Code)
- Node.js installed
- A Telegram account (for BotFather)
- A Vercel account (optional, for deployment)
- A Firebase account (for Firebase configuration)

## Step 1: Set Up the Database

1. Visit the YouTube channel 9jaCoder (https://www.youtube.com/@9jaCoder).
2. Watch the video tutorial on setting up the database for this project.
3. Follow the instructions provided in the video to configure your database.

## Step 2: Obtain API Keys

### The Odds API
1. Go to https://the-odds-api.com/ and sign up for a free account.
2. Generate your API key and copy it for later use.

### Telegram Bot Token
1. Open Telegram and search for @BotFather.
2. Follow the instructions in the 9jaCoder video (https://www.youtube.com/@9jaCoder) on setting up a Telegram bot.
3. Obtain your TELEGRAM_BOT_TOKEN from BotFather.
4. Note the bot's name for the NEXT_PUBLIC_TELEGRAM_BOT_NAME variable.

### Firebase Configuration
1. Log in to your Firebase Console (https://console.firebase.google.com/).
2. Create a new Firebase project or use an existing one.
3. Navigate to Project Settings and copy the following configuration details:
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID

## Step 3: Configure Environment Variables

1. In the root of your project, create a file named .env.local.
2. Add the following environment variables to the .env.local file, replacing the placeholders with the values you obtained:

TELEGRAM_BOT_TOKEN=your-telegram-bot-token
ODDS_API_KEY=your-odds-api-key
NEXT_PUBLIC_TELEGRAM_BOT_NAME=your-telegram-bot-name

NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id

3. Save the .env.local file and ensure it is added to your .gitignore to prevent sensitive information from being pushed to version control.

## Step 4: Deploying to Vercel (Optional)

If you are deploying the project on Vercel, follow these steps:

1. Log in to your Vercel dashboard (https://vercel.com/).
2. Create a new project and link it to your repository.
3. During the setup process, navigate to the Environment Variables section.
4. Add the same variables listed in Step 3 to the Vercel environment variables section.
5. Complete the deployment process as instructed by Vercel.

## Step 5: Run the Project Locally

1. Install project dependencies by running:
   npm install
2. Start the development server:
   npm run dev
3. Open your browser and navigate to http://localhost:3000 to view the project.

## Troubleshooting

- Database Issues: Ensure you followed the database setup steps in the 9jaCoder video (https://www.youtube.com/@9jaCoder).
- API Key Errors: Double-check that your API keys are correct and properly pasted in the .env.local file.
- Vercel Deployment: Verify that environment variables are correctly configured in the Vercel dashboard.

## Additional Resources

- The Odds API Documentation: https://the-odds-api.com/
- Telegram BotFather Guide: https://core.telegram.org/bots#6-botfather
- Firebase Documentation: https://firebase.google.com/docs
- Vercel Documentation: https://vercel.com/docs

For further assistance, refer to the tutorials on the 9jaCoder YouTube channel (https://www.youtube.com/@9jaCoder). You can also message me for help on Telegram (@YT_9jacoder) or Instagram (@9jacoder).