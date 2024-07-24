export const eventConfig = {
    events: [{
        updateMe: {
            refetch: ['queryMe', 'queryLeaderboard'],
            trigger: ['toggleModal']
        }
    }]
};