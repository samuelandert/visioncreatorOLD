import { createOperation, z } from '../generated/wundergraph.factory';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

// IMPORTANT !!! IMPORTANT !!! IMPORTANT
// Please always exchange the $cid of our schema $id with the generated one from our db, when udpating the metaschema.
// IMPORTANT !!! IMPORTANT !!! IMPORTANT

const metaSchema = {
    "$id": "https://alpha.ipfs.homin.io/QmYfJXqYrwz5nHoAjBcxEbHAr7Q7zQxEUFLeZE5pARUx7R",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "title": "Meta Schema",
    "description": "A schema for defining other schemas",
    "properties": {
        "$id": {
            "type": "string",
            "format": "uri",
            "description": "The unique identifier for this schema"
        },
        "$schema": {
            "type": "string",
            "format": "uri",
            "description": "The JSON Schema version being used"
        },
        "type": {
            "type": "string",
            "enum": ["object", "array", "string", "number", "integer", "boolean", "null"],
            "description": "The type of the schema"
        },
        "author": {
            "type": "string",
            "description": "The author of the schema"
        },
        "prev": {
            "type": ["string", "null"],
            "format": "uri",
            "description": "The previous version of this schema, if any"
        },
        "version": {
            "type": "integer",
            "minimum": 0,
            "description": "The version number of this schema"
        },
        "title": {
            "type": "string",
            "description": "The title of the schema"
        },
        "description": {
            "type": "string",
            "description": "A description of the schema"
        },
        "properties": {
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": ["string", "array"],
                        "items": {
                            "type": "string",
                            "enum": ["object", "array", "string", "number", "integer", "boolean", "null"]
                        },
                        "minItems": 1,
                        "uniqueItems": true
                    },
                    "title": { "type": "string" },
                    "description": { "type": "string" },
                    "minimum": { "type": "number" },
                    "maximum": { "type": "number" },
                    "pattern": { "type": "string" },
                    "properties": { "$ref": "#/properties/properties" },
                    "required": {
                        "type": "array",
                        "items": { "type": "string" },
                        "uniqueItems": true
                    }
                },
                "required": ["type", "title", "description"]
            }
        },
        "required": {
            "type": "array",
            "items": { "type": "string" },
            "uniqueItems": true,
            "description": "The required properties for this schema"
        },
        "additionalProperties": {
            "type": "boolean",
            "description": "Whether additional properties are allowed"
        }
    },
    "required": [
        "$schema",
        "$id",
        "prev",
        "author",
        "version",
        "title",
        "description",
        "properties",
        "required"
    ],
    "additionalProperties": false
};

