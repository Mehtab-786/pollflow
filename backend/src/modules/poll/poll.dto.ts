import Joi from "joi";
import BaseDTO from "../../common/DTO/base.dto.js";

class CreatePollDTO extends BaseDTO {
    static schema = Joi.object({
        title: Joi.string().trim().min(5).max(50).required().messages({
            "string.empty": "Title is required",
            "string.min": "Title must contain at least 5 characters",
            "string.max": "Title must not exceed 50 characters",
            "any.required": "Title is required",
        }),
        responseMode: Joi.string()
            .valid("AUTHENTICATED", "ANONYMOUS")
            .required()
            .messages({
                "string.empty": "Response mode is required",
                "any.only": "Response mode must be either AUTHENTICATED or ANONYMOUS",
                "any.required": "Response mode is required",
            }),
        expiresAt: Joi.date()
            .iso()
            .greater("now")
            .default(() => new Date(Date.now() + 24 * 60 * 60 * 1000))
            .messages({
                "date.base": "Expiration date must be a valid date",
                "date.format": "Expiration date must be a valid ISO format",
                "date.greater": "Expiration date must be in the future",
            }),
        type: Joi.string()
            .valid("POLL", "QUIZ")
            .required()
            .messages({
                "string.empty": "Poll type is required",
                "any.only": "Poll type must be either POLL or QUIZ",
                "any.required": "Poll type is required",
            }),
        questions: Joi.array()
            .required()
            .messages({
                "array.base": "Questions must be an array",
                "any.required": "Questions are required",
            }),
    });
}

export { CreatePollDTO };
