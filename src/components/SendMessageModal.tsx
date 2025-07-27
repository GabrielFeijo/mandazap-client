import React, { useState, useCallback } from 'react';
import {
	Send,
	Search,
	MessageSquare,
	User,
	CheckCircle,
	AlertCircle,
	XIcon,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Contact } from '../types';
import { useAuth } from '../hooks/useAuth';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { getInitials } from '../utils/getInitials';
import { formatPhone } from '../utils/formatNumber';

dayjs.locale('pt-br');

interface SendMessageModalProps {
	instanceId: string;
	onClose: () => void;
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
	instanceId,
	onClose,
}) => {
	const { token } = useAuth();
	const queryClient = useQueryClient();
	const formRef = React.useRef<HTMLFormElement>(null);

	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
	const [message, setMessage] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [success, setSuccess] = useState(false);

	const { data: contacts, isLoading } = useQuery<Contact[]>({
		queryKey: ['contacts', instanceId],
		queryFn: () => api.instances.getContacts(instanceId),
		enabled: !!token,
	});

	const sendMessageMutation = useMutation({
		mutationFn: ({ to, text }: { to: string; text: string }) =>
			api.instances.sendMessage(instanceId, to, text),
		onSuccess: () => {
			setSuccess(true);
			setMessage('');
			queryClient.invalidateQueries({ queryKey: ['messages'] });

			setTimeout(() => {
				onClose();
			}, 2000);
		},
		onError: (error) => {
			console.error('Error sending message:', error);
		},
	});

	const filteredContacts =
		contacts?.filter(
			(contact) =>
				contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				contact.number.includes(searchTerm)
		) || [];

	const handleContactSelect = useCallback((contact: Contact) => {
		setSelectedContact(contact);
		setSearchTerm('');
	}, []);

	const handleSendMessage = useCallback(async () => {
		if (!selectedContact || !message.trim()) return;

		await sendMessageMutation.mutateAsync({
			to: selectedContact.number,
			text: message.trim(),
		});
	}, [selectedContact, message, sendMessageMutation]);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			handleSendMessage();
		},
		[handleSendMessage]
	);

	const handleBackToContacts = useCallback(() => {
		setSelectedContact(null);
		setMessage('');
		setSuccess(false);
	}, []);

	const isFormValid = selectedContact && message.trim().length > 0;

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}

			if (e.key === 'Enter' && e.ctrlKey && formRef.current && isFormValid) {
				e.preventDefault();
				formRef.current.requestSubmit();
			}
		},
		[isFormValid, onClose]
	);

	return (
		<div
			className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'
			onKeyDown={handleKeyDown}
			tabIndex={-1}
		>
			<div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 p-6'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-2'>
						<Send className='w-6 h-6 text-green-600' />
						<h3 className='text-lg font-semibold'>Enviar Mensagem</h3>
					</div>
					<button
						onClick={onClose}
						className='cursor-pointer text-sm text-gray-500 hover:text-gray-700 transition-colors'
					>
						<XIcon className='w-6 h-6' />
					</button>
				</div>
				<div className='bg-gray-100 rounded-xl p-4 h-96 overflow-y-auto space-y-2'>
					{success && (
						<div className='p-4 bg-green-50 border-b border-green-200'>
							<div className='flex items-center gap-3 text-green-800'>
								<CheckCircle className='w-5 h-5' />
								<div>
									<p className='font-medium'>Mensagem enviada com sucesso!</p>
									<p className='text-sm text-green-700'>
										Sua mensagem foi entregue para{' '}
										{selectedContact?.name || selectedContact?.number}
									</p>
								</div>
							</div>
						</div>
					)}

					{sendMessageMutation.error && (
						<div className='p-4 bg-red-50 border-b border-red-200'>
							<div className='flex items-center gap-3 text-red-800'>
								<AlertCircle className='w-5 h-5' />
								<div>
									<p className='font-medium'>Erro ao enviar mensagem</p>
									<p className='text-sm text-red-700'>
										{sendMessageMutation.error instanceof Error
											? sendMessageMutation.error.message
											: 'Erro desconhecido'}
									</p>
								</div>
							</div>
						</div>
					)}

					{!selectedContact ? (
						<div className='space-y-4'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
								<input
									type='text'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 bg-white focus:border-transparent outline-none text-sm'
									placeholder='Buscar contato por nome ou número...'
									autoFocus
								/>
							</div>

							<div className='space-y-2 max-h-80 overflow-y-auto'>
								{isLoading ? (
									<div className='flex items-center justify-center py-8'>
										<div className='flex items-center space-x-3'>
											<div className='w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin' />
											<span className='text-gray-600'>
												Carregando contatos...
											</span>
										</div>
									</div>
								) : filteredContacts.length > 0 ? (
									filteredContacts.map((contact) => (
										<button
											key={contact.id}
											onClick={() => handleContactSelect(contact)}
											className='w-full bg-white hover:bg-gray-50 rounded-lg p-4 flex items-center gap-4 transition-colors text-left group'
										>
											{contact.profilePic ? (
												<img
													src={contact.profilePic}
													alt={contact.name || contact.number}
													className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-green-300 transition-colors'
												/>
											) : (
												<div className='w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-semibold border-2 border-gray-200 group-hover:border-green-300 transition-colors'>
													{getInitials(contact.name)}
												</div>
											)}
											<div className='flex-1 min-w-0'>
												<p className='font-medium text-gray-900 truncate'>
													{contact.name || 'Sem nome'}
												</p>
												<p className='text-sm text-gray-600'>
													{formatPhone(contact.number)}
												</p>
												<p className='text-xs text-gray-400 mt-1'>
													Criado em{' '}
													{dayjs(contact.createdAt).format('DD/MM/YYYY HH:mm')}
												</p>
											</div>
											<div className='opacity-0 group-hover:opacity-100 transition-opacity'>
												<MessageSquare className='w-5 h-5 text-green-600' />
											</div>
										</button>
									))
								) : (
									<div className='text-center py-8'>
										<User className='w-12 h-12 text-gray-300 mx-auto mb-3' />
										<p className='text-gray-500'>
											{searchTerm
												? 'Nenhum contato encontrado para sua busca.'
												: 'Nenhum contato encontrado.'}
										</p>
									</div>
								)}
							</div>
						</div>
					) : (
						<div className='space-y-4'>
							<div className='bg-white rounded-lg p-4 flex items-center gap-4'>
								{selectedContact.profilePic ? (
									<img
										src={selectedContact.profilePic}
										alt={selectedContact.name || selectedContact.number}
										className='w-12 h-12 rounded-full object-cover border-2 border-gray-200'
									/>
								) : (
									<div className='w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold'>
										{getInitials(selectedContact.name)}
									</div>
								)}
								<div className='flex-1'>
									<p className='font-semibold text-gray-900'>
										{selectedContact.name || 'Sem nome'}
									</p>
									<p className='text-sm text-gray-600'>
										{formatPhone(selectedContact.number)}
									</p>
								</div>
								<button
									onClick={handleBackToContacts}
									className='text-sm text-green-600 hover:text-green-700 font-medium px-3 py-1 rounded-md hover:bg-green-50 transition-colors'
								>
									Trocar contato
								</button>
							</div>

							<form
								onSubmit={handleSubmit}
								className='space-y-4'
								ref={formRef}
							>
								<div>
									<label
										htmlFor='message'
										className='block text-sm font-semibold text-gray-700 mb-2'
									>
										Mensagem
									</label>
									<textarea
										id='message'
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										className='w-full bg-white px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-transparent resize-none outline-none'
										placeholder='Digite sua mensagem aqui...'
										rows={4}
										maxLength={4000}
										autoFocus
									/>
									<div className='flex justify-between items-center mt-1'>
										<p className='text-xs text-gray-500'>
											Pressione Ctrl+Enter para enviar
										</p>
										<p className='text-xs text-gray-500'>
											{message.length}/4000
										</p>
									</div>
								</div>

								<div className='flex gap-3 pt-2'>
									<button
										type='button'
										onClick={handleBackToContacts}
										className='flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
									>
										Voltar
									</button>
									<button
										type='submit'
										disabled={!isFormValid || sendMessageMutation.isPending}
										className='flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
									>
										{sendMessageMutation.isPending ? (
											<>
												<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
												Enviando...
											</>
										) : (
											<>
												<Send className='w-4 h-4' />
												Enviar Mensagem
											</>
										)}
									</button>
								</div>
							</form>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
