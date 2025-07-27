import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

interface CreateInstanceModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const CreateInstanceModal: React.FC<CreateInstanceModalProps> = ({
	isOpen,
	onClose,
}) => {
	const [name, setName] = useState('');
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: (name: string) => api.instances.create(name),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['instances'] });
			setName('');
			onClose();
		},
	});

	const handleSubmit = () => {
		if (name.trim()) {
			createMutation.mutate(name);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-2xl p-6 max-w-md w-full'>
				<h3 className='text-lg font-semibold mb-4'>Nova Instância</h3>

				<div>
					<div className='mb-4'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Nome da Instância
						</label>
						<input
							type='text'
							value={name}
							onChange={(e) => setName(e.target.value)}
							className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
							placeholder='Ex: Vendas, Suporte, Pessoal...'
						/>
					</div>

					<div className='flex space-x-3'>
						<button
							type='button'
							onClick={onClose}
							className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
						>
							Cancelar
						</button>
						<button
							onClick={handleSubmit}
							disabled={createMutation.isPending}
							className='flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50'
						>
							{createMutation.isPending ? 'Criando...' : 'Criar'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
