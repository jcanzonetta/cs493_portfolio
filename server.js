import express from 'express';
import routes from './routes/index.routes.js';
const app = express();

app.enable('trust proxy');
app.use('/', routes);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
