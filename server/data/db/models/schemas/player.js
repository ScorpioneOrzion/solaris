const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = Schema.Types;

const carrierSchema = require('./carrier');
const messageSchema = require('./message');

const schema = new Schema({
    userId: { type: Types.String, required: false, default: null },
    alias: { type: Types.String, required: true },
    colour: {
        alias: { type: Types.String, required: true },
        value: { type: Types.String, required: true }
    },
    researchingNow: { type: Types.String, required: true, default: 'weapons' },
    researchingNext: { type: Types.String, required: true, default: 'weapons' },
    cash: { type: Types.Number, required: true },
    condeded: { type: Types.Boolean, required: false, default: false },
    ready: { type: Types.Boolean, required: false, default: false },
    missedTurns: { type: Types.Number, required: false, default: 0 },
    karmaToGive: { type: Types.Number, required: true, default: 8 },
    apiCode: { type: Types.String, required: false },
    research: {
        scanning: { type: Types.Number, required: true, default: 0 },
        hyperspaceRange: { type: Types.Number, required: true, default: 0 },
        terraforming: { type: Types.Number, required: true, default: 0 },
        experimentation: { type: Types.Number, required: true, default: 0 },
        weapons: { type: Types.Number, required: true, default: 0 },
        banking: { type: Types.Number, required: true, default: 0 },
        manufacturing: { type: Types.Number, required: true, default: 0 }
    },
    carriers: [carrierSchema],
    messages: [messageSchema]
});

module.exports = schema;