const Ajv = require("ajv");
const ajv = new Ajv();

const gpAjv= ajv.compile({
    type: "object",
    properties: {
        d: { type: "boolean" }
    },
    additionalProperties: false
});

const cpAjv = ajv.compile({
    type: "object",
    properties: {
        bookmarks: {
            type: "array",
            maxItems: 120,
            items: {
                type: "integer",
                minimum: 0
            }
        },
        settings: {
            type: "array",
            maxItems: 3,
            items: {
                type: "object",
                properties: {
                    preset: {
                        type: "integer",
                        minimum: 1,
                        maximum: 3
                    },
                    enabledList: {
                        type: "array",
                        minItems: 3,
                        maxItems: 3,
                        items: {
                            type: "boolean"
                        }
                    },
                    valueList: {
                        type: "array",
                        minItems: 27,
                        maxItems: 27,
                        items: {
                            type: "integer",
                            minimum: 0
                        }
                    }
                },
                required: ["enabledList", "valueList"],
                additionalProperties: false
            }
        }
    },
    additionalProperties: false
});

module.exports = {
    gpValid: (param) => {
        try{
            return gpAjv(JSON.parse(param));
        }catch(err){
            return false;
        }
    },
    cpValid: (param) => {
        try{
            return cpAjv(JSON.parse(param));
        }catch(err){
            return false;
        }
    }
}