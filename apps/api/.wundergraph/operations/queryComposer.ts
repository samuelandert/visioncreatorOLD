import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

const MapValueSchema = z.union([
    z.string(),
    z.number(),
    z.object({
        query: z.string(),
        input: z.record(z.any()).optional(), // Make input optional
        field: z.string().optional(), // Make field optional
    }),
]);

const MapSchema = z.record(z.union([
    MapValueSchema,
    z.array(z.record(MapValueSchema)),
]));

export default createOperation.query({
    input: z.object({
        id: z.string(),
        map: MapSchema,
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ input, user, operations }) => {
        if (!user || !user.customClaims || input.id !== user.customClaims.id) {
            console.error('Authorization Error: User not authenticated or ID mismatch.');
            throw new AuthorizationError({ message: 'Not authorized' });
        }

        async function resolveMapValue(value: any) {
            if (typeof value === 'object' && value.query) {
                try {
                    const resolvedInput = value.input ? { ...value.input } : {};

                    // Only replace 'authID' with the actual user ID if it exists
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