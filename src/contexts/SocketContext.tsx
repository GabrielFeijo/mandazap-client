import React, { useState, useEffect, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import type {
	ConnectionStatus,
	Message,
	QrCode,
	RecentMessages,
} from '../types';
import { useAuth } from '../hooks/useAuth';
import { SocketContext } from '../hooks/useSocket';
import { usePageTitle } from '../hooks/usePageTitle';

interface SocketProviderProps {
	children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [qrCode, setQrCode] = useState<QrCode>({});
	const [recentMessages, setRecentMessages] = useState<RecentMessages>({});
	const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
		{}
	);
	const totalUnreadMessages = Object.values(recentMessages)
		.flat()
		.length;

	const { token, user } = useAuth();

	usePageTitle({ unreadCount: totalUnreadMessages });

	useEffect(() => {
		if (token && user) {
			const socketInstance = io(
				import.meta.env.VITE_API_BASE || 'http://localhost:3333',
				{
					auth: {
						token: `Bearer ${token}`,
					},
				}
			);

			socketInstance.on(
				'qr-code',
				(data: { qrCode: string; instanceId: string }) => {
					setQrCode((prev) => ({
						...prev,
						[data.instanceId]: data.qrCode,
					}));
				}
			);

			socketInstance.on(
				'connection-update',
				(data: { status: string; instanceId: string }) => {
					setConnectionStatus((prev) => ({
						...prev,
						[data.instanceId]: data.status as
							| 'connected'
							| 'connecting'
							| 'disconnected',
					}));
				}
			);

			socketInstance.on(
				'message-received',
				(data: { message: Message; instanceId: string }) => {
					setRecentMessages((prev) => ({
						...prev,
						[data.instanceId]: [...(prev[data.instanceId] || []), data.message],
					}));
				}
			);

			setSocket(socketInstance);

			return () => {
				socketInstance.disconnect();
			};
		}
	}, [token, user]);

	return (
		<SocketContext.Provider
			value={{
				socket,
				qrCode,
				connectionStatus,
				recentMessages,
				setQrCode,
				setRecentMessages,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};
