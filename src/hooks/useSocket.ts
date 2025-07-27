import { createContext, useContext } from 'react';
import type { Socket } from 'socket.io-client';
import type { ConnectionStatus, QrCode, RecentMessages } from '../types';

interface SocketContextType {
	socket: Socket | null;
	qrCode: QrCode;
	connectionStatus: ConnectionStatus;
	setQrCode: React.Dispatch<React.SetStateAction<QrCode>>;
	recentMessages: RecentMessages;
	setRecentMessages: React.Dispatch<React.SetStateAction<RecentMessages>>;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) throw new Error('useSocket must be used within SocketProvider');
	return context;
};
