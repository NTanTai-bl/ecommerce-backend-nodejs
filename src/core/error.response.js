'use strict'

const {
    StatusCodes,
    ReasonPhrases
} = require("../utils/httpStatusCode")
const reasonPhrases = require("../utils/reasonPhrases")

class ErrorResponse extends Error {
    constructor(message, status){
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT){
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST){
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor (message = reasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED){
        super(message, statusCode)
    }
}
class NotFoundError extends ErrorResponse {
    constructor (message = reasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND){
        super(message, statusCode)
    }
}
class ForbiddenError extends ErrorResponse {
    constructor (message = reasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN){
        super(message, statusCode)
    }
}
module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}

