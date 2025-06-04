import User from "../models/User.js";

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email: email });
        if (existingUser) return res.status(400).json({message: "User already exists"});
        const user = new User({username, email, password});
        await user.save()
        return res.status(201).json({message: "signup successful"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email: email }).select('+password');
        if (!existingUser) return res.status(400).json({message: "User does not exists"});
        const isPasswordValid = await existingUser.comparePassword(password);
        if (!isPasswordValid) return res.status(400).json({message: "Invalid email or password"});
        return res.status(200).json({
            message: 'Login successful',
            success: true,
            user: existingUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
