import { createContext, useContext } from 'react';
import type { User } from '../types';

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name: string) => Promise<void>;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within AuthProvider');
	return context;
};
