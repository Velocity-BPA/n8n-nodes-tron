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
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'TrcToken',
            value: 'trcToken',
          },
          {
            name: 'Block',
            value: 'block',
          },
          {
            name: 'SmartContract',
            value: 'smartContract',
          },
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
        default: 'account',
      },
      // Operation dropdowns per resource
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['account'] } },
	options: [
		{
			name: 'Create Account',
			value: 'createAccount',
			description: 'Create a new TRON account',
			action: 'Create account',
		},
		{
			name: 'Get Account',
			value: 'getAccount',
			description: 'Get account information',
			action: 'Get account',
		},
		{
			name: 'Get Account Balance',
			value: 'getAccountBalance',
			description: 'Get account balance',
			action: 'Get account balance',
		},
		{
			name: 'Get Account Resource',
			value: 'getAccountResource',
			description: 'Get account resource information',
			action: 'Get account resource',
		},
	],
	default: 'createAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transaction'] } },
  options: [
    { name: 'Create Transaction', value: 'createTransaction', description: 'Create a TRX transfer transaction', action: 'Create a transaction' },
    { name: 'Broadcast Transaction', value: 'broadcastTransaction', description: 'Broadcast a signed transaction', action: 'Broadcast a transaction' },
    { name: 'Get Transaction by ID', value: 'getTransactionById', description: 'Get transaction details by ID', action: 'Get transaction by ID' },
    { name: 'Get Transaction Info by ID', value: 'getTransactionInfoById', description: 'Get transaction info by ID', action: 'Get transaction info by ID' },
    { name: 'Sign Transaction', value: 'signTransaction', description: 'Sign a transaction', action: 'Sign a transaction' },
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
			resource: ['trcToken'],
		},
	},
	options: [
		{
			name: 'Transfer TRC-10 Token',
			value: 'transferTrc10',
			description: 'Transfer TRC-10 tokens to another address',
			action: 'Transfer TRC-10 token',
		},
		{
			name: 'Trigger Smart Contract',
			value: 'triggerSmartContract',
			description: 'Interact with TRC-20 smart contracts',
			action: 'Trigger smart contract',
		},
		{
			name: 'Trigger Constant Contract',
			value: 'triggerConstantContract',
			description: 'Query TRC-20 contract data',
			action: 'Trigger constant contract',
		},
		{
			name: 'Get Asset List',
			value: 'getAssetList',
			description: 'Get list of TRC-10 tokens',
			action: 'Get asset list',
		},
		{
			name: 'Get Asset Issue by Account',
			value: 'getAssetIssueByAccount',
			description: 'Get assets issued by account',
			action: 'Get asset issue by account',
		},
	],
	default: 'transferTrc10',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['block'] } },
  options: [
    { name: 'Get Block', value: 'getBlock', description: 'Get block information by ID or number', action: 'Get block information' },
    { name: 'Get Block by Number', value: 'getBlockByNumber', description: 'Get block by specific number', action: 'Get block by number' },
    { name: 'Get Latest Block', value: 'getNowBlock', description: 'Get the latest block', action: 'Get latest block' },
    { name: 'Get Block Balance', value: 'getBlockBalance', description: 'Get block balance operations', action: 'Get block balance' },
    { name: 'Get Node Info', value: 'getNodeInfo', description: 'Get node information', action: 'Get node information' }
  ],
  default: 'getBlock',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['smartContract'],
		},
	},
	options: [
		{
			name: 'Deploy Contract',
			value: 'deployContract',
			description: 'Deploy a smart contract',
			action: 'Deploy a smart contract',
		},
		{
			name: 'Trigger Smart Contract',
			value: 'triggerSmartContract',
			description: 'Execute smart contract function',
			action: 'Execute smart contract function',
		},
		{
			name: 'Trigger Constant Contract',
			value: 'triggerConstantContract',
			description: 'Call constant smart contract function',
			action: 'Call constant smart contract function',
		},
		{
			name: 'Get Contract',
			value: 'getContract',
			description: 'Get contract information',
			action: 'Get contract information',
		},
		{
			name: 'Get Contract Info',
			value: 'getContractInfo',
			description: 'Get detailed contract information',
			action: 'Get detailed contract information',
		},
	],
	default: 'deployContract',
},
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
	displayName: 'Owner Address',
	name: 'ownerAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['createAccount'],
		},
	},
	default: '',
	description: 'The owner address of the account',
},
{
	displayName: 'Account Address',
	name: 'accountAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['createAccount'],
		},
	},
	default: '',
	description: 'The account address to create',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccount', 'getAccountResource'],
		},
	},
	default: '',
	description: 'The account address to query',
},
{
	displayName: 'Visible',
	name: 'visible',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccount', 'getAccountBalance', 'getAccountResource'],
		},
	},
	default: true,
	description: 'Whether the address is in base58 format',
},
{
	displayName: 'Account Identifier',
	name: 'accountIdentifier',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccountBalance'],
		},
	},
	default: '',
	description: 'The account identifier',
},
{
	displayName: 'Block Identifier',
	name: 'blockIdentifier',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccountBalance'],
		},
	},
	default: '',
	description: 'The block identifier (optional)',
},
{
  displayName: 'To Address',
  name: 'toAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['createTransaction'] } },
  default: '',
  description: 'Destination address for the transfer',
},
{
  displayName: 'Owner Address',
  name: 'ownerAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['createTransaction'] } },
  default: '',
  description: 'Address of the transaction owner',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['createTransaction'] } },
  default: 0,
  description: 'Amount of TRX to transfer (in Sun, 1 TRX = 1,000,000 Sun)',
},
{
  displayName: 'Visible',
  name: 'visible',
  type: 'boolean',
  displayOptions: { show: { resource: ['transaction'], operation: ['createTransaction', 'getTransactionById'] } },
  default: true,
  description: 'Whether to show addresses in hex format',
},
{
  displayName: 'Raw Data',
  name: 'rawData',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['broadcastTransaction'] } },
  default: '',
  description: 'Raw transaction data to broadcast',
},
{
  displayName: 'Signature',
  name: 'signature',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['broadcastTransaction'] } },
  default: '',
  description: 'Transaction signature',
},
{
  displayName: 'Transaction ID',
  name: 'value',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransactionById', 'getTransactionInfoById'] } },
  default: '',
  description: 'Transaction ID to query',
},
{
  displayName: 'Transaction Object',
  name: 'transaction',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['signTransaction'] } },
  default: '',
  description: 'Transaction object to sign (JSON string)',
},
{
  displayName: 'Private Key',
  name: 'privateKey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['signTransaction'] } },
  default: '',
  description: 'Private key for signing the transaction',
},
{
	displayName: 'Asset Name',
	name: 'assetName',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['trcToken'],
			operation: ['transferTrc10'],
		},
	},
	default: '',
	description: 'Name of the TRC-10 asset to transfer',
},
{
	displayName: 'To Address',
	name: 'toAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['trcToken'],
			operation: ['transferTrc10'],
		},
	},
	default: '',
	description: 'Destination address for the transfer',
},
{
	displayName: 'Owner Address',
	name: 'ownerAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['trcToken'],
			operation: ['transferTrc10', 'triggerSmartContract', 'triggerConstantContract'],
		},
	},
	default: '',
	description: 'Address of the token owner',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['trcToken'],
			operation: ['transferTrc10'],
		},
	},
	default: 0,
	description: 'Amount of tokens to transfer',
},
{
	displayName: 'Visible',
	name: 'visible',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['trcToken'],
			operation: ['transferTrc10', 'triggerSmartContract', 'triggerConstantContract', 'getAssetIssueByAccount'],
		},
	},
	default: false,
	description: 'Whether to use visible address format',
},
{
	displayName: 'Contract Address',
	name: 'contractAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['trcToken'],
			operation: ['triggerSmartContract', 'triggerConstantContract'],
		},
	},
	default: '',
	description: 'Address of the smart contract',
},
{
	displayName: 'Function Selector',
	name: 'functionSelector',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['trcToken'],
			operation: ['triggerSmartContract', 'triggerConstantContract'],
		},
	},
	default: '',
	description: 'Function selector for the smart contract call',
},
{
	displayName: 'Parameter',
	name: 'parameter',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['trcToken'],
			operation: ['triggerSmartContract', 'triggerConstantContract'],
		},
	},
	default: '',
	description: 'Parameters for the smart contract function',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['trcToken'],
			operation: ['getAssetList'],
		},
	},
	default: 20,
	description: 'Maximum number of assets to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['trcToken'],
			operation: ['getAssetList'],
		},
	},
	default: 0,
	description: 'Number of assets to skip',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['trcToken'],
			operation: ['getAssetIssueByAccount'],
		},
	},
	default: '',
	description: 'Address to check for issued assets',
},
{
  displayName: 'Block ID or Number',
  name: 'idOrNum',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['getBlock'] } },
  default: '',
  description: 'Block ID (hash) or block number',
},
{
  displayName: 'Detail',
  name: 'detail',
  type: 'boolean',
  displayOptions: { show: { resource: ['block'], operation: ['getBlock'] } },
  default: true,
  description: 'Whether to return detailed information',
},
{
  displayName: 'Visible',
  name: 'visible',
  type: 'boolean',
  displayOptions: { show: { resource: ['block'], operation: ['getBlock', 'getBlockByNumber', 'getNowBlock', 'getBlockBalance'] } },
  default: true,
  description: 'Whether the address is in base58 format',
},
{
  displayName: 'Block Number',
  name: 'num',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['getBlockByNumber'] } },
  default: 0,
  description: 'Block number to retrieve',
},
{
  displayName: 'Block Hash',
  name: 'hash',
  type: 'string',
  displayOptions: { show: { resource: ['block'], operation: ['getBlockBalance'] } },
  default: '',
  description: 'Block hash for balance query',
},
{
  displayName: 'Block Number',
  name: 'number',
  type: 'number',
  displayOptions: { show: { resource: ['block'], operation: ['getBlockBalance'] } },
  default: 0,
  description: 'Block number for balance query',
},
{
	displayName: 'ABI',
	name: 'abi',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['deployContract'],
		},
	},
	default: '',
	description: 'The Application Binary Interface (ABI) of the smart contract',
},
{
	displayName: 'Bytecode',
	name: 'bytecode',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['deployContract'],
		},
	},
	default: '',
	description: 'The compiled bytecode of the smart contract',
},
{
	displayName: 'Constructor Parameters',
	name: 'constructorParameters',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['deployContract'],
		},
	},
	default: '',
	description: 'Constructor parameters for the smart contract',
},
{
	displayName: 'Contract Name',
	name: 'name',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['deployContract'],
		},
	},
	default: '',
	description: 'Name of the smart contract',
},
{
	displayName: 'Consume User Resource Percent',
	name: 'consumeUserResourcePercent',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['deployContract'],
		},
	},
	default: 100,
	description: 'Percentage of user resources to consume',
},
{
	displayName: 'Origin Energy Limit',
	name: 'originEnergyLimit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['deployContract'],
		},
	},
	default: 1000000,
	description: 'The maximum energy limit for the deployment',
},
{
	displayName: 'Owner Address',
	name: 'ownerAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['deployContract', 'triggerSmartContract', 'triggerConstantContract', 'getContract', 'getContractInfo'],
		},
	},
	default: '',
	description: 'The owner address of the contract',
},
{
	displayName: 'Visible',
	name: 'visible',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['deployContract', 'triggerSmartContract', 'triggerConstantContract', 'getContract', 'getContractInfo'],
		},
	},
	default: true,
	description: 'Whether the address is in base58 format',
},
{
	displayName: 'Contract Address',
	name: 'contractAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['triggerSmartContract', 'triggerConstantContract'],
		},
	},
	default: '',
	description: 'The address of the smart contract',
},
{
	displayName: 'Function Selector',
	name: 'functionSelector',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['triggerSmartContract', 'triggerConstantContract'],
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
			resource: ['smartContract'],
			operation: ['triggerSmartContract', 'triggerConstantContract'],
		},
	},
	default: '',
	description: 'Parameters for the function call',
},
{
	displayName: 'Contract Value',
	name: 'value',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['smartContract'],
			operation: ['getContract', 'getContractInfo'],
		},
	},
	default: '',
	description: 'The contract address to query',
},
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
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'trcToken':
        return [await executeTrcTokenOperations.call(this, items)];
      case 'block':
        return [await executeBlockOperations.call(this, items)];
      case 'smartContract':
        return [await executeSmartContractOperations.call(this, items)];
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

