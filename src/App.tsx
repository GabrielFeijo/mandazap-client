import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from './contexts/SocketContext';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

const AppContent: React.FC = () => {
	const { token } = useAuth();

	return (
		<>
			{token ? (
				<SocketProvider>
					<Dashboard />
				</SocketProvider>
			) : (
				<LoginForm />
			)}
		</>
	);
};

const App: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</QueryClientProvider>
	);
};

export default App;
