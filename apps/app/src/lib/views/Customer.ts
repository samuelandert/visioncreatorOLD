import { CustomerSchema } from "../composables/CustomerSchema";

export const view = {
    id: 'FormContainer',
    layout: {
        rows: '1fr auto',
        areas: `
            "main "
        `
    },
    children: [
        {
            id: 'ComposerForm',
            component: 'ComposerForm2',
            slot: 'main',
            data: {
                form: {
                    fields: [
                        {
                            name: 'family_name',
                            type: 'text',
                            title: 'What is your last name?',
                            description: 'Please enter your last name'
                        },
                        {
                            name: 'address_line1',
                            type: 'text',
                            title: 'What is your street address?',
                            description: 'Please enter your street address'
                        },
                        {
                            name: 'city',
                            type: 'text',
                            title: 'What city do you live in?',
                            description: 'Please enter your city'
                        },
                        {
                            name: 'guests',
                            type: 'number',
                            title: 'How many guests?',
                            description: 'Please tell us how many guests are arriving'
                        },
                        {
                            name: 'email',
                            type: 'email',
                            title: 'What is your email?',
                            description: 'Please enter your email'
                        },
                        {
                            name: 'postal_code',
                            type: 'text',
                            title: 'What is your postal code?',
                            description: 'Please enter your postal code'
                        },
                    ],
                    validators: CustomerSchema,
                    submitAction: 'setupDirectDebit'
                }
            }
        }
    ]
};