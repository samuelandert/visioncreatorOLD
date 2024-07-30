import { createOperation, z } from '../generated/wundergraph.factory';
import { of } from 'ipfs-only-hash';

function sortObjectProperties(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sortObjectProperties);
    }

    const dollarProps: { [key: string]: any } = {};
    const otherProps: { [key: string]: any } = {};

    // Separate $ properties and other properties
    Object.keys(obj).sort().forEach(key => {
        if (key.startsWith('$')) {
            dollarProps[key] = obj[key];
        } else {
            otherProps[key] = obj[key];
        }
    });

    // Ensure $id is first, then $schema, then other $ properties
    const sortedObj: { [key: string]: any } = {};
    if ('$id' in dollarProps) {
        sortedObj['$id'] = dollarProps['$id'];
        delete dollarProps['$id'];
    }
    if ('$schema' in dollarProps) {
        sortedObj['$schema'] = dollarProps['$schema'];
        delete dollarProps['$schema'];
    }

    // Add remaining $ properties
    Object.keys(dollarProps).sort().forEach(key => {
        sortedObj[key] = sortObjectProperties(dollarProps[key]);
    });

    // Add non-$ properties
    Object.keys(otherProps).sort().forEach(key => {
        sortedObj[key] = sortObjectProperties(otherProps[key]);
    });

    return sortedObj;
}

export default createOperation.mutation({
    input: z.object({
        json: z.any()
    }),
    handler: async ({ input }) => {
        try {
            const inputJson = { ...input.json };

            // Remove $id temporarily for CID calculation
            delete inputJson.$id;

            // Sort the JSON object recursively
            const sortedJson = sortObjectProperties(inputJson);

            // Convert the sorted JSON to a string
            const jsonString = JSON.stringify(sortedJson);

            // Calculate the CID
            const cid = await of(Buffer.from(jsonString));

            // Add or overwrite the $id field with the CID
            const outputJson = {
                $id: `https://alpha.ipfs.homin.io/${cid}`,
                ...sortedJson
            };

            return {
                success: true,
                json: outputJson
            };
        } catch (error) {
            console.error('Error in calculateCID:', error);
            return {
                success: false,
                error: 'Failed to calculate CID'
            };
        }
    },
});