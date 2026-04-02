/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Tron } from '../nodes/Tron/Tron.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Tron Node', () => {
  let node: Tron;

  beforeAll(() => {
    node = new Tron();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Tron');
      expect(node.description.name).toBe('tron');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Account Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.trongrid.io',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should create account successfully', async () => {
		const mockResponse = { result: true, txid: 'test-txid' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createAccount')
			.mockReturnValueOnce('TOwnerAddress123')
			.mockReturnValueOnce('TAccountAddress456');

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.trongrid.io/wallet/createaccount',
			headers: {
				'TRON-PRO-API-KEY': 'test-api-key',
				'Content-Type': 'application/json',
			},
			body: {
				owner_address: 'TOwnerAddress123',
				account_address: 'TAccountAddress456',
			},
			json: true,
		});
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should get account successfully', async () => {
		const mockResponse = { address: 'TTestAddress123', balance: 1000000 };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAccount')
			.mockReturnValueOnce('TTestAddress123')
			.mockReturnValueOnce(true);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.trongrid.io/wallet/getaccount',
			headers: {
				'TRON-PRO-API-KEY': 'test-api-key',
				'Content-Type': 'application/json',
			},
			body: {
				address: 'TTestAddress123',
				visible: true,
			},
			json: true,
		});
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should get account balance successfully', async () => {
		const mockResponse = { balance: 5000000 };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAccountBalance')
			.mockReturnValueOnce('TTestIdentifier123')
			.mockReturnValueOnce('latest')
			.mockReturnValueOnce(true);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.trongrid.io/wallet/getaccountbalance',
			headers: {
				'TRON-PRO-API-KEY': 'test-api-key',
				'Content-Type': 'application/json',
			},
			body: {
				account_identifier: 'TTestIdentifier123',
				block_identifier: 'latest',
				visible: true,
			},
			json: true,
		});
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should get account resource successfully', async () => {
		const mockResponse = { EnergyUsed: 100, EnergyLimit: 1000 };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAccountResource')
			.mockReturnValueOnce('TTestAddress123')
			.mockReturnValueOnce(true);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.trongrid.io/wallet/getaccountresource',
			headers: {
				'TRON-PRO-API-KEY': 'test-api-key',
				'Content-Type': 'application/json',
			},
			body: {
				address: 'TTestAddress123',
				visible: true,
			},
			json: true,
		});
		expect(result[0].json).toEqual(mockResponse);
	});

	it('should handle API errors gracefully', async () => {
		const mockError = new Error('API Error');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAccount');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result[0].json.error).toBe('API Error');
	});
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.trongrid.io' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(), 
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should create transaction successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createTransaction')
      .mockReturnValueOnce('TRXToAddress123')
      .mockReturnValueOnce('TRXFromAddress456')
      .mockReturnValueOnce(1000000)
      .mockReturnValueOnce(true);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: true,
      transaction: { txID: 'test-tx-id' }
    });

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ 
      json: { result: true, transaction: { txID: 'test-tx-id' } }, 
      pairedItem: { item: 0 } 
    }]);
  });

  it('should broadcast transaction successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('broadcastTransaction')
      .mockReturnValueOnce('raw-data-string')
      .mockReturnValueOnce('signature-string');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: true,
      message: 'Transaction broadcasted successfully'
    });

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ 
      json: { result: true, message: 'Transaction broadcasted successfully' }, 
      pairedItem: { item: 0 } 
    }]);
  });

  it('should get transaction by ID successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransactionById')
      .mockReturnValueOnce('transaction-id-123')
      .mockReturnValueOnce(true);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      ret: [{ contractRet: 'SUCCESS' }],
      signature: ['signature123']
    });

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ 
      json: { ret: [{ contractRet: 'SUCCESS' }], signature: ['signature123'] }, 
      pairedItem: { item: 0 } 
    }]);
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createTransaction');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ 
      json: { error: 'API Error' }, 
      pairedItem: { item: 0 } 
    }]);
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createTransaction');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });
});

