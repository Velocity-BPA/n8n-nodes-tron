/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

// Network configuration
const NETWORKS: Record<string, { fullNode: string; solidityNode: string; eventServer: string }> = {
	mainnet: {
		fullNode: 'https://api.trongrid.io',
		solidityNode: 'https://api.trongrid.io',
		eventServer: 'https://api.trongrid.io',
	},
	shasta: {
		fullNode: 'https://api.shasta.trongrid.io',
		solidityNode: 'https://api.shasta.trongrid.io',
		eventServer: 'https://api.shasta.trongrid.io',
	},
	nile: {
		fullNode: 'https://nile.trongrid.io',
		solidityNode: 'https://nile.trongrid.io',
		eventServer: 'https://nile.trongrid.io',
	},
};

// Emit licensing notice once per load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licenseNoticeEmitted = false;

function emitLicenseNotice(): void {
	if (!licenseNoticeEmitted) {
		console.warn(LICENSING_NOTICE);
		licenseNoticeEmitted = true;
	}
}

export class Tron implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tron',
		name: 'tron',
		icon: 'file:tron.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Tron blockchain - Licensed under BSL 1.1 by Velocity BPA',
		defaults: {
			name: 'Tron',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tronApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Transaction', value: 'transaction' },
					{ name: 'TRC-20 Token', value: 'trc20' },
					{ name: 'Block', value: 'block' },
					{ name: 'Utility', value: 'utility' },
				],
				default: 'account',
			},
			// Account operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['account'] } },
				options: [
					{ name: 'Get Balance', value: 'getBalance', description: 'Get TRX balance of an address', action: 'Get balance of an account' },
					{ name: 'Get Account Info', value: 'getAccountInfo', description: 'Get detailed account information', action: 'Get account info' },
					{ name: 'Get Resources', value: 'getResources', description: 'Get account resources (bandwidth, energy)', action: 'Get account resources' },
				],
				default: 'getBalance',
			},
			// Transaction operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['transaction'] } },
				options: [
					{ name: 'Send TRX', value: 'sendTrx', description: 'Send TRX to an address', action: 'Send TRX' },
					{ name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction by ID', action: 'Get transaction' },
					{ name: 'Get Transaction Info', value: 'getTransactionInfo', description: 'Get detailed transaction info', action: 'Get transaction info' },
				],
				default: 'getTransaction',
			},
			// TRC-20 operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['trc20'] } },
				options: [
					{ name: 'Get Token Info', value: 'getTokenInfo', description: 'Get TRC-20 token information', action: 'Get token info' },
					{ name: 'Get Balance', value: 'getTokenBalance', description: 'Get TRC-20 token balance', action: 'Get token balance' },
					{ name: 'Transfer', value: 'transferToken', description: 'Transfer TRC-20 tokens', action: 'Transfer tokens' },
				],
				default: 'getTokenInfo',
			},
			// Block operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['block'] } },
				options: [
					{ name: 'Get Current Block', value: 'getCurrentBlock', description: 'Get the latest block', action: 'Get current block' },
					{ name: 'Get Block by Number', value: 'getBlockByNumber', description: 'Get block by number', action: 'Get block by number' },
				],
				default: 'getCurrentBlock',
			},
			// Utility operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['utility'] } },
				options: [
					{ name: 'Validate Address', value: 'validateAddress', description: 'Check if address is valid', action: 'Validate address' },
					{ name: 'Convert TRX to Sun', value: 'toSun', description: 'Convert TRX to Sun', action: 'Convert TRX to Sun' },
					{ name: 'Convert Sun to TRX', value: 'fromSun', description: 'Convert Sun to TRX', action: 'Convert Sun to TRX' },
					{ name: 'Generate Address', value: 'generateAddress', description: 'Generate a new Tron address', action: 'Generate address' },
				],
				default: 'validateAddress',
			},
			// Address field
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['account', 'trc20', 'utility'],
						operation: ['getBalance', 'getAccountInfo', 'getResources', 'getTokenBalance', 'validateAddress'],
					},
				},
				description: 'Tron address (Base58 format starting with T)',
			},
			// Transaction ID field
			{
				displayName: 'Transaction ID',
				name: 'transactionId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['getTransaction', 'getTransactionInfo'],
					},
				},
				description: 'Transaction hash/ID',
			},
			// Send TRX fields
			{
				displayName: 'To Address',
				name: 'toAddress',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['sendTrx'],
					},
				},
				description: 'Recipient Tron address',
			},
			{
				displayName: 'Amount (TRX)',
				name: 'amount',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['sendTrx'],
					},
				},
				description: 'Amount of TRX to send',
			},
			// TRC-20 fields
			{
				displayName: 'Contract Address',
				name: 'contractAddress',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['trc20'],
					},
				},
				description: 'TRC-20 token contract address',
			},
			{
				displayName: 'Owner Address',
				name: 'ownerAddress',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['trc20'],
						operation: ['getTokenBalance'],
					},
				},
				description: 'Address to check balance for',
			},
			{
				displayName: 'To Address',
				name: 'toAddress',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['trc20'],
						operation: ['transferToken'],
					},
				},
				description: 'Recipient address for token transfer',
			},
			{
				displayName: 'Amount',
				name: 'tokenAmount',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['trc20'],
						operation: ['transferToken'],
					},
				},
				description: 'Amount of tokens to transfer (in smallest unit)',
			},
			// Block number field
			{
				displayName: 'Block Number',
				name: 'blockNumber',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['block'],
						operation: ['getBlockByNumber'],
					},
				},
				description: 'Block number to retrieve',
			},
			// Conversion fields
			{
				displayName: 'TRX Amount',
				name: 'trxAmount',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['utility'],
						operation: ['toSun'],
					},
				},
				description: 'Amount in TRX to convert to Sun',
			},
			{
				displayName: 'Sun Amount',
				name: 'sunAmount',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['utility'],
						operation: ['fromSun'],
					},
				},
				description: 'Amount in Sun to convert to TRX',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Emit licensing notice once per node load
		emitLicenseNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get credentials
		const credentials = await this.getCredentials('tronApi');
		const network = credentials.network as string;
		const privateKey = credentials.privateKey as string;
		const apiKey = credentials.apiKey as string;

		// Get network configuration
		let networkConfig = NETWORKS[network];
		if (!networkConfig) {
			if (network === 'custom') {
				networkConfig = {
					fullNode: credentials.customFullNode as string,
					solidityNode: credentials.customSolidityNode as string || credentials.customFullNode as string,
					eventServer: credentials.customEventServer as string || credentials.customFullNode as string,
				};
			} else {
				throw new NodeOperationError(this.getNode(), `Unknown network: ${network}`);
			}
		}

		// Initialize TronWeb (require inside execute to avoid n8n loader issues)
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const TronWeb = require('tronweb');
		const tronWeb = new TronWeb({
			fullHost: networkConfig.fullNode,
			headers: apiKey ? { 'TRON-PRO-API-KEY': apiKey } : {},
			privateKey: privateKey || undefined,
		});

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let result: IDataObject = {};

				// Account operations
				if (resource === 'account') {
					const address = this.getNodeParameter('address', i) as string;

					if (operation === 'getBalance') {
						const balance = await tronWeb.trx.getBalance(address);
						result = {
							address,
							balance: balance,
							balanceTRX: balance / 1000000,
						};
					} else if (operation === 'getAccountInfo') {
						const account = await tronWeb.trx.getAccount(address);
						result = {
							address,
							...account,
							balanceTRX: (account.balance || 0) / 1000000,
						};
					} else if (operation === 'getResources') {
						const resources = await tronWeb.trx.getAccountResources(address);
						result = {
							address,
							...resources,
						};
					}
				}

				// Transaction operations
				else if (resource === 'transaction') {
					if (operation === 'sendTrx') {
						if (!privateKey) {
							throw new NodeOperationError(this.getNode(), 'Private key required for sending transactions');
						}
						const toAddress = this.getNodeParameter('toAddress', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;
						const amountSun = Math.floor(amount * 1000000);

						const tx = await tronWeb.trx.sendTransaction(toAddress, amountSun);
						result = {
							success: tx.result,
							txid: tx.txid,
							transaction: tx.transaction,
						};
					} else if (operation === 'getTransaction') {
						const txId = this.getNodeParameter('transactionId', i) as string;
						const tx = await tronWeb.trx.getTransaction(txId);
						result = { ...tx };
					} else if (operation === 'getTransactionInfo') {
						const txId = this.getNodeParameter('transactionId', i) as string;
						const txInfo = await tronWeb.trx.getTransactionInfo(txId);
						result = { ...txInfo };
					}
				}

				// TRC-20 operations
				else if (resource === 'trc20') {
					const contractAddress = this.getNodeParameter('contractAddress', i) as string;

					if (operation === 'getTokenInfo') {
						const contract = await tronWeb.contract().at(contractAddress);
						const [name, symbol, decimals, totalSupply] = await Promise.all([
							contract.name().call().catch(() => 'Unknown'),
							contract.symbol().call().catch(() => 'Unknown'),
							contract.decimals().call().catch(() => 0),
							contract.totalSupply().call().catch(() => 0),
						]);
						result = {
							contractAddress,
							name,
							symbol,
							decimals: Number(decimals),
							totalSupply: totalSupply.toString(),
						};
					} else if (operation === 'getTokenBalance') {
						const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;
						const contract = await tronWeb.contract().at(contractAddress);
						const balance = await contract.balanceOf(ownerAddress).call();
						const decimals = await contract.decimals().call().catch(() => 0);
						result = {
							contractAddress,
							ownerAddress,
							balance: balance.toString(),
							decimals: Number(decimals),
						};
					} else if (operation === 'transferToken') {
						if (!privateKey) {
							throw new NodeOperationError(this.getNode(), 'Private key required for token transfers');
						}
						const toAddress = this.getNodeParameter('toAddress', i) as string;
						const tokenAmount = this.getNodeParameter('tokenAmount', i) as string;
						const contract = await tronWeb.contract().at(contractAddress);
						const tx = await contract.transfer(toAddress, tokenAmount).send();
						result = {
							success: true,
							txid: tx,
							contractAddress,
							toAddress,
							amount: tokenAmount,
						};
					}
				}

				// Block operations
				else if (resource === 'block') {
					if (operation === 'getCurrentBlock') {
						const block = await tronWeb.trx.getCurrentBlock();
						result = { ...block };
					} else if (operation === 'getBlockByNumber') {
						const blockNumber = this.getNodeParameter('blockNumber', i) as number;
						const block = await tronWeb.trx.getBlock(blockNumber);
						result = { ...block };
					}
				}

				// Utility operations
				else if (resource === 'utility') {
					if (operation === 'validateAddress') {
						const address = this.getNodeParameter('address', i) as string;
						const isValid = tronWeb.isAddress(address);
						result = {
							address,
							isValid,
							format: isValid ? (address.startsWith('T') ? 'base58' : 'hex') : 'invalid',
						};
					} else if (operation === 'toSun') {
						const trxAmount = this.getNodeParameter('trxAmount', i) as number;
						const sunAmount = tronWeb.toSun(trxAmount);
						result = {
							trx: trxAmount,
							sun: sunAmount.toString(),
						};
					} else if (operation === 'fromSun') {
						const sunAmount = this.getNodeParameter('sunAmount', i) as string;
						const trxAmount = tronWeb.fromSun(sunAmount);
						result = {
							sun: sunAmount,
							trx: Number(trxAmount),
						};
					} else if (operation === 'generateAddress') {
						const account = await tronWeb.createAccount();
						result = {
							address: {
								base58: account.address.base58,
								hex: account.address.hex,
							},
							privateKey: account.privateKey,
							publicKey: account.publicKey,
						};
					}
				}

				returnData.push({ json: result });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : String(error),
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
