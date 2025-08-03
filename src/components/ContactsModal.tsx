import React from 'react';
import { CardSim, XIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Contact } from '../types';
import { useAuth } from '../hooks/useAuth';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { getInitials } from '../utils/getInitials';
import { formatPhone } from '../utils/formatNumber';

dayjs.locale('pt-br');

interface ContactsModalProps {
	instanceId: string;
	onClose: () => void;
}

export const ContactsModal: React.FC<ContactsModalProps> = ({
	instanceId,
	onClose,
}) => {
	const { token } = useAuth();
	const divRef = React.useRef<HTMLDivElement>(null);

	const { data: contacts, isLoading } = useQuery<Contact[]>({
		queryKey: ['contacts', instanceId],
		queryFn: () => api.instances.getContacts(instanceId),
		enabled: !!token,
	});

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-2xl p-6 max-w-2xl w-full shadow-lg'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-2'>
						<CardSim className='w-6 h-6 text-green-600' />
						<h3 className='text-lg font-semibold'>Contatos da Instância</h3>
					</div>
					<button
						onClick={onClose}
						className='cursor-pointer text-sm text-gray-500 hover:text-gray-700 transition-colors'
					>
						<XIcon className='w-6 h-6' />
					</button>
				</div>

				<div
					className='bg-gray-100 rounded-xl p-4 h-96 overflow-y-auto space-y-3'
					ref={divRef}
				>
					{isLoading ? (
						<p className='text-gray-500 text-sm text-center'>Carregando...</p>
					) : contacts?.length ? (
						contacts.map((contact) => (
							<div
								key={contact.id}
								className='bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm hover:bg-gray-50 transition'
							>
								<div className='w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-semibold border-2 border-gray-200 group-hover:border-green-300 transition-colors'>
									{getInitials(contact.name)}
								</div>

								<div>
									<p className='text-sm font-medium text-gray-800'>
										{contact.name || 'Sem nome'}
									</p>
									<p className='text-xs text-gray-500'>
										{formatPhone(contact.number)}
									</p>
									<p className='text-[10px] text-gray-400 mt-0.5'>
										Criado em{' '}
										{dayjs(contact.createdAt).format('DD/MM/YYYY HH:mm')}
									</p>
								</div>
							</div>
						))
					) : (
						<p className='text-gray-500 text-sm text-center'>
							Nenhum contato encontrado.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
