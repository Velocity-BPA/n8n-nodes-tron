import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TronApi implements ICredentialType {
	name = 'tronApi';
	displayName = 'Tron API';
	documentationUrl = 'https://developers.tron.network/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: false,
			description: 'TRON-PRO-API-KEY for higher rate limits. Optional for basic usage.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.trongrid.io',
			required: true,
			description: 'Base URL for the Tron API',
		},
	];
}