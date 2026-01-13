// Import Request & Response types from Express
// These give proper TypeScript typing for req and res
// Interview (Theory):
// 1) Why do we import Request & Response explicitly?
// 2) What happens if we don’t type req and res in TS?
import { Request, Response } from 'express';
import 'express-session';
// Import User Mongoose model
// This model represents the users collection in MongoDB
// Interview (Theory):
// 3) What is a Mongoose model?
// 4) Difference between Schema and Model?
import User from '../models/user.model.js';
import session from 'express-session';

// bcryptjs is used for hashing passwords
// Never store plain-text passwords
// Interview (Theory):
// 5) Why is bcrypt preferred over SHA256?
// 6) What is salting in password hashing?
import bcrypt from 'bcryptjs';

// Types from mongoose (ObjectId, etc.)
// Interview (Theory):
// 7) What is ObjectId in MongoDB?
// 8) Why are ObjectIds preferred over auto-increment IDs?
import { Types } from 'mongoose';


// =======================
// REGISTER CONTROLLER
// =======================

// This function handles user registration
// Interview (Theory):
// 9) Why should controllers be async?
// 10) What happens if we forget await inside async function?
export const register = async (req: Request, res: Response) => {
    try {

        // Extract name, email, password from request body
        // Interview (Theory):
// 11) From where does req.body come?
// 12) What middleware is required to use req.body?
        const { name, email, password } = req.body;

        // Input validation
        // Interview (Theory):
// 13) Why should validation happen at controller level?
// 14) Why is client-side validation not enough?
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        // Interview (Theory):
// 15) Why should email be unique?
// 16) Should this check also exist at DB level?
        const user = await User.findOne({ email });

        // If user exists, block registration
        // Interview (Theory):
// 17) Why return immediately after sending response?
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate salt for bcrypt hashing
        // Higher rounds = more security but slower
        // Interview (Theory):
// 18) What does genSalt(10) mean?
// 19) What happens if salt rounds are too high?
        const salt = await bcrypt.genSalt(10);

        // Hash the password using bcrypt
        // Interview (Theory):
// 20) Can hashed passwords be decrypted?
// 21) How does bcrypt prevent rainbow table attacks?
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user document
        // Interview (Theory):
// 22) Difference between new User() and User.create()?
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save user to database
        // Interview (Theory):
// 23) What happens internally when save() is called?
// 24) What errors can occur during save()?
        await newUser.save();

        // =======================
        // SESSION HANDLING
        // =======================

        // Mark user as logged in
        // Interview (Theory):
// 25) Where is session data stored?
// 26) Why don’t we store session data in JWT?
        req.session.isLoggedIn = true;

        // Store userId in session
        // Interview (Theory):
// 27) Why store userId instead of full user object?
// 28) How does session survive across requests?
        req.session.userId = newUser._id;

        // Send success response (never send password)
        // Interview (Theory):
// 29) Why should password never be returned in response?
// 30) What is the ideal response structure for auth APIs?
        return res.json({
            message: 'User registered successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error: any) {

        // Error logging
        // Interview (Theory):
// 31) Why should internal errors not be exposed to client?
// 32) Difference between operational error and programmer error?
        console.error('Error during registration:', error);

        return res.status(500).json({ message: 'Internal server error' });
    }
};



// =======================
// CODING / SCENARIO QUESTIONS
// =======================

// 🔹 Q1: Add email format validation using regex
// 🔹 Q2: Add password strength validation (min length, special char)
// 🔹 Q3: Prevent duplicate users using MongoDB unique index
// 🔹 Q4: Convert this to use asyncHandler middleware
// 🔹 Q5: Implement register + auto-login using JWT instead of session
// 🔹 Q6: What happens if two requests register same email simultaneously?
// 🔹 Q7: Add email verification before allowing login
// 🔹 Q8: Add rate limiting to prevent brute-force registration
// 🔹 Q9: How would you hash passwords using Argon2 instead of bcrypt?
// 🔹 Q10: Modify this controller to work in a microservices architecture
// 🔹 Q11: How would you log registration attempts for analytics


// Import Express request/response types
// Interview (Theory):
// 1) Why should controllers be typed in TypeScript?
// 2) What benefits do typed req/res provide?


// Import User mongoose model
// Interview (Theory):
// 3) How does Mongoose map MongoDB documents to JS objects?


// bcrypt is used to compare hashed passwords
// Interview (Theory):
// 4) Why do we never compare passwords directly?
// 5) How does bcrypt.compare work internally?



// =======================
// LOGIN CONTROLLER
// =======================

// Handles user login
// Interview (Theory):
// 6) Why should login endpoint be POST instead of GET?
// 7) Why should login logic be inside try/catch?
export const loginuser = async (req: Request, res: Response) => {
    try {

        // Extract email and password from request body
        // Interview (Theory):
// 8) What middleware is required for req.body?
// 9) What happens if client sends malformed JSON?
        const { email, password } = req.body;

        // Validate input
        // Interview (Theory):
// 10) Why should validation happen before DB query?
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find user by email
        // Interview (Theory):
// 11) Why do we query by email and not username?
// 12) What is the time complexity of findOne with index?
        const user = await User.findOne({ email });

        // If user not found
        // Interview (Theory):
// 13) Why return same error for "user not found" and "wrong password"?
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare entered password with stored hashed password
        // Interview (Theory):
// 14) Why does bcrypt.compare return boolean?
// 15) Can bcrypt.compare be reversed?
        const comparepassword = await bcrypt.compare(
            password,
            user.password as string
        );

        // Password mismatch
        if (!comparepassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // =======================
        // SESSION SETUP
        // =======================

        // Mark user as authenticated
        // Interview (Theory):
// 16) What data should be stored in session?
// 17) Why not store password in session?
        req.session.isLoggedIn = true;

        // Store userId for future requests
        // Interview (Theory):
// 18) How does session persist between requests?
// 19) Where is session ID stored in browser?
        req.session.userId = user._id;

        // Send response (never send password)
        // Interview (Theory):
// 20) Why should sensitive fields be excluded?
// 21) What is DTO (Data Transfer Object)?
        return res.json({
            message: 'User logged in successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        // Server error handling
        // Interview (Theory):
// 22) Why not expose error stack to client?
// 23) Difference between 400 and 500 errors?
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// =======================
// LOGOUT CONTROLLER
// =======================

// Handles user logout
// Interview (Theory):
// 24) Why is logout a POST request?
// 25) Why does logout require authentication?
export const logoutuser = async (req: Request, res: Response) => {
    try {

        // Destroy session on server
        // Interview (Theory):
// 26) What happens internally when session.destroy is called?
// 27) Does this remove session from DB immediately?
        req.session.destroy((err: any) => {

            // If error occurs while destroying session
            if (err) {
                console.error('Error during logout:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // Clear session cookie from browser
            // Interview (Theory):
// 28) What is connect.sid?
// 29) Why must cookie be cleared after destroying session?
            res.clearCookie('connect.sid');

            return res.json({ message: 'User logged out successfully' });
        });

    } catch (error) {

        // Catch unexpected errors
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default { loginuser, logoutuser , register };


// =======================
// CODING / SCENARIO QUESTIONS
// =======================

// 🔹 Q1: Add login rate-limiting to prevent brute-force attacks
// 🔹 Q2: Implement account lock after 5 failed login attempts
// 🔹 Q3: Add refresh-session logic on every request
// 🔹 Q4: Convert this login flow to JWT-based authentication
// 🔹 Q5: Implement "remember me" functionality
// 🔹 Q6: Add device-based session tracking
// 🔹 Q7: How would you invalidate all sessions for a user?
// 🔹 Q8: How does logout work differently in JWT vs session?
// 🔹 Q9: Add CSRF protection to logout endpoint
// 🔹 Q10: Secure this endpoint for production deployment
