import { z } from 'zod';

// Define custom validation messages
const validationMessages = {
    name: {
        minLength: 'Last name must be at least 2 characters.',
        maxLength: 'Last name must contain at most 50 characters.',
    },
    address: {
        minLength: 'Address must be at least 5 characters.',
        maxLength: 'Address must contain at most 100 characters.',
    },
    city: {
        minLength: 'City must be at least 2 characters.',
        maxLength: 'City must contain at most 50 characters.',
    },
    postalCode: {
        format: 'Invalid postal code format.',
    },
};

export const CustomerSchema = z.object({
    family_name: z.string()
        .min(2, validationMessages.name.minLength)
        .max(50, validationMessages.name.maxLength),
    address_line1: z.string()
        .min(5, validationMessages.address.minLength)
        .max(100, validationMessages.address.maxLength),
    city: z.string()
        .min(2, validationMessages.city.minLength)
        .max(50, validationMessages.city.maxLength),
    postal_code: z.string()
        .regex(/^\d{5}$/, validationMessages.postalCode.format)
});