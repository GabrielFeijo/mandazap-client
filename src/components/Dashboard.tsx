import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	Plus,
	LogOut,
	RefreshCw,
	XCircle,
	MessageSquareText,
} from 'lucide-react';
import { api } from '../services/api';
import { InstanceCard } from './InstanceCard';
import { CreateInstanceModal } from './CreateInstanceModal';
import { useAuth } from '../hooks/useAuth';
import { getInitials } from '../utils/getInitials';
import { useSocket } from '../hooks/useSocket';

export const Dashboard: React.FC = () => {
	const { user, logout, token } = useAuth();
	const [showCreateModal, setShowCreateModal] = useState(false);
	const { setQrCode } = useSocket();

	const {
		data: instances,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['instances'],
		queryFn: () => api.instances.list(),
		enabled: !!token,
	});

	useEffect(() => {
		if (instances && instances.length > 0) {
			for (const instance of instances) {
				if (instance.qrCode) {
					setQrCode((prevQrCode) => {
						const updatedQrCode = { ...prevQrCode };
						updatedQrCode[instance.id] = instance.qrCode!;
						return updatedQrCode;
					});
				}
			}
		}
	}, [instances, setQrCode]);

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<RefreshCw className='w-8 h-8 text-green-600 animate-spin mx-auto mb-4' />
					<p className='text-gray-600'>Carregando instâncias...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<XCircle className='w-8 h-8 text-red-600 mx-auto mb-4' />
					<p className='text-red-600'>Erro ao carregar instâncias</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<header className='bg-white shadow-md border-b border-gray-200 py-1'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<div className='flex items-center gap-3'>
							<div className='bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-xl w-fit mx-auto shadow-lg'>
								<MessageSquareText className='w-6 h-6 text-white drop-shadow-sm' />
							</div>
							<h1 className='text-xl font-semibold text-gray-900'>MandaZap</h1>
						</div>

						<div className='flex items-center space-x-4'>
							<div className='w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-semibold border-2 border-gray-200 group-hover:border-green-300 transition-colors'>
								{getInitials(user?.name)}
							</div>
							<button
								onClick={logout}
								className=' text-gray-600 hover:text-gray-900 transition-colors'
							>
								<LogOut className='w-5 h-5' />
							</button>
						</div>
					</div>
				</div>
			</header>

			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='flex justify-between items-center mb-8'>
					<div>
						<h2 className='text-2xl font-bold text-gray-900'>
							Suas Instâncias
						</h2>
						<p className='text-gray-600'>Gerencie suas conexões WhatsApp</p>
					</div>

					<button
						onClick={() => setShowCreateModal(true)}
						className='bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-lg outline-none'
					>
						<Plus className='w-5 h-5' />
						<span>Nova Instância</span>
					</button>
				</div>

				{instances?.length === 0 ? (
					<div className='text-center py-12'>
						<MessageSquareText className='w-16 h-16 text-gray-400 mx-auto mb-4' />
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							Nenhuma instância encontrada
						</h3>
						<p className='text-gray-600 mb-6'>
							Crie sua primeira instância para começar
						</p>
						<button
							onClick={() => setShowCreateModal(true)}
							className='bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2'
						>
							<Plus className='w-5 h-5' />
							<span>Criar Instância</span>
						</button>
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{instances?.map((instance) => (
							<InstanceCard
								key={instance.id}
								instance={instance}
							/>
						))}
					</div>
				)}
			</main>

			<CreateInstanceModal
				isOpen={showCreateModal}
				onClose={() => setShowCreateModal(false)}
			/>
		</div>
	);
};
