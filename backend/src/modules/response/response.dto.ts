import Joi from "joi";
import BaseDTO from "../../common/DTO/base.dto.js";

class CreateResponseDTO extends BaseDTO {
    static schema = Joi.object({
        pollId: Joi.string().optional().messages({
            "string.base": "Poll ID must be a string",
        }),
        answers: Joi.array()
            .items(
                Joi.object({
                    questionId: Joi.string().trim().required().messages({
                        "string.empty": "Question ID is required",
                        "any.required": "Question ID is required",
                    }),
                    optionId: Joi.string().trim().optional().allow(null, "").messages({
                        "string.base": "Option ID must be a string",
                    }),
                })
            )
            .min(1)
            .required()
            .messages({
                "array.base": "Answers must be an array",
                "array.min": "At least one answer is required",
                "any.required": "Answers are required",
            }),
    });
}

export { CreateResponseDTO as SubmitResponseDTO };
