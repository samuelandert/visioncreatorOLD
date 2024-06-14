import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        invitee: z.string().uuid(),
        inviter: z.string().uuid().optional()
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ user, input, context }) => {

        const fallbackInviterId = process.env.NODE_ENV === "production"
            ? "3de9f3dd-7fa2-4930-8194-b7ecf7e27932"
            : "13eb2844-2b68-46f2-84db-862d10c96d8b";

        console.log("---------fallback------------", fallbackInviterId)

        // Validate inviter: it should not be empty, the same as invitee, or invalid
        const inviterId = input.inviter && input.inviter !== input.invitee ? input.inviter : fallbackInviterId;

        console.log("---------fallback------------", inviterId)

        if (input.invitee !== user?.customClaims?.id) {
            console.error('Authorization Error: User ID does not match.');
            throw new AuthorizationError({ message: 'User ID does not match.' });
        }
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
                { inviter: inviterId, invitee: input.invitee }
            ])
            .select();

        if (error) {
            console.error(`Error creating invite: ${error.message}`);
            return { success: false, error: error.message };
        }

        console.log('--------Invite created successfully!---------');
        return { success: true, data };
    }
});