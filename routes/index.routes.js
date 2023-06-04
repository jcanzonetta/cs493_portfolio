// eslint-disable-next-line new-cap
import express from 'express';
import {router as controllers} from '../controllers/index.controllers.js';
import boats from '../controllers/boats.controllers.js';
import users from '../controllers/users.controllers.js';
import loads from '../controllers/loads.controllers.js';

// eslint-disable-next-line new-cap
const router = express.Router();

router.use('/', controllers);
router.use('/boats', boats);
router.use('/loads', loads);
router.use('/users', users);

export default router;
