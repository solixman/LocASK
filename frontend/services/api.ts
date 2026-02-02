const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';

export const apiFetch = async (endpoint: string, options: any = {}) => {
    const { body, ...customConfig } = options;
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const headers: any = {
        'Content-Type': 'application/json',
        ...customConfig.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (response.ok) {
            // Automatically store token if returned (for login/register)
            if (data.accessToken && typeof window !== 'undefined') {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        }

        const errorMessage = Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Something went wrong';

        throw new Error(errorMessage);
    } catch (err: any) {
        return Promise.reject(err.message || err || 'Network error');
    }
};

export const authService = {
    register: (data: any) => apiFetch('/auth/register', { body: data }),
    login: (data: any) => apiFetch('/auth/login', { body: data }),
    googleLogin: (idToken: string) => apiFetch('/auth/google', { body: { idToken } }),
};

export const questionsService = {
    getQuestions: (lat: number, lng: number) => apiFetch(`/questions?latitude=${lat}&longitude=${lng}`),
    getLikedQuestions: (lat: number, lng: number, userId: string) =>
        apiFetch(`/questions/liked?latitude=${lat}&longitude=${lng}&userId=${userId}`),
    createQuestion: (data: any) => apiFetch('/questions', { body: data }),
    toggleLike: (id: string, userId: string) => apiFetch(`/questions/${id}/like`, { body: { userId } }),
};

export const answersService = {
    getAnswersByQuestion: (questionId: string) => apiFetch(`/answers/question/${questionId}`),
    createAnswer: (questionId: string, data: any) =>
        apiFetch(`/answers?questionId=${questionId}`, { body: data }),
};
