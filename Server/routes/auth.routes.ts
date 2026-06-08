import  express  from "express";
import {register,loginuser,logoutuser,verifyuser} from '../controllers/auth.controllers.js';
import protect from "../middlewares/auth.middleware.js";

const authrouter = express.Router();

// Route: GET /auth/verify
authrouter.get('/verify', verifyuser);

// Route: POST /auth/login
authrouter.post('/login', loginuser);

// Route: POST /auth/logout
authrouter.post('/logout', protect, logoutuser);

// Route: POST /auth/register
authrouter.post('/register', register); 

export default authrouter