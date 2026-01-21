'use strict'

const statusCode = {
    OK: 200,
    CREATE: 201
}

const reasonStatusCode = {
        OK: 'SUCCESS',
        CREATE: 'Create!'
}
class SuccessRespone {
    constructor({message, statusCode = statusCode.OK, reasonStatusCode = reasonStatusCode.Ok, metaData = {}}){
        this.message = message? message : reasonStatusCode,
        this.status = statusCode,
        this.metaData = metaData
    }

    send (res, header ={}){
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessRespone {
    constructor({message, metaData}){
        super({message,metaData})
    }
}

class CREATE extends SuccessRespone {
    constructor({message, statusCode = statusCode.CREATE, reasonStatusCode = reasonStatusCode.CREATE, metaData = {}}){
        super(message, statusCode, reasonStatusCode, metaData)
    }
}

module.exports = {
    OK,
    CREATE
}