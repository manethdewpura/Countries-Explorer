# Countries Explorer

A modern web application for exploring country information, built with React, Redux, Firebase, and Tailwind CSS.

**Hosted On:** [https://countries-app-841aa.web.app/](https://countries-app-841aa.web.app/)

## Features

- Search and filter countries by name, region, and language
- Sort countries by name or population
- View detailed information about each country
- Compare up to 3 countries side by side
- Dark/Light theme with system preference support
- User login with Firebase
- Save favorite countries (requires login)
- Recently viewed countries history
- Responsive design for all device sizes

## Prerequisites

- Node.js (v16 or higher)
- NPM (v8 or higher)
- Firebase account and project

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-manethdewpura.git
cd af-2-manethdewpura
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore services
   - Copy your Firebase configuration from Project Settings
   - Update the configuration in `src/firebase.js`

## Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3005`

## Testing

Run the test suite:
```bash
npm run test
```

Run tests in watch mode during development:
```bash
npm run test:watch
```

Generate test coverage report:
```bash
npm run test:coverage
```

Coverage reports will be generated in the `coverage` directory.

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Deployment

The application is configured for deployment to Firebase Hosting:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase (if not already done):
```bash
firebase init hosting
```

4. Deploy the application:
```bash
firebase deploy
```

## Technologies Used

- React
- Redux
- Firebase (Authentication, Firestore & Hosting)
- Tailwind CSS
- Vite