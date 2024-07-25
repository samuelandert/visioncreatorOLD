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
        if (!user || !user.customClaims) {
            console.error('Authorization Error: User not authenticated.');
            throw new AuthorizationError({ message: 'Not authorized' });
        }

        const userId = user.customClaims.id;

        async function resolveMapValue(value: any) {
            if (typeof value === 'object' && value.query) {
                try {
                    const resolvedInput = value.input ? { ...value.input } : {};

                    if (resolvedInput.id === 'authID') {
                        resolvedInput.id = userId;
                    }

                    const { data, error } = await operations.query({
                        operationName: value.query,
                        input: resolvedInput,
                    });

                    if (error) {
                        console.error(`Error fetching data for ${value.query}:`, error);
                        return null;
                    }

                    let result = value.prop ? data[value.prop] : data;

                    if (value.mapProps && Array.isArray(result)) {
                        result = result.map((item: any) => {
                            const mappedItem: any = {};
                            Object.entries(value.mapProps).forEach(([to, from]) => {
                                mappedItem[to] = item[from];
                            });
                            return mappedItem;
                        });
                    }

                    return result;
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