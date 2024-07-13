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
            machine: {
                id: 'validation',
                initial: 'notValidated',
                context: {
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
                            name: 'postal_code',
                            type: 'text',
                            title: 'What is your postal code?',
                            description: 'Please enter your postal code'
                        }
                    ],
                    validators: CustomerSchema,
                    submitAction: 'submitCustomerForm'
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