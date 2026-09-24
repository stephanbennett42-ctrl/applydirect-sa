import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export default {
  // Fetch institutions (supports optional query filters)
  getInstitutions(params = {}) {
    return API.get('/institutions', { params });
  },

  // Fetch single institution
  getInstitutionById(id) {
    return API.get(`/institutions/${id}`);
  },

  // Register user & set reminder
  subscribeReminder(payload) {
    return API.post('/reminders', payload);
  },
};