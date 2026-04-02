import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TronApi implements ICredentialType {
	name = 'tronApi';
	displayName = 'TRON API';
	documentationUrl = 'https://developers.tron.network/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API key from TronGrid developer portal. Free tier available with rate limits.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.trongrid.io',
			description: 'Base URL for TRON API endpoints',
		},
	];
}