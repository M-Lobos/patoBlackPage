import { User } from "../models/User.model.js";
import { hashPassword } from "../services/auth/hash.service.js"; 
import { registerService } from '../services/auth/register.service.js';
import { loginService } from '../services/auth/login.service.js';
import { AuthError } from "../errors/TypeError.js";

export const createUser = async (req, res) => {
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
};

