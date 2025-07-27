import type {
	AuthResponse,
	WhatsAppInstance,
	Message,
	Contact,
	User,
} from '../types';
import { fetchWithAuth } from './fetchWithAuth';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3333';

export const api = {
	auth: {
		login: async (email: string, password: string): Promise<AuthResponse> => {
			const response = await fetch(`${API_BASE}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			if (!response.ok) throw new Error('Login failed');
			return response.json();
		},

		register: async (
			email: string,
			password: string,
			name: string
		): Promise<AuthResponse> => {
			const response = await fetch(`${API_BASE}/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, name }),
			});
			if (!response.ok) throw new Error('Registration failed');
			return response.json();
		},
	},

	users: {
		profile: async (): Promise<User> => {
			return fetchWithAuth(`${API_BASE}/users/profile`);
		},
	},

	instances: {
		list: async (): Promise<WhatsAppInstance[]> => {
			return fetchWithAuth(`${API_BASE}/whatsapp/instances`);
		},

		create: async (name: string): Promise<WhatsAppInstance> => {
			return fetchWithAuth(`${API_BASE}/whatsapp/instances`, {
				method: 'POST',
				body: JSON.stringify({ name }),
			});
		},

		connect: async (instanceId: string): Promise<{ success: boolean }> => {
			return fetchWithAuth(
				`${API_BASE}/whatsapp/instances/${instanceId}/connect`,
				{
					method: 'POST',
				}
			);
		},

		disconnect: async (instanceId: string): Promise<{ success: boolean }> => {
			return fetchWithAuth(
				`${API_BASE}/whatsapp/instances/${instanceId}/disconnect`,
				{
					method: 'POST',
				}
			);
		},

		getMessages: async (instanceId: string): Promise<Message[]> => {
			return fetchWithAuth(
				`${API_BASE}/whatsapp/instances/${instanceId}/messages`
			);
		},

		sendMessage: async (
			instanceId: string,
			to: string,
			message: string
		): Promise<Message> => {
			return fetchWithAuth(
				`${API_BASE}/whatsapp/instances/${instanceId}/send-message`,
				{
					method: 'POST',
					body: JSON.stringify({ to, message }),
				}
			);
		},

		getContacts: async (instanceId: string): Promise<Contact[]> => {
			return fetchWithAuth(
				`${API_BASE}/whatsapp/instances/${instanceId}/contacts`
			);
		},
	},
};
