import Joi from "joi";
import BaseDTO from "../../common/DTO/base.dto.js";

class LoginDTO extends BaseDTO {
    static schema = Joi.object({
        email: Joi.string().trim().lowercase().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email",
            "any.required": "Email is required",
        }),
        password: Joi.string().min(8).max(99).required()
            .messages({
                "string.empty": "Password is required",
                "string.min": "Password must contain at least 8 characters",
                "string.max": "Password must not exceed 128 characters",
                "any.required": "Password is required",
            })
    })
};

class RegisterDTO extends BaseDTO {
    static schema = Joi.object({
        username: Joi.string().trim().lowercase().min(3).max(30).required().messages({
            "string.empty": "Username is required",
            "string.min":
                "Username must contain at least 3 characters",
            "string.max":
                "Username must not exceed 30 characters",
            "any.required": "Username is required",
        }),
        email: Joi.string().lowercase().email().trim().required().messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email",
            "any.required": "Email is required",
        }),
        password: Joi.string().min(8).max(99).required()
            .messages({
                "string.empty": "Password is required",
                "string.min": "Password must contain at least 8 characters",
                "string.max": "Password must not exceed 128 characters",
                "any.required": "Password is required",
            })
    })
};

export { RegisterDTO, LoginDTO };

