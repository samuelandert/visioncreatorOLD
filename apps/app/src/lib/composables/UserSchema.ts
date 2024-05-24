import { z } from 'zod';

// Define custom validation messages
const validationMessages = {
    name: {
        minLength: 'Name must be at least 3 characters.',
        maxLength: 'Name must contain at most 10 characters.',
    },
    email: {
        isEmail: 'Invalid email address.',
    },
    about: {
        maxLength: 'About me section must contain at most 500 characters.',
    },
    guests: {
        min: "You can't book a room for no guests can't you? ",
        max: "It's quite tiny, no room for more then 2 guests (but you are free to try to fit as many children you can squeeze in there)",
    },
    favoriteFood: {
        invalid: 'Invalid food selection.',
    },
    location: {
        invalid: 'Invalid location selection.',
    },
    slider: {
        min: 'Slider value must be at least 0.',
        max: 'Slider value must be at most 100.',
    },
    toggle: {
        isBoolean: 'Toggle value must be a boolean.',
    },
};

function isDateString(value: any): value is string {
    return !isNaN(Date.parse(value));
}

const dateRangeSchema = z.custom((value) => {
    try {
        const parsedValue = JSON.parse(value);
        return (
            typeof parsedValue === 'object' &&
            parsedValue !== null &&
            'start' in parsedValue &&
            'end' in parsedValue &&
            isDateString(parsedValue.start) &&
            isDateString(parsedValue.end)
        );
    } catch {
        return false;
    }
}, { message: 'Invalid date range format.' });

export const UserSchema = z.object({
    name: z.string().nonempty('Name is required.').min(3, validationMessages.name.minLength).max(10, validationMessages.name.maxLength),
    email: z.string().email(validationMessages.email.isEmail),
    about: z.string().max(500, validationMessages.about.maxLength),
    guests: z.number().min(1, validationMessages.guests.min).max(2, validationMessages.guests.max),
    favoriteFood: z.enum(['apple', 'banana', 'coconut', 'peach', 'mango']).refine(value => value !== '', validationMessages.favoriteFood.invalid),
    location: z.enum(['Neustrelitz', 'Krakow am See', 'Rostock', 'Greifswald']).refine(value => value !== '', validationMessages.location.invalid),
    towertype: z.enum(['slubehome', 'slubetower']).refine(value => value !== '', 'Towertype is required.'),
    slider: z.number().min(0, validationMessages.slider.min).max(100, validationMessages.slider.max),
    toggle: z.boolean().refine(value => typeof value === 'boolean', validationMessages.toggle.isBoolean),
    staytime: z.string().nonempty('Date range is required.'),
})