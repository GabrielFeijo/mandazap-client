import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	MessageSquareText,
	Power,
	PowerOff,
	Users,
	Send,
	Phone,
	Eye,
	MessageCircle,
} from 'lucide-react';
import { api } from '../services/api';
import type { WhatsAppInstance } from '../types';
import { StatusBadge } from './StatusBadge';
import { QRCodeModal } from './QRCodeModal';
import { useSocket } from '../hooks/useSocket';
import { MessagesModal } from './MessagesModal';
import { ContactsModal } from './ContactsModal';

interface InstanceCardProps {
	instance: WhatsAppInstance;
}

export const InstanceCard: React.FC<InstanceCardProps> = ({ instance }) => {
	const { connectionStatus, qrCode, setQrCode, recentMessages } = useSocket();
	const queryClient = useQueryClient();
	const [showModal, setShowModal] = useState<
		'qr' | 'messages' | 'contacts' | null
	>(null);

	const connectMutation = useMutation({
		mutationFn: () => api.instances.connect(instance.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['instances'] });
			setShowModal(null);
		},
	});

	const disconnectMutation = useMutation({
		mutationFn: () => api.instances.disconnect(instance.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['instances'] });
			setQrCode((prevQrCode) => {
				const updatedQrCode = { ...prevQrCode };
				delete updatedQrCode[instance.id];
				return updatedQrCode;
			});
		},
	});

	const recentMessagesCount = recentMessages[instance.id]?.length || 0;
	const status = connectionStatus[instance.id] || instance.status;
	const instanceQR = qrCode[instance.id];

	return (
		<div
			className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow relative
			${recentMessagesCount > 0 ? 'ring-1 shadow-green-500/30 ring-green-500' : ''}
		`}
		>
			{recentMessagesCount > 0 && (
				<div className='absolute -top-2 -right-2  bg-green-600 text-white rounded-xl w-6 h-6 flex items-center justify-center text-xs'>
					{recentMessagesCount}
				</div>
			)}
			<div className='flex items-center justify-between mb-4'>
				<div className='flex items-center space-x-3'>
					<div className='bg-green-100 p-2 rounded-lg'>
						<MessageSquareText className='w-6 h-6 text-green-600' />
					</div>
					<div>
						<h3 className='font-semibold text-lg'>{instance.name}</h3>
						{instance.phoneNumber && (
							<p className='text-gray-600 text-sm flex items-center'>
								<Phone className='w-3 h-3 mr-1' />
								{instance.phoneNumber}
							</p>
						)}
					</div>
				</div>
				<StatusBadge status={status} />
			</div>
			<div className='space-y-2'>
				<div className='flex space-x-2'>
					{status === 'disconnected' ? (
						<button
							onClick={() => connectMutation.mutate()}
							disabled={connectMutation.isPending}
							className='flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center'
						>
							<Power className='w-4 h-4 mr-2' />
							{connectMutation.isPending ? 'Conectando...' : 'Conectar'}
						</button>
					) : (
						<button
							onClick={() => disconnectMutation.mutate()}
							disabled={disconnectMutation.isPending}
							className='flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center'
						>
							<PowerOff className='w-4 h-4 mr-2' />
							{disconnectMutation.isPending
								? 'Desconectando...'
								: 'Desconectar'}
						</button>
					)}
					<button
						className='bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center'
						onClick={() => setShowModal('contacts')}
					>
						<Users className='w-4 h-4' />
					</button>
					<button className='bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center'>
						<Send className='w-4 h-4' />
					</button>
				</div>

				<button
					onClick={() => setShowModal('messages')}
					disabled={disconnectMutation.isPending}
					className='flex-1 w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200  transition-colors disabled:opacity-50 flex items-center justify-center'
				>
					<MessageCircle className='w-4 h-4 mr-2' />
					Ver mensagens
				</button>

				{instanceQR && (
					<button
						onClick={() => setShowModal('qr')}
						disabled={disconnectMutation.isPending}
						className='flex-1 w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200  transition-colors disabled:opacity-50 flex items-center justify-center'
					>
						<Eye className='w-4 h-4 mr-2' />
						Ver QR Code
					</button>
				)}
			</div>
			{showModal === 'qr' && qrCode && (
				<QRCodeModal
					qrCode={instanceQR}
					onClose={() => setShowModal(null)}
				/>
			)}
			{showModal === 'messages' && (
				<MessagesModal
					instanceId={instance.id}
					onClose={() => setShowModal(null)}
				/>
			)}
			{showModal === 'contacts' && (
				<ContactsModal
					instanceId={instance.id}
					onClose={() => setShowModal(null)}
				/>
			)}
		</div>
	);
};
