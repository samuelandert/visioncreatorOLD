// import { createOperation, z } from './../generated/wundergraph.factory';
// import fetch from 'node-fetch';

// export default createOperation.mutation({
//     input: z.object({
//         id: z.number(),
//     }),
//     handler: async ({ input }) => {
//         console.log(input.id)
//         const response = await fetch('https://listmonk.visioncreator.works/api/subscribers/lists', {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Basic ' + Buffer.from('visioncreator:#$t54fg^M%*8Wi%9^W^9jczHNi9%BsQ').toString('base64')
//             },
//             body: JSON.stringify({
//                 ids: [input.id],
//                 action: 'remove',
//                 target_list_ids: [3]
//             })
//         });

//         if (!response.ok) {
//             console.log("error")
//             throw new Error(`HTTP error! status: ${response.status}`);
//             return "error"
//         }

//         return await response.json();
//     }
// });