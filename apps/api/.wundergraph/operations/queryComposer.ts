import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

const MapValueSchema = z.union([
    z.string(),
    z.number(),
    z.object({
        query: z.string(),
        input: z.record(z.any()).optional(),
        field: z.string().optional(),
    }),
]);

const MapSchema = z.record(z.union([
    MapValueSchema,
    z.array(z.record(MapValueSchema)),
]));

export default createOperation.query({
    input: z.object({
        data: z.record(z.any()),
        map: MapSchema,
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ input, user, operations }) => {
        if (!user || !user.customClaims) {
            console.error('Authorization Error: User not authenticated.');
            throw new AuthorizationError({ message: 'Not authorized' });
        }

        // If input.data.id is 'authID', replace it with the actual user ID
        if (input.data.id === 'authID') {
            input.data.id = user.customClaims.id;
        }

        async function resolveMapValue(value: any) {
            if (typeof value === 'object' && value.query) {
                try {
                    const resolvedInput = value.input ? { ...value.input } : {};

                    // Replace 'authID' with the actual user ID if it exists
                    if (resolvedInput.id === 'authID') {
                        resolvedInput.id = user.customClaims.id;
                    }

                    const { data, error } = await operations.query({
                        operationName: value.query,
                        input: resolvedInput,
                    });

                    if (error) {
                        console.error(`Error fetching data for ${value.query}:`, error);
                        return null;
                    }

                    // If field is specified, return that field from the data, otherwise return all data
                    return value.field ? data[value.field] : data;
                } catch (error) {
                    console.error(`Error executing query ${value.query}:`, error);
                    return null;
                }
            }
            return value;
        }

        async function resolveMap(map: any) {
            const result: any = {};
            for (const [key, value] of Object.entries(map)) {
                if (Array.isArray(value)) {
                    result[key] = await Promise.all(value.map(async (item) => {
                        const resolvedItem: any = {};
                        for (const [itemKey, itemValue] of Object.entries(item)) {
                            resolvedItem[itemKey] = await resolveMapValue(itemValue);
                        }
                        return resolvedItem;
                    }));
                } else {
                    result[key] = await resolveMapValue(value);
                }
            }
            return result;
        }

        const resolvedData = await resolveMap(input.map);

        return resolvedData;
    },
});