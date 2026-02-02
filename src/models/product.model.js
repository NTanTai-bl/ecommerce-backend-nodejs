'use strict'

const {model, Schema, Types} = require('mongoose')
const DOCUMENT_NAME = 'product'
const COLLECTION_NAME = 'products'

const productSchema = new Schema({
    product_name:{type: String, require: true},
    product_thumb: {type: String, require: true},
    product_description: String,
    product_price: { type: Number, require: true},
    product_quantity: { type: Number, require: true},
    product_type: {type: String, require: true, enum: ['Electronics', 'Clothing', 'Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'shop'},
    product_attributes: {type: Schema.Types.Mixed, require: true}
},{
    collection: COLLECTION_NAME,
    timestamps: true,
})

const clothingSchema = new Schema ({
    brand: {type: String, require: true},
    size: String,
    material: String
},{
    collection: 'clothes',
    timestamps: true
})

const electronicSchema = new Schema ({
    manufacturer: {type: String, require: true},
    model: String,
    color: String
},{
    collection: 'electronics',
    timestamps: true
})


module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronics', electronicSchema)
}