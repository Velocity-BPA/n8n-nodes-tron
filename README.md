# n8n-nodes-tron

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node that provides comprehensive integration with the Tron blockchain network. This node offers 5 resources covering accounts, transactions, TRC20 tokens, blocks, and smart contracts, enabling developers to build powerful blockchain automation workflows with real-time data access and transaction capabilities.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tron](https://img.shields.io/badge/Tron-TRX-red)
![Blockchain](https://img.shields.io/badge/Blockchain-API-green)
![TRC20](https://img.shields.io/badge/TRC20-Tokens-orange)

## Features

- **Account Management** - Query account balances, resources, and transaction history across the Tron network
- **Transaction Processing** - Create, broadcast, and monitor Tron transactions with full parameter control
- **TRC20 Token Support** - Complete TRC20 token operations including transfers, balance queries, and contract interactions
- **Block Explorer Functionality** - Access block data, transaction details, and network statistics in real-time
- **Smart Contract Integration** - Deploy, interact with, and monitor smart contracts on the Tron blockchain
- **Multi-Network Support** - Connect to Mainnet, Testnet (Nile), and custom Tron network endpoints
- **Real-time Monitoring** - Track blockchain events and transaction confirmations with polling capabilities
- **Energy Optimization** - Built-in energy and bandwidth management for cost-effective operations

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-tron`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-tron
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-tron.git
cd n8n-nodes-tron
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-tron
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Tron API key from TronGrid or TronScan | Yes |
| Network | Target network (Mainnet, Testnet, Custom) | Yes |
| API Endpoint | Custom API endpoint URL (when using Custom network) | No |
| Rate Limit | Requests per second limit (default: 10) | No |

## Resources & Operations

### 1. Accounts

| Operation | Description |
|-----------|-------------|
| Get Account | Retrieve account information including balance and resources |
| Get Balance | Get TRX balance for a specific account |
| Get Transactions | List transactions for an account with pagination |
| Get Resources | Get bandwidth and energy information for an account |
| Freeze Balance | Freeze TRX to gain bandwidth or energy |
| Unfreeze Balance | Unfreeze previously frozen TRX |

### 2. Transactions

| Operation | Description |
|-----------|-------------|
| Create Transaction | Create a new transaction with specified parameters |
| Sign Transaction | Sign a transaction with private key |
| Broadcast Transaction | Broadcast a signed transaction to the network |
| Get Transaction | Retrieve transaction details by hash |
| Get Transaction Info | Get detailed transaction execution information |
| Transfer TRX | Simple TRX transfer between accounts |

### 3. Trc20Tokens

| Operation | Description |
|-----------|-------------|
| Get Token Balance | Get TRC20 token balance for an account |
| Transfer Tokens | Transfer TRC20 tokens between accounts |
| Get Token Info | Retrieve token contract information and metadata |
| Approve Tokens | Approve token spending allowance |
| Get Allowance | Check approved token allowance amount |
| Get Token Transactions | List token transfer transactions |

### 4. Blocks

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block information by number or hash |
| Get Latest Block | Get the most recent block on the network |
| Get Block Range | Get multiple blocks within a specified range |
| Get Block Transactions | List all transactions in a specific block |
| Get Network Stats | Get current network statistics and metrics |

### 5. SmartContracts

| Operation | Description |
|-----------|-------------|
| Deploy Contract | Deploy a new smart contract to the Tron network |
| Call Contract | Execute a smart contract function call |
| Get Contract | Retrieve contract information and ABI |
| Get Contract Events | Query contract events and logs |
| Estimate Energy | Estimate energy consumption for contract calls |
| Trigger Constant Contract | Call read-only contract functions |

## Usage Examples

```javascript
// Get account balance
const accountInfo = {
  "address": "TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH",
  "balance": 1500000000,
  "trc20": {
    "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t": "1000000000"
  }
};

// Transfer TRX between accounts
const transferResult = {
  "transaction": {
    "txID": "7c2d4206c2276624aadc409a9d875e94de9c05e5e51e21f16f2b5d2c832d2e4e",
    "raw_data": {
      "contract": [{
        "parameter": {
          "value": {
            "amount": 1000000,
            "owner_address": "TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH",
            "to_address": "TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW"
          }
        },
        "type": "TransferContract"
      }]
    }
  }
};

// Query TRC20 token balance
const tokenBalance = {
  "address": "TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH",
  "contract_address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  "balance": "1000000000",
  "decimals": 6,
  "symbol": "USDT"
};

// Get latest block information
const blockInfo = {
  "blockID": "0000000002b5fb8c1d7c4c8e6b5f4a1b2c3d4e5f6789abcdef0123456789abcdef",
  "block_header": {
    "raw_data": {
      "number": 45678476,
      "txTrieRoot": "0x9c47d1dfa5a5a3b8d9c7e0b8f2a1c5d6e8f4a2b7c9d1e6f8a3b5c7d9e0f2a4b6",
      "parentHash": "0000000002b5fb8b7f2e4d1c9a8b5f3e6d2c5a8f4e1d7c3a9f6e2b8d5c1a7e4f",
      "timestamp": 1640995200000
    }
  },
  "transactions": []
};
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| `INVALID_ADDRESS` | Tron address format is incorrect | Verify address format (starts with T, 34 characters) |
| `INSUFFICIENT_BALANCE` | Account lacks sufficient TRX or tokens | Check account balance before transaction |
| `ENERGY_NOT_ENOUGH` | Insufficient energy for smart contract call | Freeze TRX for energy or use fee delegation |
| `BANDWIDTH_NOT_ENOUGH` | Insufficient bandwidth for transaction | Wait for bandwidth regeneration or freeze TRX |
| `API_RATE_LIMIT` | API request limit exceeded | Implement request throttling or upgrade API plan |
| `CONTRACT_VALIDATE_ERROR` | Smart contract validation failed | Review contract parameters and ABI |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-tron/issues)
- **Tron Documentation**: [Tron Developer Hub](https://developers.tron.network/)
- **TronGrid API**: [TronGrid Documentation](https://www.trongrid.io/)