export interface User {
	id: string;
	email: string;
	name: string;
	provider: string;
	providerId?: string;
	createdAt: string;
	updatedAt: string;
}

export interface WhatsAppInstance {
	id: string;
	name: string;
	phoneNumber?: string;
	status: 'connected' | 'connecting' | 'disconnected';
	qrCode?: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Contact {
	id: string;
	jid: string;
	name?: string;
	number: string;
	profilePic?: string;
	instanceId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Message {
	id: string;
	messageId: string;
	fromMe: boolean;
	text?: string;
	type: string;
	timestamp: string;
	status?: string;
	contactId: string;
	instanceId: string;
	mediaId?: string;
	contact: Contact;
	createdAt: string;
}

export interface Media {
	id: string;
	filename: string;
	mimetype: string;
	size: number;
	path: string;
	instanceId: string;
	createdAt: string;
}

export interface AuthResponse {
	user: User;
	access_token: string;
}

export interface ConnectionStatus {
	[instanceId: string]: 'connected' | 'connecting' | 'disconnected';
}

export interface QrCode {
	[instanceId: string]: string;
}

export interface RecentMessages {
	[instanceId: string]: Message[];
}

export interface SocketEvents {
	'qr-code': (data: { qrCode: string; instanceId: string }) => void;
	'connection-update': (data: { status: string; instanceId: string }) => void;
	'message-received': (data: { message: Message; instanceId: string }) => void;
}
