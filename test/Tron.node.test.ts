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
describe('Accounts Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('getAccount operation should return account information', async () => {
    const mockResponse = {
      data: [{
        address: 'TRX9Uhjnw...',
        balance: 1000000,
        create_time: 1234567890,
      }]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccount';
      if (param === 'address') return 'TRX9Uhjnw...';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.trongrid.io/v1/accounts/TRX9Uhjnw...',
      headers: {
        'TRON-PRO-API-KEY': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getAccountTransactions operation should return transaction history', async () => {
    const mockResponse = {
      data: [{
        txID: '123abc...',
        blockNumber: 12345,
        timestamp: 1234567890,
      }],
      success: true,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      if (param === 'operation') return 'getAccountTransactions';
      if (param === 'address') return 'TRX9Uhjnw...';
      if (param === 'limit') return defaultValue || 20;
      if (param === 'fingerprint') return defaultValue || '';
      if (param === 'searchInternal') return defaultValue || false;
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.trongrid.io/v1/accounts/TRX9Uhjnw.../transactions?limit=20',
      headers: {
        'TRON-PRO-API-KEY': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getAccountInfo operation should return detailed account info', async () => {
    const mockResponse = {
      address: 'TRX9Uhjnw...',
      balance: 1000000,
      frozen: [{
        frozen_balance: 100000,
        expire_time: 1234567890,
      }]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccountInfo';
      if (param === 'address') return 'TRX9Uhjnw...';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.trongrid.io/wallet/getaccount',
      headers: {
        'TRON-PRO-API-KEY': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        address: 'TRX9Uhjnw...',
      },
      json: true,
    });
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAccount';
      if (param === 'address') return 'invalid-address';
      return undefined;
    });

    const error = new Error('Invalid address format');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid address format');
  });

  test('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'unknownOperation';
      return undefined;
    });

    await expect(
      executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Transactions Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createTransaction', () => {
    it('should create a TRX transfer transaction successfully', async () => {
      const mockResponse = {
        raw_data: {
          contract: [{
            parameter: {
              value: {
                amount: 1000000,
                owner_address: '41e9d79cc47518930bc322d9bf7cddd260a0260a8d',
                to_address: '41be38f617f18b2596ebe165de40670d03c8ec5b5e',
              },
            },
          }],
        },
        txID: 'test-transaction-id',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        const params: any = {
          operation: 'createTransaction',
          toAddress: '41be38f617f18b2596ebe165de40670d03c8ec5b5e',
          ownerAddress: '41e9d79cc47518930bc322d9bf7cddd260a0260a8d',
          amount: 1000000,
        };
        return params[name];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.trongrid.io/wallet/createtransaction',
        headers: {
          'TRON-PRO-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to_address: '41be38f617f18b2596ebe165de40670d03c8ec5b5e',
          owner_address: '41e9d79cc47518930bc322d9bf7cddd260a0260a8d',
          amount: 1000000,
        }),
        json: true,
      });
    });
  });

  describe('broadcastTransaction', () => {
    it('should broadcast a signed transaction successfully', async () => {
      const mockResponse = {
        result: true,
        txid: 'test-transaction-id',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        const params: any = {
          operation: 'broadcastTransaction',
          rawData: 'test-raw-data',
          signature: 'test-signature',
        };
        return params[name];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTransaction', () => {
    it('should get transaction details by hash successfully', async () => {
      const mockResponse = {
        ret: [{ contractRet: 'SUCCESS' }],
        signature: ['test-signature'],
        txID: 'test-transaction-id',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        const params: any = {
          operation: 'getTransaction',
          hash: 'test-hash',
        };
        return params[name];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTransactionById', () => {
    it('should get transaction by ID successfully', async () => {
      const mockResponse = {
        ret: [{ contractRet: 'SUCCESS' }],
        signature: ['test-signature'],
        txID: 'test-transaction-id',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        const params: any = {
          operation: 'getTransactionById',
          value: 'test-transaction-id',
        };
        return params[name];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTransactionInfo', () => {
    it('should get transaction info successfully', async () => {
      const mockResponse = {
        id: 'test-transaction-id',
        blockNumber: 12345,
        receipt: {
          energy_usage: 0,
          net_usage: 267,
          result: 'SUCCESS',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        const params: any = {
          operation: 'getTransactionInfo',
          value: 'test-transaction-id',
        };
        return params[name];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is false', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        if (name === 'operation') return 'createTransaction';
        return 'test-value';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];

      await expect(
        executeTransactionsOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow();
    });

    it('should continue on fail when continueOnFail is true', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        if (name === 'operation') return 'createTransaction';
        return 'test-value';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];
      const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Trc20Tokens Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('triggerSmartContract should trigger TRC-20 contract successfully', async () => {
    const mockResponse = { 
      result: { result: true },
      transaction: { txID: 'test-tx-id' }
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'triggerSmartContract';
        case 'contractAddress': return 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
        case 'functionSelector': return 'transfer(address,uint256)';
        case 'parameter': return 'test-parameter';
        case 'ownerAddress': return 'TLPamm8gjH7kPLjyENAdZoqJPSZc4ZfNxP';
        default: return '';
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeTrc20TokensOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.trongrid.io/wallet/triggersmartcontract',
      headers: {
        'TRON-PRO-API-KEY': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contract_address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        function_selector: 'transfer(address,uint256)',
        parameter: 'test-parameter',
        owner_address: 'TLPamm8gjH7kPLjyENAdZoqJPSZc4ZfNxP',
      }),
    });
  });

  test('getTrc20Transactions should get TRC-20 transactions successfully', async () => {
    const mockResponse = { 
      data: [
        { transaction_id: 'tx1', value: '1000000' },
        { transaction_id: 'tx2', value: '2000000' }
      ]
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTrc20Transactions';
        case 'address': return 'TLPamm8gjH7kPLjyENAdZoqJPSZc4ZfNxP';
        case 'contractAddress': return 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
        case 'limit': return 20;
        default: return '';
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeTrc20TokensOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.trongrid.io/v1/accounts/TLPamm8gjH7kPLjyENAdZoqJPSZc4ZfNxP/transactions/trc20?contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&limit=20',
      headers: {
        'TRON-PRO-API-KEY': 'test-api-key',
      },
      json: true,
    });
  });

  test('constantCall should make constant call successfully', async () => {
    const mockResponse = { 
      result: { result: true },
      constant_result: ['0000000000000000000000000000000000000000000000000000000000989680']
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'constantCall';
        case 'contractAddress': return 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
        case 'functionSelector': return 'balanceOf(address)';
        case 'parameter': return 'test-parameter';
        case 'ownerAddress': return 'TLPamm8gjH7kPLjyENAdZoqJPSZc4ZfNxP';
        default: return '';
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeTrc20TokensOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.trongrid.io/wallet/triggerconstantcontract',
      headers: {
        'TRON-PRO-API-KEY': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contract_address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        function_selector: 'balanceOf(address)',
        parameter: 'test-parameter',
        owner_address: 'TLPamm8gjH7kPLjyENAdZoqJPSZc4ZfNxP',
      }),
    });
  });

  test('getContract should get contract info successfully', async () => {
    const mockResponse = { 
      bytecode: '608060405234801561001057600080fd5b50',
      name: 'TestToken',
      consume_user_resource_percent: 30
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getContract';
        case 'address': return 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
        default: return '';
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeTrc20TokensOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.trongrid.io/v1/contracts/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      headers: {
        'TRON-PRO-API-KEY': 'test-api-key',
      },
      json: true,
    });
  });

  test('getContractTransactions should get contract transactions successfully', async () => {
    const mockResponse = { 
      data: [
        { transaction_id: 'tx1', block_timestamp: 1640995200000 },
        { transaction_id: 'tx2', block_timestamp: 1640995260000 }
      ]
    };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getContractTransactions';
        case 'address': return 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
        case 'limit': return 20;
        default: return '';
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    
    const result = await executeTrc20TokensOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.trongrid.io/v1/contracts/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t/transactions?limit=20',
      headers: {
        'TRON-PRO-API-KEY': 'test-api-key',
      },
      json: true,
    });
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getContract';
        case 'address': return 'invalid-address';
        default: return '';
      }
    });
    
    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    
    await expect(
      executeTrc20TokensOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });

  test('should continue on fail when enabled', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getContract';
        case 'address': return 'invalid-address';
        default: return '';
      }
    });
    
    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    
    const result = await executeTrc20TokensOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

describe('Blocks Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getCurrentBlock', () => {
    it('should get current block successfully', async () => {
      const mockResponse = {
        blockID: '0000000002b1d9b1234567890abcdef1234567890abcdef1234567890abcdef12',
        block_header: {
          raw_data: {
            number: 45481393,
            txTrieRoot: '0x123',
            witness_address: '41928c9af0651632157ef27a2cf17ca72c575a4d21',
            parentHash: '0x456',
            version: 22,
            timestamp: 1671234567000,
          },
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getCurrentBlock';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.trongrid.io/wallet/getnowblock',
        headers: {
          'TRON-PRO-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getBlockByNumber', () => {
    it('should get block by number successfully', async () => {
      const mockResponse = {
        blockID: '0x123',
        block_header: {
          raw_data: {
            number: 12345,
            timestamp: 1671234567000,
          },
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getBlockByNumber';
        if (param === 'num') return 12345;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.trongrid.io/wallet/getblockbynum',
        headers: {
          'TRON-PRO-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          num: 12345,
        },
        json: true,
      });
    });
  });

  describe('getBlockById', () => {
    it('should get block by ID successfully', async () => {
      const mockResponse = {
        blockID: '0x123abc',
        block_header: {
          raw_data: {
            number: 12345,
            timestamp: 1671234567000,
          },
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getBlockById';
        if (param === 'value') return '0x123abc';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.trongrid.io/wallet/getblockbyid',
        headers: {
          'TRON-PRO-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          value: '0x123abc',
        },
        json: true,
      });
    });
  });

  describe('getLatestBlocks', () => {
    it('should get latest blocks successfully', async () => {
      const mockResponse = {
        data: [
          { block_id: '0x123', number: 12345 },
          { block_id: '0x124', number: 12346 },
        ],
        success: true,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getLatestBlocks';
        if (param === 'limit') return 10;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.trongrid.io/v1/blocks/latest',
        headers: {
          'TRON-PRO-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          limit: 10,
        },
        json: true,
      });
    });
  });

  describe('getBlock', () => {
    it('should get block by identifier successfully', async () => {
      const mockResponse = {
        blockID: '0x789',
        block_header: {
          raw_data: {
            number: 67890,
            timestamp: 1671234567000,
          },
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getBlock';
        if (param === 'identifier') return '67890';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.trongrid.io/v1/blocks/67890',
        headers: {
          'TRON-PRO-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const errorMessage = 'Block not found';
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getCurrentBlock';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error(errorMessage));

      await expect(
        executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });

    it('should continue on fail when enabled', async () => {
      const errorMessage = 'Block not found';
      
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getCurrentBlock';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error(errorMessage));

      const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: errorMessage });
    });
  });
});

describe('SmartContracts Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('deployContract', () => {
    it('should deploy a smart contract successfully', async () => {
      const mockResponse = {
        result: { result: true },
        transaction: { txID: '0x123' }
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'deployContract';
          case 'abi': return [{ "type": "constructor" }];
          case 'bytecode': return '0x608060405234801561001057600080fd5b50';
          case 'constructorParameters': return '';
          case 'ownerAddress': return 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://api.trongrid.io/wallet/deploycontract',
        })
      );
    });

    it('should handle deployment errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'deployContract';
          case 'abi': return [{ "type": "constructor" }];
          case 'bytecode': return '0x608060405234801561001057600080fd5b50';
          case 'constructorParameters': return '';
          case 'ownerAddress': return 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Deploy failed'));

      await expect(
        executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });
  });

  describe('callContract', () => {
    it('should call contract function successfully', async () => {
      const mockResponse = {
        result: { result: true },
        transaction: { txID: '0x456' }
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'callContract';
          case 'contractAddress': return '0x1234567890123456789012345678901234567890';
          case 'functionSelector': return 'transfer(address,uint256)';
          case 'parameter': return '0x000000000000000000000000123456789012345678901234567890123456789000000000000000000000000000000000000000000000000000000000000003e8';
          case 'ownerAddress': return 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://api.trongrid.io/wallet/triggersmartcontract',
        })
      );
    });
  });

  describe('callConstantContract', () => {
    it('should call constant contract function successfully', async () => {
      const mockResponse = {
        result: { result: true },
        constant_result: ['0x000000000000000000000000000000000000000000000000000000000000000a']
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'callConstantContract';
          case 'contractAddress': return '0x1234567890123456789012345678901234567890';
          case 'functionSelector': return 'balanceOf(address)';
          case 'parameter': return '0x0000000000000000000000001234567890123456789012345678901234567890';
          case 'ownerAddress': return 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://api.trongrid.io/wallet/triggerconstantcontract',
        })
      );
    });
  });

  describe('getContractInfo', () => {
    it('should get contract information successfully', async () => {
      const mockResponse = {
        data: [{
          address: '0x1234567890123456789012345678901234567890',
          abi: { entrys: [] },
          name: 'TestContract'
        }]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getContractInfo';
          case 'address': return '0x1234567890123456789012345678901234567890';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://api.trongrid.io/v1/contracts/0x1234567890123456789012345678901234567890',
        })
      );
    });
  });

  describe('getContractData', () => {
    it('should get contract data successfully', async () => {
      const mockResponse = {
        bytecode: '0x608060405234801561001057600080fd5b50',
        name: 'TestContract',
        origin_address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getContractData';
          case 'value': return '0x1234567890123456789012345678901234567890';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://api.trongrid.io/wallet/getcontract',
        })
      );
    });
  });
});
});