function generateRandomObject() {
    return {
        $schema: metaSchema.$id,
        $id: `https://alpha.ipfs.homin.io/UserSchema${Math.floor(Math.random() * 10000)}`,
        type: "object",
        author: "HominioAlpha",
        prev: null,
        version: 1,
        title: `User Schema ${Math.floor(Math.random() * 10000)}`,
        description: `Schema for user profile data ${Math.random()}`,
        properties: {
            $schema: {
                type: "string",
                title: "Schema",
                description: "The JSON Schema version being used",
                format: "uri"
            },
            $id: {
                type: "string",
                title: "ID",
                description: "Unique identifier for this object",
                format: "uri"
            },
            prev: {
                type: ["string", "null"],
                format: "uri",
                title: "Previous Version",
                description: "The previous version of this object, if any"
            },
            type: {
                type: "string",
                enum: ["object", "array", "string", "number", "integer", "boolean", "null"],
                title: "Type",
                description: "The type of this object"
            },
            author: {
                type: "string",
                title: "Author",
                description: "The author of this object"
            },
            version: {
                type: "integer",
                title: "Version",
                description: "The version number of this object",
                minimum: 0
            },
            title: {
                type: "string",
                title: "Title",
                description: "The title of this object"
            },
            description: {
                type: "string",
                title: "Description",
                description: "A description of this object"
            },
            properties: {
                type: "object",
                title: "User Properties",
                description: "Properties specific to a user object",
                properties: {
                    username: {
                        type: "string",
                        title: "Username",
                        description: "The user's chosen username",
                        minLength: 3,
                        maxLength: 20,
                        pattern: "^[a-zA-Z0-9_-]+$"
                    },
                    email: {
                        type: "string",
                        title: "Email",
                        description: "The user's email address",
                        format: "email"
                    },
                    password: {
                        type: "string",
                        title: "Password",
                        description: "The user's password (hashed)",
                        minLength: 8
                    },
                    profile: {
                        type: "object",
                        title: "User Profile",
                        description: "Additional profile information",
                        properties: {
                            fullName: {
                                type: "string",
                                title: "Full Name",
                                description: "The user's full name"
                            },
                            birthDate: {
                                type: "string",
                                title: "Birth Date",
                                description: "The user's birth date",
                                format: "date"
                            },
                            bio: {
                                type: "string",
                                title: "Biography",
                                description: "A short biography of the user",
                                maxLength: 500
                            },
                            location: {
                                type: "object",
                                title: "Location",
                                description: "The user's location",
                                properties: {
                                    country: {
                                        type: "string",
                                        title: "Country",
                                        description: "The user's country of residence"
                                    },
                                    city: {
                                        type: "string",
                                        title: "City",
                                        description: "The user's city of residence"
                                    }
                                }
                            }
                        },
                        required: ["fullName"]
                    },
                    settings: {
                        type: "object",
                        title: "User Settings",
                        description: "User preferences and settings",
                        properties: {
                            theme: {
                                type: "string",
                                title: "Theme",
                                description: "The user's preferred theme",
                                enum: ["light", "dark", "system"]
                            },
                            notifications: {
                                type: "boolean",
                                title: "Notifications",
                                description: "Whether the user wants to receive notifications"
                            },
                            language: {
                                type: "string",
                                title: "Language",
                                description: "The user's preferred language",
                                default: "en"
                            }
                        }
                    }
                },
                required: ["username", "email", "password", "profile"]
            }
        },
        required: ["$schema", "$id", "prev", "author", "version", "properties"],
        additionalProperties: false
    };
}

async function insertSchema(context, operations, schema, isMetaSchema = false) {
    const calcCIDResult = await operations.mutate({
        operationName: 'calculateCID',
        input: { json: schema },
    });

    if (!calcCIDResult.data?.success) {
        throw new Error('Failed to calculate CID: ' + (calcCIDResult.data?.error || 'Unknown error'));
    }

    const schemaWithId = calcCIDResult.data.json;

    if (!isMetaSchema) {
        const validate = ajv.compile(metaSchema);
        const valid = validate(schemaWithId);

        if (!valid) {
            throw new Error('Validation error: ' + ajv.errorsText(validate.errors));
        }
    } else {
        // For metaSchema, we'll just validate it as a valid JSON Schema
        try {
            ajv.compile(schemaWithId);
        } catch (error) {
            throw new Error('Invalid JSON Schema: ' + error.message);
        }
    }

    const { data, error } = await context.supabase
        .from('db')
        .insert({ json: schemaWithId })
        .select();

    if (error) {
        throw new Error('Database insert error: ' + error.message);
    }

    return data[0];
}

export default createOperation.mutation({
    input: z.object({}),
    handler: async ({ input, context, operations }) => {
        try {
            // Check if the database is empty
            const { count, error: countError } = await context.supabase
                .from('db')
                .select('*', { count: 'exact', head: true });

            if (countError) {
                throw new Error('Failed to check database: ' + countError.message);
            }

            let insertedData;

            if (count === 0) {
                // If the database is empty, insert the metaSchema
                insertedData = await insertSchema(context, operations, metaSchema, true);
            } else {
                // Otherwise, insert a random schema
                const randomObject = generateRandomObject();
                insertedData = await insertSchema(context, operations, randomObject);
            }

            return {
                success: true,
                insertedData
            };
        } catch (error) {
            console.error('Unexpected error in insertDB:', error);
            return {
                success: false,
                error: 'Unexpected error',
                details: error.message
            };
        }
    },
});