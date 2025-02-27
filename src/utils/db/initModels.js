import { initializeUser } from "../../models/User.model.js"
import { InternalServerError } from "../../errors/TypeError.js"

export const initModels = (config) => {
    try {
        initializeUser(config)
        console.log('Models initialized successfully! 🎩🦆')
    } catch (error) {
        throw new InternalServerError('Error initializing models 🛑', 500, error)
    }
}