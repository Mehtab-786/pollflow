import APIError from "../utils/APIError.utils.js";
import BaseDTO from "../DTO/base.dto.js";
import type { Request, Response, NextFunction } from "express";

function validate(DTOclass: typeof BaseDTO) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { errors, value } = DTOclass.validate(req.body);
        if (errors) {
            throw new APIError(400, errors.join('; '));
        }
        req.body = value;
        next();
    }
}
export default validate;
