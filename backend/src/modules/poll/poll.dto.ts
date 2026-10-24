import Joi from "joi";
import BaseDTO from "../../common/DTO/base.dto.js";

class CreatePollDTO extends BaseDTO {
    static schema = Joi.object({
        title: Joi.string().trim().min(5).max(255).required().messages({
            "string.empty": "Title is required",
            "string.min": "Title must contain at least 5 characters",
            "string.max": "Title must not exceed 250 characters",
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


//  questioons dto joi validation , because we are checking formats manually in service but it will help 
// to validate the basic structure of the questions

// questions: Joi.array()
//     .items(
//         Joi.object({
//             text: Joi.string().trim().optional(),
//             question: Joi.string().trim().optional(),

//             type: Joi.string()
//                 .valid("TEXT", "MULTIPLE_CHOICE")
//                 .default("MULTIPLE_CHOICE"),

//             selectionMode: Joi.string()
//                 .valid("SINGLE", "MULTIPLE")
//                 .default("SINGLE"),

//             isRequired: Joi.boolean().default(true),

//             options: Joi.when("type", {
//                 is: "MULTIPLE_CHOICE",
//                 then: Joi.array()
//                     .items(Joi.string().trim().required())
//                     .length(4)
//                     .required(),
//                 otherwise: Joi.array()
//                     .optional()
//                     .default([]),
//             }),
//         })
//             .xor("text", "question")
//             .required()
//     )
//     .min(1)
//     .required(),