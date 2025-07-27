import React, { useState, useCallback } from 'react';
import {
	MessageSquareText,
	Eye,
	EyeOff,
	Mail,
	Lock,
	User,
	AlertCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface FormData {
	email: string;
	password: string;
	name: string;
}

interface FormErrors {
	email?: string;
	password?: string;
	name?: string;
	general?: string;
}

export const LoginForm: React.FC = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});

	const [formData, setFormData] = useState<FormData>({
		email: '',
		password: '',
		name: '',
	});

	const { login, register } = useAuth();

	const validateForm = useCallback((): FormErrors => {
		const newErrors: FormErrors = {};

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!formData.email) {
			newErrors.email = 'Email é obrigatório';
		} else if (!emailRegex.test(formData.email)) {
			newErrors.email = 'Email deve ter um formato válido';
		}

		if (!formData.password) {
			newErrors.password = 'Senha é obrigatória';
		} else if (formData.password.length < 6) {
			newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
		}

		if (!isLogin && !formData.name.trim()) {
			newErrors.name = 'Nome é obrigatório';
		}

		return newErrors;
	}, [formData, isLogin]);

	const handleInputChange = useCallback(
		(field: keyof FormData, value: string) => {
			setFormData((prev) => ({ ...prev, [field]: value }));

			if (errors[field]) {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors[field];
					return newErrors;
				});
			}
		},
		[errors]
	);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			const formErrors = validateForm();
			if (Object.keys(formErrors).length > 0) {
				setErrors(formErrors);
				return;
			}

			setLoading(true);
			setErrors({});

			try {
				if (isLogin) {
					await login(formData.email, formData.password);
				} else {
					await register(formData.email, formData.password, formData.name);
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Erro desconhecido';
				setErrors({ general: errorMessage });
				console.error('Auth error:', errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[formData, isLogin, login, register, validateForm]
	);

	const toggleMode = useCallback(() => {
		setIsLogin(!isLogin);
		setErrors({});
		setFormData((prev) => ({ ...prev, name: '' }));
	}, [isLogin]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !loading) {
				handleSubmit(e);
			}
		},
		[handleSubmit, loading]
	);

	const isFormValid =
		formData.email &&
		formData.password &&
		formData.password.length >= 6 &&
		(isLogin || formData.name.trim());

	return (
		<div className='min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-blue-600 flex items-center justify-center p-4'>
			<div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in duration-500'>
				<div className='text-center space-y-2 mb-8'>
					<div className='bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-xl w-fit mx-auto shadow-lg'>
						<MessageSquareText className='w-7 h-7 text-white drop-shadow-sm' />
					</div>
					<h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
						MandaZap
					</h1>
					<p className='text-gray-600 text-sm'>
						Gerencie suas instâncias WhatsApp com facilidade
					</p>
				</div>

				{errors.general && (
					<div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3'>
						<AlertCircle className='w-5 h-5 text-red-500 mt-0.5 flex-shrink-0' />
						<div>
							<p className='text-red-800 text-sm font-medium'>
								Erro de autenticação
							</p>
							<p className='text-red-700 text-sm'>{errors.general}</p>
						</div>
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className='space-y-5'
					onKeyDown={handleKeyDown}
				>
					{!isLogin && (
						<div className='space-y-2'>
							<label
								htmlFor='name'
								className='block text-sm font-semibold text-gray-700'
							>
								Nome completo
							</label>
							<div className='relative'>
								<User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
								<input
									id='name'
									type='text'
									value={formData.name}
									onChange={(e) => handleInputChange('name', e.target.value)}
									className={`w-full pl-11 pr-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
										errors.name
											? 'border-red-300 bg-red-50'
											: 'border-gray-300 hover:border-gray-400 focus:bg-white'
									} outline-none`}
									placeholder='Seu nome completo'
									autoComplete='name'
								/>
							</div>
							{errors.name && (
								<p className='text-red-600 text-sm flex items-center space-x-1'>
									<AlertCircle className='w-4 h-4' />
									<span>{errors.name}</span>
								</p>
							)}
						</div>
					)}

					<div className='space-y-2'>
						<label
							htmlFor='email'
							className='block text-sm font-semibold text-gray-700'
						>
							Email
						</label>
						<div className='relative'>
							<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								id='email'
								type='email'
								value={formData.email}
								onChange={(e) => handleInputChange('email', e.target.value)}
								className={`w-full pl-11 pr-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
									errors.email
										? 'border-red-300 bg-red-50'
										: 'border-gray-300 hover:border-gray-400 focus:bg-white'
								} outline-none`}
								placeholder='seu@email.com'
								autoComplete='email'
							/>
						</div>
						{errors.email && (
							<p className='text-red-600 text-sm flex items-center space-x-1'>
								<AlertCircle className='w-4 h-4' />
								<span>{errors.email}</span>
							</p>
						)}
					</div>

					<div className='space-y-2'>
						<label
							htmlFor='password'
							className='block text-sm font-semibold text-gray-700'
						>
							Senha
						</label>
						<div className='relative'>
							<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								id='password'
								type={showPassword ? 'text' : 'password'}
								value={formData.password}
								onChange={(e) => handleInputChange('password', e.target.value)}
								className={`w-full pl-11 pr-12 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
									errors.password
										? 'border-red-300 bg-red-50'
										: 'border-gray-300 hover:border-gray-400 focus:bg-white'
								} outline-none`}
								placeholder='••••••••'
								autoComplete={isLogin ? 'current-password' : 'new-password'}
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
								tabIndex={-1}
							>
								{showPassword ? (
									<EyeOff className='w-5 h-5' />
								) : (
									<Eye className='w-5 h-5' />
								)}
							</button>
						</div>
						{errors.password && (
							<p className='text-red-600 text-sm flex items-center space-x-1'>
								<AlertCircle className='w-4 h-4' />
								<span>{errors.password}</span>
							</p>
						)}
					</div>

					<button
						type='submit'
						disabled={loading || !isFormValid}
						className='w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-[1.02] active:scale-[0.98]'
					>
						{loading ? (
							<span className='flex items-center justify-center space-x-2'>
								<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
								<span>Processando...</span>
							</span>
						) : isLogin ? (
							'Entrar'
						) : (
							'Criar conta'
						)}
					</button>
				</form>

				<div className='mt-8 text-center'>
					<button
						type='button'
						onClick={toggleMode}
						className='text-green-600 hover:text-green-700 font-semibold transition-colors duration-200 hover:underline focus:outline-none focus:ring-offset-2 rounded px-2 py-1'
					>
						{isLogin
							? 'Não tem conta? Cadastre-se aqui'
							: 'Já tem conta? Faça login'}
					</button>
				</div>
			</div>
		</div>
	);
};
