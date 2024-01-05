<<<<<<< HEAD
# Serwis-Y
=======
# Service 'Y'

A twitter-like application made for a university subject.

## Tech Stack

**Client:** Vue

**Server:** Node.js

**Database:** MongoDB

## Run Locally

Start the database

```bash
  docker compose up -d
```

Launch client app and install dependencies if you haven't already

```bash
  cd frontend
  npm install
  npm run dev
```

Launch server app and install dependencies if you haven't already

```bash
  cd backend
  npm install
  npm run start
```

The app is now accessible on http://localhost:5173/.

If it doesn't work make sure to visit https://localhost:PORT/ first and agree to using self-signed SSL certificate.

## Environment Variables

To run this project, you will need to add the following environment variables to your:

- frontend/src/env.js file

```javascript
export const environment = {
  backendUrl,
};
```

- backend/.env file

```
PORT
PASSPHRASE
SECRET
FRONTEND_URL
```
>>>>>>> abb8df7 (General refactor)