async function executeAccountOperations(
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
				case 'createAccount': {
					const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;
					const accountAddress = this.getNodeParameter('accountAddress', i) as string;

					const body = {
						owner_address: ownerAddress,
						account_address: accountAddress,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/wallet/createaccount`,
						headers: {
							'TRON-PRO-API-KEY': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAccount': {
					const address = this.getNodeParameter('address', i) as string;
					const visible = this.getNodeParameter('visible', i) as boolean;

					const body = {
						address,
						visible,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/wallet/getaccount`,
						headers: {
							'TRON-PRO-API-KEY': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAccountBalance': {
					const accountIdentifier = this.getNodeParameter('accountIdentifier', i) as string;
					const blockIdentifier = this.getNodeParameter('blockIdentifier', i) as string;
					const visible = this.getNodeParameter('visible', i) as boolean;

					const body: any = {
						account_identifier: accountIdentifier,
						visible,
					};

					if (blockIdentifier) {
						body.block_identifier = blockIdentifier;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/wallet/getaccountbalance`,
						headers: {
							'TRON-PRO-API-KEY': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAccountResource': {
					const address = this.getNodeParameter('address', i) as string;
					const visible = this.getNodeParameter('visible', i) as boolean;

					const body = {
						address,
						visible,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/wallet/getaccountresource`,
						headers: {
							'TRON-PRO-API-KEY': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						body,
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

async function executeTransactionOperations(
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
          const visible = this.getNodeParameter('visible', i) as boolean;

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
              visible: visible,
            }),
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
              signature: signature,
            }),
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionById': {
          const value = this.getNodeParameter('value', i) as string;
          const visible = this.getNodeParameter('visible', i) as boolean;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/gettransactionbyid`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              value: value,
              visible: visible,
            }),
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionInfoById': {
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
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'signTransaction': {
          const transaction = this.getNodeParameter('transaction', i) as string;
          const privateKey = this.getNodeParameter('privateKey', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/gettransactionsign`,
            headers: {
              'TRON-PRO-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transaction: JSON.parse(transaction),
              privateKey: privateKey,
            }),
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

async function executeTrcTokenOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('tronApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			const baseOptions: any = {
				headers: {
					'Content-Type': 'application/json',
					'TRON-PRO-API-KEY': credentials.apiKey,
				},
				json: true,
			};

			switch (operation) {
				case 'transferTrc10': {
					const assetName = this.getNodeParameter('assetName', i) as string;
					const toAddress = this.getNodeParameter('toAddress', i) as string;
					const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;
					const amount = this.getNodeParameter('amount', i) as number;
					const visible = this.getNodeParameter('visible', i) as boolean;

					const options: any = {
						...baseOptions,
						method: 'POST',
						url: `${credentials.baseUrl}/wallet/transferasset`,
						body: {
							asset_name: assetName,
							to_address: toAddress,
							owner_address: ownerAddress,
							amount: amount,
							visible: visible,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'triggerSmartContract': {
					const contractAddress = this.getNodeParameter('contractAddress', i) as string;
					const functionSelector = this.getNodeParameter('functionSelector', i) as string;
					const parameter = this.getNodeParameter('parameter', i) as string;
					const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;
					const visible = this.getNodeParameter('visible', i) as boolean;

					const options: any = {
						...baseOptions,
						method: 'POST',
						url: `${credentials.baseUrl}/wallet/triggersmartcontract`,
						body: {
							contract_address: contractAddress,
							function_selector: functionSelector,
							parameter: parameter,
							owner_address: ownerAddress,
							visible: visible,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'triggerConstantContract': {
					const contractAddress = this.getNodeParameter('contractAddress', i) as string;
					const functionSelector = this.getNodeParameter('functionSelector', i) as string;
					const parameter = this.getNodeParameter('parameter', i) as string;
					const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;
					const visible = this.getNodeParameter('visible', i) as boolean;

					const options: any = {
						...baseOptions,
						method: 'POST',
						url: `${credentials.baseUrl}/wallet/triggerconstantcontract`,
						body: {
							contract_address: contractAddress,
							function_selector: functionSelector,
							parameter: parameter,
							owner_address: ownerAddress,
							visible: visible,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAssetList': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const options: any = {
						...baseOptions,
						method: 'GET',
						url: `${credentials.baseUrl}/v1/assets`,
						qs: {
							limit: limit,
							offset: offset,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAssetIssueByAccount': {
					const address = this.getNodeParameter('address', i) as string;
					const visible = this.getNodeParameter('visible', i) as boolean;

					const options: any = {
						...baseOptions,
						method: 'POST',
						url: `${credentials.baseUrl}/wallet/getassetissuebyaccount`,
						body: {
							address: address,
							visible: visible,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`The operation "${operation}" is not known!`,
						{
							itemIndex: i,
						},
					);
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
				continue;
			}
			throw new NodeApiError(this.getNode(), error);
		}
	}

	return returnData;
}

async function executeBlockOperations(
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
        case 'getBlock': {
          const idOrNum = this.getNodeParameter('idOrNum', i) as string;
          const detail = this.getNodeParameter('detail', i) as boolean;
          const visible = this.getNodeParameter('visible', i) as boolean;

          const body: any = {
            id_or_num: idOrNum,
            detail,
            visible,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/getblock`,
            headers: {
              'Content-Type': 'application/json',
              'TRON-PRO-API-KEY': credentials.apiKey,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockByNumber': {
          const num = this.getNodeParameter('num', i) as number;
          const visible = this.getNodeParameter('visible', i) as boolean;

          const body: any = {
            num,
            visible,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/getblockbynum`,
            headers: {
              'Content-Type': 'application/json',
              'TRON-PRO-API-KEY': credentials.apiKey,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNowBlock': {
          const visible = this.getNodeParameter('visible', i) as boolean;

          const body: any = {
            visible,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/wallet/getnowblock`,
            headers: {
              'Content-Type': 'application/json',
              'TRON-PRO-API-KEY': credentials.apiKey,