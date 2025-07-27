import React from 'react';
import { QrCode, XIcon } from 'lucide-react';

interface QRCodeModalProps {
	qrCode: string | null;
	onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
	qrCode,
	onClose,
}) => {
	if (!qrCode) return null;

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-2xl p-6 max-w-sm w-full'>
				<div className='text-center'>
					<div className='flex items-center justify-between mb-4'>
						<div className='flex items-center gap-2'>
							<QrCode className='w-6 h-6 text-green-600' />
							<h3 className='text-lg font-semibold'>Escaneie o QR Code</h3>
						</div>
						<button
							onClick={onClose}
							className='cursor-pointer text-sm text-gray-500 hover:text-gray-700 transition-colors'
						>
							<XIcon className='w-6 h-6' />
						</button>
					</div>

					<p className='text-gray-600 text-sm mb-4'>
						Use o WhatsApp do seu celular para escanear este código
					</p>

					<div className='bg-white border-2 border-gray-200 rounded-lg p-4 mb-4'>
						<img
							src={qrCode}
							alt='QR Code'
							className='w-full'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
