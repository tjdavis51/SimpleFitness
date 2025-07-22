import api from './api'

// the only thing to do is to use the api to fetch for the badges earned by the user
// returns a promise with an object of badges
export const fetchBadges = () => api.get('/badges')