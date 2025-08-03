import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface CreateInstanceModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface CreateInstanceData {
	name: string;
}

export const CreateInstanceModal: React.FC<CreateInstanceModalProps> = ({
	isOpen,
	onClose,
}) => {
	const [name, setName] = useState('');
	const [hasInteracted, setHasInteracted] = useState(false);
	const queryClient = useQueryClient();
	const inputRef = useRef<HTMLInputElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);

	const isNameValid = name.trim().length >= 2;
	const showError = hasInteracted && !isNameValid;

	const createMutation = useMutation({
		mutationFn: (data: CreateInstanceData) => api.instances.create(data.name),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['instances'] });
			handleClose();
		},
		onError: (error) => {
			console.error('Error creating instance:', error);
		},
	});

	const handleClose = useCallback(() => {
		setName('');
		setHasInteracted(false);
		createMutation.reset();
		onClose();
	}, [onClose, createMutation]);

	const handleSubmit = useCallback(
		(e?: React.FormEvent) => {
			e?.preventDefault();
			setHasInteracted(true);

			if (isNameValid && !createMutation.isPending) {
				createMutation.mutate({ name: name.trim() });
			}
		},
		[name, isNameValid, createMutation]
	);

	const handleNameChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setName(e.target.value);
			if (!hasInteracted) setHasInteracted(true);
		},
		[hasInteracted]
	);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				handleClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, handleClose]);

	const handleBackdropClick = useCallback(
		(e: React.MouseEvent) => {
			if (e.target === e.currentTarget) {
				handleClose();
			}
		},
		[handleClose]
	);

	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200'
			onClick={handleBackdropClick}
			role='dialog'
			aria-modal='true'
			aria-labelledby='modal-title'
		>
			<div
				ref={modalRef}
				className='bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='flex items-center justify-between mb-6'>
					<h3
						id='modal-title'
						className='text-xl font-semibold text-gray-900'
					>
						Nova Instância
					</h3>
				</div>

				<form onSubmit={handleSubmit}>
					<div className='mb-6'>
						<label
							htmlFor='instance-name'
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							Nome da Instância
						</label>
						<input
							ref={inputRef}
							id='instance-name'
							type='text'
							value={name}
							onChange={handleNameChange}
							className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${showError
								? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
								: 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent'
								} outline-none`}
							placeholder='Ex: Vendas, Suporte, Pessoal...'
							maxLength={50}
							aria-invalid={showError}
							aria-describedby={showError ? 'name-error' : undefined}
						/>

						<div className='mt-1.5 text-xs text-gray-500 text-right'>
							{name.length}/50
						</div>

						{showError && (
							<p
								id='name-error'
								className='mt-2 text-sm text-red-600 flex items-center'
							>
								<AlertCircle className='w-4 h-4 mr-1' />
								Nome deve ter pelo menos 2 caracteres
							</p>
						)}
					</div>

					{createMutation.isError && (
						<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
							<p className='text-sm text-red-700 flex items-center'>
								<AlertCircle className='w-4 h-4 mr-2' />
								Erro ao criar instância. Tente novamente.
							</p>
						</div>
					)}

					<div className='flex space-x-3'>
						<button
							type='button'
							onClick={handleClose}
							disabled={createMutation.isPending}
							className='flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'
						>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={createMutation.isPending || !isNameValid}
							className='flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center '
						>
							{createMutation.isPending ? (
								<>
									<Loader2 className='animate-spin mr-2 h-4 w-4' />
									Criando...
								</>
							) : (
								<>
									<span className="inline sm:hidden">Criar</span>
									<span className="hidden sm:inline">Criar Instância</span>
								</>
							)}
						</button>
					</div>
				</form>
			</div >
		</div >
	);
};
