import React, { useState, type ReactNode } from 'react';
import Cookies from 'js-cookie';
import type { User } from '../types';
import { api } from '../services/api';
import { AuthContext } from '../hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const queryClient = useQueryClient();
	const [token, setToken] = useState<string | null>(
		Cookies.get('token') || null
	);
	const { data: user = null } = useQuery<User>({
		queryKey: ['user-profile'],
		queryFn: () => api.users.profile(),
		enabled: !!token,
		staleTime: 1000 * 60 * 5, // 5 minutos
		retry: false,
	});

	const login = async (email: string, password: string) => {
		const response = await api.auth.login(email, password);
		setToken(response.access_token);
		Cookies.set('token', response.access_token, { expires: 7 });
	};

	const register = async (email: string, password: string, name: string) => {
		const response = await api.auth.register(email, password, name);
		setToken(response.access_token);
		Cookies.set('token', response.access_token, { expires: 7 });
	};

	const logout = () => {
		setToken(null);
		Cookies.remove('token');
		queryClient.invalidateQueries({ queryKey: ['user-profile'] });
	};

	return (
		<AuthContext.Provider value={{ user, token, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
