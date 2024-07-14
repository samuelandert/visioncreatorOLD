import { UserSchema } from "../composables/UserSchema";

export const viewForm = {
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
                            name: 'staytime',
                            type: 'dateRange',
                            title: 'When do you want to visit?',
                            description: 'Please choose your date range'
                        },
                        {
                            name: 'location',
                            type: 'cardSelect',
                            title: 'Which place do you want to visit?',
                            description: 'Please choose your location',
                            options: [
                                {
                                    value: 'Neustrelitz',
                                    label: 'Neustrelitz',
                                    image: 'sun.jpeg',
                                    description:
                                        'In Neustrelitz übernachtest Du in unseren slubes direkt am Stadthafen, zwischen Bootsstegen und typisch historischen Backsteinspeichern. Perfekt um morgens in den Zierker See zu springen'
                                },
                                {
                                    value: 'Krakow am See',
                                    label: 'Krakow am See',
                                    image: 'sun.jpeg',
                                    description:
                                        'Übernachten an einem der schönsten Seen in Mecklenburg-Vorpommern. Direk am Krakower See gelegen, kannst du den Sonnenverlauf von der Dachterasse Deines slubes aus genießen. Ein idealer Ort zum Radfahren, Wandern und Wassersport'
                                },
                                {
                                    value: 'Rostock',
                                    label: 'Rostock',
                                    image: 'sun.jpeg',
                                    description:
                                        'Raus aus der Stadt, rein in die Natur. Unsere slubes in Rostock bieten einen idealen Rückzugsort für alle Ruhesuchenden. Sie stehen mitten im Brandenburger Wald auf der Forellenfarm 25 Teiche'
                                },
                                {
                                    value: 'Greifswald',
                                    label: 'Greifswald',
                                    image: 'sun.jpeg',
                                    description:
                                        'Küstenfeeling trifft coole Studentenstadt: Unsere slubes stehen mitten im Herzen von Greifswald am Yachtahfen mit Blick auf den Ryck. Direkt zwischen Rügen und Usedom is es nicht weit zum Osteestrand und großartigen Segelstandorten'
                                }
                            ]
                        },
                        {
                            name: 'towertype',
                            type: 'cardSelect',
                            title: 'Do you want to sleep in the Home or Tower Slube?',
                            description: 'Please choose your slube',
                            options: [
                                {
                                    value: 'slubehome',
                                    label: 'Slube Home',
                                    image: 'sun.jpeg',
                                    description:
                                        '69€ / night',
                                    squareImage: true
                                },
                                {
                                    value: 'slubetower',
                                    label: 'Slube Tower',
                                    image: 'sun.jpeg',
                                    description:
                                        '89€ / night',
                                    squareImage: true

                                },
                            ]
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
                            name: 'name',
                            type: 'text',
                            title: 'What is your name?',
                            description: 'Please enter your name'
                        },
                        {
                            name: 'about',
                            type: 'textarea',
                            title: 'Can you tell us about yourself?',
                            description: 'Tell us about yourself'
                        },

                        {
                            name: 'favoriteFood',
                            type: 'select',
                            title: 'What is your favorite food?',
                            description: 'Please select your favorite food',
                            options: [
                                { value: 'apple', label: 'Apple' },
                                { value: 'banana', label: 'Banana' },
                                { value: 'peach', label: 'Peach' },
                                { value: 'coconut', label: 'Coconut' },
                                { value: 'mango', label: 'Mango' }
                            ]
                        }
                    ],
                    validators: UserSchema
                }
            }
        }
    ]
};