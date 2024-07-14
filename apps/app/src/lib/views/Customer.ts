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
            component: 'ComposerForm',
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
                    ],
                    validators: CustomerSchema,
                    submitAction: 'setupDirectDebit'
                }
            }
        }
    ]
};