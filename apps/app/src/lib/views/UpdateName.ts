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
            machine: {
                id: 'validation',
                initial: 'notValidated',
                context: {
                    fields: [
                        {
                            name: 'full_name',
                            type: 'text',
                            title: 'What is your name?',
                            description: 'Please enter your full name'
                        }
                    ],
                    validators: UserSchema
                },
                states: {
                    notValidated: {
                        on: {
                            VALIDATE: {
                                target: 'isValidated',
                                actions: 'setValidated'
                            }
                        }
                    },
                    isValidated: {
                        on: {
                            INVALIDATE: {
                                target: 'notValidated',
                                actions: 'setNotValidated'
                            }
                        }
                    }
                }
            }
        }
    ]
};