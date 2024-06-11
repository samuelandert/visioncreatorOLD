import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        invitee: z.string().uuid(),
        inviter: z.string().uuid()
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ input, context }) => {
        const existingInvite = await context.supabase
            .from('invites')
            .select()
            .match({ invitee: input.invitee })
            .single();

        if (existingInvite.data) {
            console.error('Invite already exists for this invitee!');
            return { success: false, error: 'ALREADY INVITED' };
        }

        // Proceed to create a new invite if no existing invite found
        const { data, error } = await context.supabase
            .from('invites')
            .insert([
                { inviter: input.inviter, invitee: input.invitee }
            ])
            .select();

        if (error) {
            console.error(`Error creating invite: ${error.message}`);
            return { success: false, error: error.message };
        }

        console.log('Invite created successfully!');
        return { success: true, data };
    }
});