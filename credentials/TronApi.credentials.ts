/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TronApi implements ICredentialType {
	name = 'tronApi';
	displayName = 'Tron API';
	documentationUrl = 'https://developers.tron.network/';
	properties: INodeProperties[] = [
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			options: [
				{ name: 'Mainnet', value: 'mainnet' },
				{ name: 'Shasta Testnet', value: 'shasta' },
				{ name: 'Nile Testnet', value: 'nile' },
				{ name: 'Custom', value: 'custom' },
			],
			default: 'mainnet',
			description: 'The Tron network to connect to',
		},
		{
			displayName: 'Custom Full Node URL',
			name: 'customFullNode',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					network: ['custom'],
				},
			},
			description: 'URL of the custom full node',
		},
		{
			displayName: 'Custom Solidity Node URL',
			name: 'customSolidityNode',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					network: ['custom'],
				},
			},
			description: 'URL of the custom solidity node (optional, defaults to full node)',
		},
		{
			displayName: 'Custom Event Server URL',
			name: 'customEventServer',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					network: ['custom'],
				},
			},
			description: 'URL of the custom event server (optional, defaults to full node)',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Private key for signing transactions (required for send operations)',
		},
		{
			displayName: 'TronGrid API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'TronGrid API key for enhanced rate limits (optional)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.network === "mainnet" ? "https://api.trongrid.io" : $credentials.network === "shasta" ? "https://api.shasta.trongrid.io" : $credentials.network === "nile" ? "https://nile.trongrid.io" : $credentials.customFullNode}}',
			url: '/wallet/getnowblock',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'TRON-PRO-API-KEY': '={{$credentials.apiKey || ""}}',
			},
		},
	};
}
