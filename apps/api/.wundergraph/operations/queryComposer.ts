import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

const MapValueSchema = z.union([
    z.string(),
    z.number(),
    z.object({
        query: z.string(),
        input: z.record(z.any()).optional(),
        prop: z.string().optional(),
        mapProps: z.record(z.string()).optional()
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
        if (!user?.customClaims?.id) {
            throw new AuthorizationError({ message: 'Not authorized' });
        }

        const userId = user.customClaims.id;

        async function executeQuery(query, input) {
            const { data, error } = await operations.query({
                operationName: query,
                input: input,
            });

            if (error) {
                console.error(`Error fetching data for ${query}:`, error);
                return null;
            }

            return data;
        }

        async function resolveMap(map, depth = 0) {
            if (depth > 10) return null; // Prevent deep nesting

            const result = {};

            for (const [key, value] of Object.entries(map)) {
                if (Array.isArray(value)) {
                    result[key] = await Promise.all(value.map(item => resolveMap(item, depth + 1)));
                } else if (typeof value === 'object' && value.query) {
                    const resolvedInput = { ...value.input, id: value.input?.id === 'authID' ? userId : value.input?.id };
                    let queryResult = await executeQuery(value.query, resolvedInput);

                    if (value.prop) {
                        queryResult = queryResult[value.prop];
                    }

                    if (value.mapProps && Array.isArray(queryResult)) {
                        queryResult = queryResult.map(item => {
                            const mappedItem = {};
                            Object.entries(value.mapProps).forEach(([to, from]) => {
                                if (typeof from === 'string' && from.startsWith('prop.')) {
                                    mappedItem[to] = item[from.slice(5)];
                                } else {
                                    mappedItem[to] = from;
                                }
                            });
                            return mappedItem;
                        });
                    }

                    result[key] = queryResult;
                } else {
                    result[key] = value;
                }
            }

            return result;
        }

        return await resolveMap(input.map);
    },
});