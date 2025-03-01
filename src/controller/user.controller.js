import { User } from "../models/User.model.js";
import { hashPassword } from "../services/auth/hash.service.js";

/* export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(201).json({
            message: 'Succeess! User Created 🦆',
            status: 201,
            data: user
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Cannot create user ❌',
            status: 500,
            data: null
        })
    }
};

// update user by id, unless is GlobalAdmin
export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Prevent role modification unless by a globalAdmin
        if (updateData.role && req.user.role !== "globalAdmin") {
            return res.status(403).json({
                message: "You cannot modify roles ❌",
                status: 403
            });
        }

        //if passeworld is provided, hash it
        if (updateData.password) {
            updateData.password = await hashPassword(updateData.password);  // hash password
        }

        const [updateRows, [updatedUser]] = await User.update(updateData, {
            where: { id },
            returning: true,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        });

        // if user not found, send error
        if (updateRows === 0) {
            throw new Error(`User: ${id} not found`);
        }

        res.status(200).json({
            message: "User updated successfully 🎉",
            status: 200,
            newData: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

// delete user by id, unless is GlobalAdmin
export const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const userToDelete = await User.findByPk(id);

        if (!userToDelete) {
            return res.status(404).json({
                message: "User not found ❌",
                status: 404
            });
        }

        const globalAdmins = await User.count({ where: { role: "globalAdmin" } });

        if (userToDelete.role === "globalAdmin" && globalAdmins <= 1) {
            return res.status(403).json({
                message: "You cannot delete the last globalAdmin ❌",
                status: 403
            });
        }

        await User.destroy({ where: { id } });

        res.status(200).json({
            message: "User deleted successfully ⚰",
            status: 200
        });

    } catch (error) {
        res.status(500).json({
            message: "User wasn't deleted ❌",
            status: 500
        });
    }
};

//This should be show all user's post logs for update or delete
export const findPostByUser = async (req, res) => {
    /* write code here */
/* ;

export const findAll = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "email", "role"]
        });

        if (users.length === 0) {
            return res.status(404).json({
                message: "No users found 👀",
                status: 404,
                data: null,
            });
        }

        res.status(200).json({
            message: "users successfuly found 🤞",
            status: 200,
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Cannot get other users 🤔",
            status: 500,
            data: null,
        });
    }
};
 */ 



/**
 * Create a new user (Admin or GlobalAdmin)
 */
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const requestingUser = req.user; // Extract logged-in user from middleware

        // Only GlobalAdmins can create a GlobalAdmin
        if (role === "GlobalAdmin" && requestingUser.role !== "GlobalAdmin") {
            return res.status(403).json({ message: "Unauthorized: Only GlobalAdmins can create another GlobalAdmin." });
        }

        // Admins can only create other Admins
        if (requestingUser.role === "Admin" && role !== "Admin") {
            return res.status(403).json({ message: "Unauthorized: Admins can only create other Admins." });
        }

        const newUser = await User.create({ name, email, password, role });
        return res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
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
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent Admin from modifying roles
        if (role && requestingUser.role !== "globalAdmin") {
            return res.status(403).json({ message: "You cannot modify roles ❌" });
        }

        // Hash the password if provided
        if (password) {
            updateData.password = await hashPassword(password);
        }

        // GlobalAdmin can update any user
        if (requestingUser.role === "globalAdmin") {
            await userToUpdate.update(updateData);
            return res.status(200).json({ message: "User updated successfully 🎉", user: userToUpdate });
        }

        // Admin can update only other Admins (excluding role changes)
        if (requestingUser.role === "admin" && userToUpdate.role === "admin") {
            await userToUpdate.update(updateData);
            return res.status(200).json({ message: "User updated successfully 🎉", user: userToUpdate });
        }

        // If none of the conditions match, deny access
        return res.status(403).json({ message: "Unauthorized: You can't modify this user." });

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
