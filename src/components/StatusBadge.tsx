import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
	status: 'connected' | 'connecting' | 'disconnected';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
	const getStatusConfig = (status: string) => {
		switch (status) {
			case 'connected':
				return {
					color: 'bg-green-100 text-green-800',
					icon: CheckCircle,
					text: 'Conectado',
				};
			case 'connecting':
				return {
					color: 'bg-yellow-100 text-yellow-800',
					icon: Clock,
					text: 'Conectando',
				};
			case 'disconnected':
				return {
					color: 'bg-red-100 text-red-800',
					icon: XCircle,
					text: 'Desconectado',
				};
			default:
				return {
					color: 'bg-gray-100 text-gray-800',
					icon: Clock,
					text: 'Desconhecido',
				};
		}
	};

	const config = getStatusConfig(status);
	const Icon = config.icon;

	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
		>
			<Icon className='w-3 h-3 mr-1' />
			{config.text}
		</span>
	);
};
