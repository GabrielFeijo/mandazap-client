import React, { useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const { login, register } = useAuth();

	const handleSubmit = async () => {
		if (!email || !password || password.length < 6 || (!isLogin && !name))
			return;

		setLoading(true);

		try {
			if (isLogin) {
				await login(email, password);
			} else {
				await register(email, password, name);
			}
		} catch (error) {
			console.error(
				error instanceof Error ? error.message : 'Erro desconhecido'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center p-4'>
			<div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-8'>
				<div className='text-center space-y-1 mb-8'>
					<div className='bg-green-600 p-2 rounded-lg w-fit mx-auto'>
						<MessageSquareText className='w-6 h-6 text-white' />
					</div>
					<h1 className='text-2xl font-bold text-gray-900'>MandaZap</h1>
					<p className='text-gray-600'>Gerencie suas instâncias WhatsApp</p>
				</div>

				<div className='space-y-6'>
					{!isLogin && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Nome
							</label>
							<input
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
								placeholder='Seu nome'
							/>
						</div>
					)}

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Email
						</label>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
							placeholder='seu@email.com'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Senha
						</label>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
							placeholder='••••••••'
						/>
					</div>

					<button
						onClick={handleSubmit}
						disabled={loading}
						className='w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50'
					>
						{loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
					</button>
				</div>

				<div className='mt-6 text-center'>
					<button
						onClick={() => setIsLogin(!isLogin)}
						className='text-green-600 hover:text-green-700 font-medium'
					>
						{isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
					</button>
				</div>
			</div>
		</div>
	);
};
