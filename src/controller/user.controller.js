import { User } from "../models/User.model.js";
import { hashPassword } from "../services/auth/hash.service.js";


/**
 * Create a new user (Admin or GlobalAdmin)
 */
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const requestingUser = req.user; // Extract logged-in user from middleware

        // Only GlobalAdmins can create a GlobalAdmin
        if (role === "GlobalAdmin" && requestingUser.role !== "GlobalAdmin") {
            return res.status(403).json({ 
                message: "Unauthorized: Only GlobalAdmins can create another GlobalAdmin." });
        }

        // Admins can only create other Admins
        if (requestingUser.role === "Admin" && role !== "Admin") {
            return res.status(403).json({       
                message: "Unauthorized: Admins can only create other Admins." });
        }

        const newUser = await User.create(
            { 
                name,
                email,
                password: await hashPassword(password),
                role
            });
        return res.status(201).json({ 
            message: "User created successfully", 
            user: newUser 
        });

    } catch (error) {
        return res.status(500).json({ 
            message: "Server error", error: error.message });
    }
};

/**
 * Get all Admins (Admins & GlobalAdmins)
 */
export const getAdmins = async (req, res) => {
    try {
        const admins = await User.findAll({
            where: { role: ["admin", "globalAdmin"] }, // Filter only Admins & GlobalAdmins
            attributes: { exclude: ["password"] } // Exclude password for security
        });
        return res.status(200).json(admins);

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * Update an Admin's details (Admins can only update other Admins)
 */
export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role, password, ...updateData } = req.body; // Extract role & password separately
        const requestingUser = req.user; // The logged-in user from middleware

        const userToUpdate = await User.findByPk(id);
        if (!userToUpdate) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        // Prevent Admin from modifying roles
        if (role && requestingUser.role !== "globalAdmin") {
            return res.status(403).json({ 
                message: "You cannot modify roles ❌" 
            });
        }

        // Hash the password if provided
        if (password) {
            updateData.password = await hashPassword(password);
        }

        // GlobalAdmin can update any user
        if (requestingUser.role === "globalAdmin") {
            await userToUpdate.update(updateData);
            return res.status(200).json({ 
                message: "User updated successfully 🎉", 
                user: userToUpdate 
            });
        }

        // Admin can update only other Admins (excluding role changes)
        if (requestingUser.role === "admin" && userToUpdate.role === "admin") {
            await userToUpdate.update(updateData);
            return res.status(200).json({ 
                message: "User updated successfully 🎉", user: userToUpdate 
            });
        }

        // If none of the conditions match, deny access
        return res.status(403).json({ 
            message: "Unauthorized: You can't modify this user." 
        });

    } catch (error) {
        next(error);
    }
};


/**
 * Delete an Admin (Admins can only delete other Admins)
 */
export const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUser = req.user; // Logged-in user from middleware

        const userToDelete = await User.findByPk(id);
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }

        // GlobalAdmin can delete anyone
        if (requestingUser.role === "globalAdmin") {
            await userToDelete.destroy();
            return res.status(200).json({ message: "User deleted successfully" });
        }

        // Admins can only delete other Admins
        if (requestingUser.role === "Admin" && userToDelete.role === "Admin") {
            await userToDelete.destroy();
            return res.status(200).json({ message: "User deleted successfully" });
        }

        return res.status(403).json({ message: "Unauthorized: You can't delete this user." });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * Find posts by user (Both Admins & GlobalAdmins can view posts)
 */
export const findPostByUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, { include: "posts" }); // Assuming a relation with posts

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ posts: user.posts });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
