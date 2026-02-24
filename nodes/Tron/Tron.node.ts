/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-tron/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Tron implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Tron',
    name: 'tron',
    icon: 'file:tron.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Tron API',
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
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'Trc20Tokens',
            value: 'trc20Tokens',
          },
          {
            name: 'Blocks',
            value: 'blocks',
          },
          {
            name: 'SmartContracts',
            value: 'smartContracts',
          }
        ],
        default: 'accounts',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
    },
  },
  options: [
    {
      name: 'Get Account',
      value: 'getAccount',
      description: 'Get account information including balance, resources, and permissions',
      action: 'Get account information',
    },
    {
      name: 'Get Account Transactions',
      value: 'getAccountTransactions',
      description: 'Get transaction history for an account',
      action: 'Get account transactions',
    },
    {
      name: 'Get Account TRC-20 Transactions',
      value: 'getAccountTrc20Transactions',
      description: 'Get TRC-20 token transactions for an account',
      action: 'Get account TRC-20 transactions',
    },
    {
      name: 'Get Account Info',
      value: 'getAccountInfo',
      description: 'Get detailed account info including frozen balance and resources',
      action: 'Get detailed account info',
    },
    {
      name: 'Get Account Resource',
      value: 'getAccountResource',
      description: 'Get account resource information (bandwidth, energy)',
      action: 'Get account resource information',
    },
  ],
  default: 'getAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
    },
  },
  options: [
    {
      name: 'Create Transaction',
      value: 'createTransaction',
      description: 'Create a TRX transfer transaction',
      action: 'Create transaction',
    },
    {
      name: 'Broadcast Transaction',
      value: 'broadcastTransaction',
      description: 'Broadcast a signed transaction to the network',
      action: 'Broadcast transaction',
    },
    {
      name: 'Get Transaction',
      value: 'getTransaction',
      description: 'Get transaction details by hash',
      action: 'Get transaction',
    },
    {
      name: 'Get Transaction By ID',
      value: 'getTransactionById',
      description: 'Get transaction by ID with detailed info',
      action: 'Get transaction by ID',
    },
    {
      name: 'Get Transaction Info',
      value: 'getTransactionInfo',
      description: 'Get transaction receipt and resource consumption',
      action: 'Get transaction info',
    },
  ],
  default: 'createTransaction',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
    },
  },
  options: [
    {
      name: 'Trigger Smart Contract',
      value: 'triggerSmartContract',
      description: 'Interact with TRC-20 contracts (transfer, balanceOf, etc.)',
      action: 'Trigger smart contract',
    },
    {
      name: 'Get TRC-20 Transactions',
      value: 'getTrc20Transactions',
      description: 'Get TRC-20 transactions for an address',
      action: 'Get TRC-20 transactions',
    },
    {
      name: 'Constant Call',
      value: 'constantCall',
      description: 'Make constant calls to TRC-20 contracts (balanceOf, name, symbol)',
      action: 'Make constant call',
    },
    {
      name: 'Get Contract Info',
      value: 'getContract',
      description: 'Get TRC-20 contract information',
      action: 'Get contract info',
    },
    {
      name: 'Get Contract Transactions',
      value: 'getContractTransactions',
      description: 'Get all transactions for a TRC-20 contract',
      action: 'Get contract transactions',
    },
  ],
  default: 'triggerSmartContract',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
    },
  },
  options: [
    {
      name: 'Get Current Block',
      value: 'getCurrentBlock',
      description: 'Get the latest block',
      action: 'Get current block',
    },
    {
      name: 'Get Block by Number',
      value: 'getBlockByNumber',
      description: 'Get block by block number',
      action: 'Get block by number',
    },
    {
      name: 'Get Block by ID',
      value: 'getBlockById',
      description: 'Get block by block hash',
      action: 'Get block by ID',
    },
    {
      name: 'Get Latest Blocks',
      value: 'getLatestBlocks',
      description: 'Get latest blocks with pagination',
      action: 'Get latest blocks',
    },
    {
      name: 'Get Block',
      value: 'getBlock',
      description: 'Get block by number or hash',
      action: 'Get block',
    },
  ],
  default: 'getCurrentBlock',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
    },
  },
  options: [
    {
      name: 'Deploy Contract',
      value: 'deployContract',
      description: 'Deploy a new smart contract to the Tron network',
      action: 'Deploy a smart contract',
    },
    {
      name: 'Call Contract',
      value: 'callContract',
      description: 'Execute a smart contract function',
      action: 'Call a smart contract function',
    },
    {
      name: 'Call Constant Contract',
      value: 'callConstantContract',
      description: 'Make read-only calls to smart contracts',
      action: 'Call constant contract function',
    },
    {
      name: 'Get Contract Info',
      value: 'getContractInfo',
      description: 'Get smart contract details and ABI',
      action: 'Get contract information',
    },
    {
      name: 'Get Contract Data',
      value: 'getContractData',
      description: 'Get contract bytecode and other details',
      action: 'Get contract data',
    },
  ],
  default: 'deployContract',
},
      // Parameter definitions
{
  displayName: 'Account Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccount', 'getAccountTransactions', 'getAccountTrc20Transactions', 'getAccountInfo', 'getAccountResource'],
    },
  },
  default: '',
  description: 'The Tron account address (can be hex or base58 format)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTransactions', 'getAccountTrc20Transactions'],
    },
  },
  default: 20,
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Fingerprint',
  name: 'fingerprint',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTransactions', 'getAccountTrc20Transactions'],
    },
  },
  default: '',
  description: 'Fingerprint for pagination, obtained from previous response',
},
{
  displayName: 'Search Internal',
  name: 'searchInternal',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTransactions'],
    },
  },
  default: false,
  description: 'Whether to search internal transactions',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTrc20Transactions'],
    },
  },
  default: '',
  description: 'TRC-20 contract address to filter transactions',
},
{
  displayName: 'To Address',
  name: 'toAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['createTransaction'],
    },
  },
  default: '',
  description: 'The recipient address in hex format',
},
{
  displayName: 'Owner Address',
  name: 'ownerAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['createTransaction'],
    },
  },
  default: '',
  description: 'The sender address in hex format',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['createTransaction'],
    },
  },
  default: 0,
  description: 'The amount to transfer in SUN (1 TRX = 1,000,000 SUN)',
},
{
  displayName: 'Raw Data',
  name: 'rawData',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['broadcastTransaction'],
    },
  },
  default: '',
  description: 'The raw transaction data in hex format',
},
{
  displayName: 'Signature',
  name: 'signature',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['broadcastTransaction'],
    },
  },
  default: '',
  description: 'The transaction signature in hex format',
},
{
  displayName: 'Transaction Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransaction'],
    },
  },
  default: '',
  description: 'The transaction hash to query',
},
{
  displayName: 'Transaction ID',
  name: 'value',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactionById', 'getTransactionInfo'],
    },
  },
  default: '',
  description: 'The transaction ID in hex format',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['triggerSmartContract'],
    },
  },
  default: '',
  description: 'The TRC-20 contract address',
},
{
  displayName: 'Function Selector',
  name: 'functionSelector',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['triggerSmartContract'],
    },
  },
  default: '',
  description: 'The function selector (e.g., transfer, approve)',
},
{
  displayName: 'Parameter',
  name: 'parameter',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['triggerSmartContract'],
    },
  },
  default: '',
  description: 'Encoded parameters for the function call',
},
{
  displayName: 'Owner Address',
  name: 'ownerAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['triggerSmartContract'],
    },
  },
  default: '',
  description: 'The address that will trigger the contract',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['getTrc20Transactions'],
    },
  },
  default: '',
  description: 'The account address to get TRC-20 transactions for',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['getTrc20Transactions'],
    },
  },
  default: '',
  description: 'Filter by specific TRC-20 contract address',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['getTrc20Transactions'],
    },
  },
  default: 20,
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['constantCall'],
    },
  },
  default: '',
  description: 'The TRC-20 contract address',
},
{
  displayName: 'Function Selector',
  name: 'functionSelector',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['constantCall'],
    },
  },
  default: '',
  description: 'The function selector (e.g., balanceOf, name, symbol)',
},
{
  displayName: 'Parameter',
  name: 'parameter',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['constantCall'],
    },
  },
  default: '',
  description: 'Encoded parameters for the function call',
},
{
  displayName: 'Owner Address',
  name: 'ownerAddress',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['constantCall'],
    },
  },
  default: '',
  description: 'The address making the call (optional for constant calls)',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['getContract'],
    },
  },
  default: '',
  description: 'The contract address to get information for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['getContractTransactions'],
    },
  },
  default: '',
  description: 'The contract address to get transactions for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['trc20Tokens'],
      operation: ['getContractTransactions'],
    },
  },
  default: 20,
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Block Number',
  name: 'num',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByNumber'],
    },
  },
  default: 0,
  description: 'The block number to query',
},
{
  displayName: 'Block Hash',
  name: 'value',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockById'],
    },
  },
  default: '',
  description: 'The block hash to query (hex encoded)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getLatestBlocks'],
    },
  },
  default: 20,
  description: 'Maximum number of blocks to return (default: 20)',
},
{
  displayName: 'Identifier',
  name: 'identifier',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlock'],
    },
  },
  default: '',
  description: 'Block number or hash to query',
},
{
  displayName: 'ABI',
  name: 'abi',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['deployContract'],
    },
  },
  default: '',
  description: 'The contract ABI (Application Binary Interface)',
},
{
  displayName: 'Bytecode',
  name: 'bytecode',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['deployContract'],
    },
  },
  default: '',
  description: 'The contract bytecode in hex format',
},
{
  displayName: 'Constructor Parameters',
  name: 'constructorParameters',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['deployContract'],
    },
  },
  default: '',
  description: 'Constructor parameters encoded as hex string',
},
{
  displayName: 'Owner Address',
  name: 'ownerAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['deployContract', 'callContract', 'callConstantContract'],
    },
  },
  default: '',
  description: 'The owner address of the contract',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['callContract', 'callConstantContract'],
    },
  },
  default: '',
  description: 'The smart contract address',
},
{
  displayName: 'Function Selector',
  name: 'functionSelector',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['callContract', 'callConstantContract'],
    },
  },
  default: '',
  description: 'The function selector to call',
},
{
  displayName: 'Parameter',
  name: 'parameter',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['callContract', 'callConstantContract'],
    },
  },
  default: '',
  description: 'Function parameters encoded as hex string',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getContractInfo'],
    },
  },
  default: '',
  description: 'The contract address to get information for',
},
{
  displayName: 'Value',
  name: 'value',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getContractData'],
    },
  },
  default: '',
  description: 'The contract address in hex format',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'trc20Tokens':
        return [await executeTrc20TokensOperations.call(this, items)];
      case 'blocks':
        return [await executeBlocksOperations.call(this, items)];
      case 'smartContracts':
        return [await executeSmartContractsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('tronApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAccount': {
          const address = this.getNodeParameter('address', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/accounts/${address}`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountTransactions': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const fingerprint = this.getNodeParameter('fingerprint', i, '') as string;
          const searchInternal = this.getNodeParameter('searchInternal', i, false) as boolean;

          const queryParams: any = { limit };
          if (fingerprint) queryParams.fingerprint = fingerprint;
          if (searchInternal) queryParams.search_internal = searchInternal;

          const queryString = new URLSearchParams(queryParams).toString();
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/accounts/${address}/transactions?${queryString}`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountTrc20Transactions': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const fingerprint = this.getNodeParameter('fingerprint', i, '') as string;
          const contractAddress = this.getNodeParameter('contractAddress', i, '') as string;

          const queryParams: any = { limit };
          if (fingerprint) queryParams.fingerprint = fingerprint;
          if (contractAddress) queryParams.contract_address = contractAddress;

          const queryString = new URLSearchParams(queryParams).toString();
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/accounts/${address}/transactions/trc20?${queryString}`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountInfo': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/getaccount`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              address: address,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountResource': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/getaccountresource`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              address: address,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeTransactionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('tronApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createTransaction': {
          const toAddress = this.getNodeParameter('toAddress', i) as string;
          const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/createtransaction`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to_address: toAddress,
              owner_address: ownerAddress,
              amount: amount,
            }),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'broadcastTransaction': {
          const rawData = this.getNodeParameter('rawData', i) as string;
          const signature = this.getNodeParameter('signature', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/broadcasttransaction`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              raw_data: rawData,
              signature: [signature],
            }),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransaction': {
          const hash = this.getNodeParameter('hash', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/transactions/${hash}`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionById': {
          const value = this.getNodeParameter('value', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/gettransactionbyid`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              value: value,
            }),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionInfo': {
          const value = this.getNodeParameter('value', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/gettransactioninfobyid`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              value: value,
            }),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeTrc20TokensOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('tronApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'triggerSmartContract': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const functionSelector = this.getNodeParameter('functionSelector', i) as string;
          const parameter = this.getNodeParameter('parameter', i) as string;
          const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;

          const body: any = {
            contract_address: contractAddress,
            function_selector: functionSelector,
            owner_address: ownerAddress,
          };

          if (parameter) {
            body.parameter = parameter;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/triggersmartcontract`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTrc20Transactions': {
          const address = this.getNodeParameter('address', i) as string;
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;

          let url = `${credentials.baseUrl}/v1/accounts/${address}/transactions/trc20`;
          const queryParams: string[] = [];

          if (contractAddress) {
            queryParams.push(`contract_address=${contractAddress}`);
          }
          if (limit) {
            queryParams.push(`limit=${limit}`);
          }

          if (queryParams.length > 0) {
            url += '?' + queryParams.join('&');
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'constantCall': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const functionSelector = this.getNodeParameter('functionSelector', i) as string;
          const parameter = this.getNodeParameter('parameter', i) as string;
          const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;

          const body: any = {
            contract_address: contractAddress,
            function_selector: functionSelector,
          };

          if (parameter) {
            body.parameter = parameter;
          }
          if (ownerAddress) {
            body.owner_address = ownerAddress;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/triggerconstantcontract`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getContract': {
          const address = this.getNodeParameter('address', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/contracts/${address}`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getContractTransactions': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;

          let url = `${credentials.baseUrl}/v1/contracts/${address}/transactions`;
          if (limit) {
            url += `?limit=${limit}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.response && error.response.body) {
          throw new NodeApiError(this.getNode(), error.response.body);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeBlocksOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('tronApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getCurrentBlock': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/wallet/getnowblock`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getBlockByNumber': {
          const num = this.getNodeParameter('num', i) as number;
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/getblockbynum`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              num: num,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getBlockById': {
          const value = this.getNodeParameter('value', i) as string;
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/getblockbyid`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              value: value,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getLatestBlocks': {
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/blocks/latest`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            qs: {
              limit: limit,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getBlock': {
          const identifier = this.getNodeParameter('identifier', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/blocks/${identifier}`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }
  
  return returnData;
}

async function executeSmartContractsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('tronApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'deployContract': {
          const abi = this.getNodeParameter('abi', i) as any;
          const bytecode = this.getNodeParameter('bytecode', i) as string;
          const constructorParameters = this.getNodeParameter('constructorParameters', i) as string;
          const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;

          const requestBody: any = {
            abi: abi,
            bytecode: bytecode,
            owner_address: ownerAddress,
          };

          if (constructorParameters) {
            requestBody.constructor_parameters = constructorParameters;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/deploycontract`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'callContract': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const functionSelector = this.getNodeParameter('functionSelector', i) as string;
          const parameter = this.getNodeParameter('parameter', i) as string;
          const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;

          const requestBody: any = {
            contract_address: contractAddress,
            function_selector: functionSelector,
            owner_address: ownerAddress,
          };

          if (parameter) {
            requestBody.parameter = parameter;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/triggersmartcontract`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'callConstantContract': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const functionSelector = this.getNodeParameter('functionSelector', i) as string;
          const parameter = this.getNodeParameter('parameter', i) as string;
          const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;

          const requestBody: any = {
            contract_address: contractAddress,
            function_selector: functionSelector,
            owner_address: ownerAddress,
          };

          if (parameter) {
            requestBody.parameter = parameter;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/triggerconstantcontract`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getContractInfo': {
          const address = this.getNodeParameter('address', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/contracts/${address}`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getContractData': {
          const value = this.getNodeParameter('value', i) as string;

          const requestBody: any = {
            value: value,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/getcontract`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i }
          );
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw new NodeApiError(this.getNode(), error, { itemIndex: i });
      }
    }
  }

  return returnData;
}