describe('TrcToken Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.trongrid.io',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('transferTrc10', () => {
		it('should transfer TRC-10 tokens successfully', async () => {
			const mockResponse = { txID: 'mock-tx-id', result: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('transferTrc10')
				.mockReturnValueOnce('TestToken')
				.mockReturnValueOnce('TDestinationAddress')
				.mockReturnValueOnce('TOwnerAddress')
				.mockReturnValueOnce(1000)
				.mockReturnValueOnce(false);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeTrcTokenOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				headers: {
					'Content-Type': 'application/json',
					'TRON-PRO-API-KEY': 'test-api-key',
				},
				method: 'POST',
				url: 'https://api.trongrid.io/wallet/transferasset',
				body: {
					asset_name: 'TestToken',
					to_address: 'TDestinationAddress',
					owner_address: 'TOwnerAddress',
					amount: 1000,
					visible: false,
				},
				json: true,
			});
		});

		it('should handle transfer errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('transferTrc10');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transfer failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const items = [{ json: {} }];
			const result = await executeTrcTokenOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{ json: { error: 'Transfer failed' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('triggerSmartContract', () => {
		it('should trigger smart contract successfully', async () => {
			const mockResponse = { result: { result: true } };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('triggerSmartContract')
				.mockReturnValueOnce('TContractAddress')
				.mockReturnValueOnce('transfer(address,uint256)')
				.mockReturnValueOnce('0x123...')
				.mockReturnValueOnce('TOwnerAddress')
				.mockReturnValueOnce(true);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeTrcTokenOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				headers: {
					'Content-Type': 'application/json',
					'TRON-PRO-API-KEY': 'test-api-key',
				},
				method: 'POST',
				url: 'https://api.trongrid.io/wallet/triggersmartcontract',
				body: {
					contract_address: 'TContractAddress',
					function_selector: 'transfer(address,uint256)',
					parameter: '0x123...',
					owner_address: 'TOwnerAddress',
					visible: true,
				},
				json: true,
			});
		});
	});

	describe('triggerConstantContract', () => {
		it('should trigger constant contract successfully', async () => {
			const mockResponse = { constant_result: ['0x456...'] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('triggerConstantContract')
				.mockReturnValueOnce('TContractAddress')
				.mockReturnValueOnce('balanceOf(address)')
				.mockReturnValueOnce('0x789...')
				.mockReturnValueOnce('TOwnerAddress')
				.mockReturnValueOnce(false);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeTrcTokenOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getAssetList', () => {
		it('should get asset list successfully', async () => {
			const mockResponse = { data: [{ id: '1000001', name: 'TestToken' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAssetList')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeTrcTokenOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				headers: {
					'Content-Type': 'application/json',
					'TRON-PRO-API-KEY': 'test-api-key',
				},
				method: 'GET',
				url: 'https://api.trongrid.io/v1/assets',
				qs: {
					limit: 10,
					offset: 0,
				},
				json: true,
			});
		});
	});

	describe('getAssetIssueByAccount', () => {
		it('should get asset issue by account successfully', async () => {
			const mockResponse = { assetIssue: [{ id: '1000001', name: 'MyToken' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAssetIssueByAccount')
				.mockReturnValueOnce('TAccountAddress')
				.mockReturnValueOnce(true);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeTrcTokenOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Block Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.trongrid.io'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get block information successfully', async () => {
    const mockResponse = { blockID: '123', blockNumber: 456 };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlock')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.trongrid.io/wallet/getblock',
      headers: {
        'Content-Type': 'application/json',
        'TRON-PRO-API-KEY': 'test-api-key',
      },
      body: { id_or_num: '123', detail: true, visible: true },
      json: true,
    });
  });

  it('should get block by number successfully', async () => {
    const mockResponse = { blockNumber: 456, transactions: [] };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlockByNumber')
      .mockReturnValueOnce(456)
      .mockReturnValueOnce(true);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.trongrid.io/wallet/getblockbynum',
      headers: {
        'Content-Type': 'application/json',
        'TRON-PRO-API-KEY': 'test-api-key',
      },
      body: { num: 456, visible: true },
      json: true,
    });
  });

  it('should get latest block successfully', async () => {
    const mockResponse = { blockID: 'latest', blockNumber: 789 };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getNowBlock')
      .mockReturnValueOnce(true);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.trongrid.io/wallet/getnowblock',
      headers: {
        'Content-Type': 'application/json',
        'TRON-PRO-API-KEY': 'test-api-key',
      },
      body: { visible: true },
      json: true,
    });
  });

  it('should get node info successfully', async () => {
    const mockResponse = { activeConnectCount: 10, passiveConnectCount: 5 };
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getNodeInfo');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.trongrid.io/wallet/getnodeinfo',
      headers: {
        'Content-Type': 'application/json',
        'TRON-PRO-API-KEY': 'test-api-key',
      },
      json: true,
    });
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getBlock');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('SmartContract Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.trongrid.io',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('deployContract operation', () => {
		it('should deploy a smart contract successfully', async () => {
			const mockResponse = { result: true, txid: '0x123' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deployContract')
				.mockReturnValueOnce([{ type: 'constructor', inputs: [] }])
				.mockReturnValueOnce('0x608060405234801561001057600080fd5b50')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('TestContract')
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(1000000)
				.mockReturnValueOnce('TRX9Jv1vtun9VUgHQKQzaf1VF8fchrZsxHH')
				.mockReturnValueOnce(true);
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSmartContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle deployment errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('deployContract');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Deployment failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeSmartContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.error).toBe('Deployment failed');
		});
	});

	describe('triggerSmartContract operation', () => {
		it('should trigger smart contract function successfully', async () => {
			const mockResponse = { result: { result: true }, transaction: { txid: '0x456' } };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('triggerSmartContract')
				.mockReturnValueOnce('TLBaRhANQoJFTqre9Nf1mjuwNWjCJeYqUL')
				.mockReturnValueOnce('transfer(address,uint256)')
				.mockReturnValueOnce('0x000000000000000000000041')
				.mockReturnValueOnce('TRX9Jv1vtun9VUgHQKQzaf1VF8fchrZsxHH')
				.mockReturnValueOnce(true);
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSmartContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('triggerConstantContract operation', () => {
		it('should trigger constant contract function successfully', async () => {
			const mockResponse = { constant_result: ['0x0000000000000000000000000000000000000000000000000000000000000064'] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('triggerConstantContract')
				.mockReturnValueOnce('TLBaRhANQoJFTqre9Nf1mjuwNWjCJeYqUL')
				.mockReturnValueOnce('balanceOf(address)')
				.mockReturnValueOnce('0x000000000000000000000041')
				.mockReturnValueOnce('TRX9Jv1vtun9VUgHQKQzaf1VF8fchrZsxHH')
				.mockReturnValueOnce(true);
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSmartContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getContract operation', () => {
		it('should get contract information successfully', async () => {
			const mockResponse = { bytecode: '0x608060405234801561001057600080fd5b50', name: 'TestContract' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContract')
				.mockReturnValueOnce('TLBaRhANQoJFTqre9Nf1mjuwNWjCJeYqUL')
				.mockReturnValueOnce(true);
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSmartContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getContractInfo operation', () => {
		it('should get detailed contract information successfully', async () => {
			const mockResponse = { energy_usage: 65000, energy_usage_total: 65000 };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContractInfo')
				.mockReturnValueOnce('TLBaRhANQoJFTqre9Nf1mjuwNWjCJeYqUL')
				.mockReturnValueOnce(true);
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSmartContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});
});
