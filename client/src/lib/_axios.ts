import axios from 'axios';
import { baseUrl } from './config.js';

export const _axios = axios.create({
	baseURL: baseUrl,
	withCredentials: true
});

_axios.interceptors.response.use(
	(response) => {
		return response;
	}
);
