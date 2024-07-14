import { UserSchema } from "$lib/composables/UserSchema";

export const view = {
    id: 'FormContainer',
    layout: {
        rows: '1fr auto',
        areas: `
            "main"
        `
    },
    children: [
        {
            id: 'ComposerForm',
            component: 'ComposerForm',
            slot: 'main',
            data: {
                form: {
                    fields: [
                        {
                            name: 'full_name',
                            type: 'text',
                            title: 'What is your name?',
                            description: 'Please enter your full name'
                        }
                    ],
                    validators: UserSchema,
                    submitAction: 'submitUserForm'
                }
            }
        }
    ]
};