import React from 'react';
import { MessageCircle, XIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Message } from '../types';
import { useAuth } from '../hooks/useAuth';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { getInitials } from '../utils/getInitials';
import { useSocket } from '../hooks/useSocket';

dayjs.locale('pt-br');

interface MessagesModalProps {
	instanceId: string;
	onClose: () => void;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
	instanceId,
	onClose,
}) => {
	const { token } = useAuth();
	const divRef = React.useRef<HTMLDivElement>(null);
	const { recentMessages, setRecentMessages } = useSocket();

	const { data: messages, isLoading } = useQuery<Message[]>({
		queryKey: ['messages', instanceId],
		queryFn: () => api.instances.getMessages(instanceId),
		enabled: !!token,
	});

	const instanceMessages = React.useMemo(
		() => recentMessages[instanceId] || [],
		[recentMessages, instanceId]
	);

	const recentMessagesId = instanceMessages.map((msg) => msg.messageId);

	const apiMessageIds = React.useMemo(() => {
		return new Set((messages || []).map((msg) => msg.messageId));
	}, [messages]);

	const filteredMessages = React.useMemo(() => {
		return instanceMessages.filter((msg) => !apiMessageIds.has(msg.messageId));
	}, [instanceMessages, apiMessageIds]);

	const allMessages = React.useMemo(
		() => [...(messages || []), ...filteredMessages],
		[messages, filteredMessages]
	);

	React.useEffect(() => {
		if (divRef.current) {
			divRef.current.scrollTop = divRef.current.scrollHeight;
		}
	}, [allMessages]);

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
			<div
				className='bg-white rounded-2xl p-6 max-w-2xl w-full shadow-lg'
				onClick={() => {
					setRecentMessages((prev) => ({
						...prev,
						[instanceId]: [],
					}));
				}}
			>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-2'>
						<MessageCircle className='w-6 h-6 text-green-600' />
						<h3 className='text-lg font-semibold'>Mensagens da Instância</h3>
					</div>
					<button
						onClick={onClose}
						className='cursor-pointer text-sm text-gray-500 hover:text-gray-700 transition-colors'
					>
						<XIcon className='w-6 h-6' />
					</button>
				</div>

				<div
					className='bg-gray-100 rounded-xl p-4 h-96 overflow-y-auto space-y-2'
					ref={divRef}
				>
					{isLoading ? (
						<p className='text-gray-500 text-sm text-center'>Carregando...</p>
					) : allMessages.length ? (
						allMessages.map((message) => {
							const contact = message.contact;

							return (
								<div
									key={message.messageId}
									className={`flex justify-start`}
								>
									<div className='flex items-end gap-2 w-full'>
										<div className='min-w-12 min-h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-semibold border-2 border-gray-200 group-hover:border-green-300 transition-colors'>
											{getInitials(contact.name)}
										</div>

										<div
											className={`rounded-xl px-4 py-2 text-sm shadow relative bg-white text-gray-800  rounded-bl-none 
											${recentMessagesId.includes(message.messageId)
													? 'ring-1 shadow-md shadow-green-500/30 ring-green-500'
													: ''
												}

											w-full`}
										>
											<p className='text-xs text-gray-500 mb-1 font-medium'>
												{contact?.name || contact?.number || 'Contato'}
											</p>

											{message.text && (
												<p className="whitespace-pre-line [overflow-wrap:anywhere]">
													{message.text}
												</p>
											)}


											<span className='block text-[10px] mt-1 text-gray-300 text-right'>
												{dayjs(message.timestamp).format('HH:mm')}
											</span>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<p className='text-gray-500 text-sm text-center'>
							Nenhuma mensagem encontrada.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
