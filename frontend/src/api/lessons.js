import api from './axios'

export const fetchLessons = () => api.get('/lessons').then(r => r.data)
export const fetchLesson = (id) => api.get(`/lessons/${id}`).then(r => r.data)
export const markLessonComplete = (lessonId) => api.post('/progress/complete', { lessonId }).then(r => r.data)
