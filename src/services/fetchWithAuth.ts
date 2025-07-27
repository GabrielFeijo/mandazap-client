import Cookies from 'js-cookie';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
	const token = Cookies.get('token');

	const headers = {
		...options.headers,
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		'Content-Type': 'application/json',
	};

	const response = await fetch(url, {
		...options,
		headers,
	});

	if (!response.ok) {
		if (response.status === 401) {
			Cookies.remove('token');
			window.location.href = '/';
		}

		throw new Error(`Request failed: ${response.status}`);
	}

	return response.json();
};
