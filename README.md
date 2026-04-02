# n8n-nodes-tron

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for interacting with the Tron blockchain network. This node provides access to 5 core resources with comprehensive operations for account management, transaction processing, TRC token interactions, block exploration, and smart contract operations.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tron](https://img.shields.io/badge/Tron-TRX-red)
![Blockchain](https://img.shields.io/badge/Blockchain-Web3-green)
![DeFi](https://img.shields.io/badge/DeFi-Compatible-orange)

## Features

- **Account Operations** - Retrieve account information, balances, transaction history, and account resources
- **Transaction Management** - Create, sign, broadcast, and monitor Tron network transactions
- **TRC Token Support** - Full support for TRC-10 and TRC-20 token operations and transfers
- **Block Explorer Functions** - Access block data, transaction details, and network statistics
- **Smart Contract Integration** - Deploy, call, and interact with Tron smart contracts
- **Real-time Network Data** - Get current network status, node information, and chain parameters
- **Energy & Bandwidth Tracking** - Monitor and manage Tron network resource consumption
- **Multi-signature Support** - Handle complex transaction signing scenarios

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
| API Key | Your Tron API key for network access | Yes |
| Network | Tron network (mainnet, shasta, nile) | Yes |
| API Endpoint | Custom API endpoint URL (optional) | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Account Info | Retrieve detailed account information including balance and resources |
| Get Account Balance | Get TRX balance for a specific account |
| Get Account Resources | Check bandwidth and energy resources for an account |
| Get Transaction History | Retrieve transaction history for an account |
| Create Account | Create a new Tron account |
| Update Account | Update account information |
| Freeze Balance | Freeze TRX to gain bandwidth or energy |
| Unfreeze Balance | Unfreeze previously frozen TRX |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve transaction details by transaction ID |
| Create Transaction | Create a new transaction |
| Sign Transaction | Sign a transaction with private key |
| Broadcast Transaction | Broadcast a signed transaction to the network |
| Get Transaction Receipt | Get transaction execution receipt and status |
| Estimate Transaction Fee | Calculate estimated transaction fees |
| Get Transaction List | Retrieve multiple transactions with filters |
| Validate Transaction | Validate transaction format and signatures |

### 3. TrcToken

| Operation | Description |
|-----------|-------------|
| Get Token Info | Retrieve TRC token information and metadata |
| Get Token Balance | Check token balance for a specific account |
| Transfer Token | Transfer TRC tokens between accounts |
| Get Token Holders | List token holders and their balances |
| Create Token | Create a new TRC-10 token |
| Update Token | Update token parameters |
| Get Token Transactions | Retrieve token transaction history |
| Approve Token Spending | Approve token spending for TRC-20 tokens |

### 4. Block

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block information by block number or hash |
| Get Latest Block | Get the most recent block on the chain |
| Get Block Range | Retrieve multiple blocks within a specified range |
| Get Block Transactions | Get all transactions within a specific block |
| Get Block Count | Get total number of blocks on the chain |
| Get Block Producers | List current block producers and their status |
| Get Network Info | Retrieve current network statistics and parameters |

### 5. SmartContract

| Operation | Description |
|-----------|-------------|
| Deploy Contract | Deploy a new smart contract to the Tron network |
| Call Contract | Execute a smart contract function call |
| Get Contract Info | Retrieve smart contract information and ABI |
| Get Contract Events | Retrieve events emitted by smart contract |
| Estimate Contract Call | Estimate energy cost for contract execution |
| Trigger Constant Contract | Call contract view/pure functions |
| Get Contract Code | Retrieve smart contract bytecode |
| Validate Contract | Validate contract ABI and bytecode |

## Usage Examples

```javascript
// Get account information
{
  "address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  "visible": true
}
```

```javascript
// Transfer TRX tokens
{
  "to_address": "TLPcGVErFdPDQjGUgkNedUzFc6nUhSS1Qx",
  "amount": 1000000,
  "from_address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  "visible": true
}
```

```javascript
// Get latest block information
{
  "detail": true,
  "visible": true
}
```

```javascript
// Call smart contract function
{
  "contract_address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  "function_selector": "transfer(address,uint256)",
  "parameter": "000000000000000000000000a614f803b6fd780986a42c78ec9c7f77e6ded13c0000000000000000000000000000000000000000000000000000000000000064",
  "owner_address": "TLPcGVErFdPDQjGUgkNedUzFc6nUhSS1Qx",
  "visible": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid Address | Tron address format is incorrect | Verify address format and checksum |
| Insufficient Balance | Account lacks sufficient TRX or energy | Check account balance and resources |
| Contract Call Failed | Smart contract execution reverted | Review contract parameters and state |
| Network Timeout | Request timed out waiting for response | Retry request or check network connectivity |
| Invalid Transaction | Transaction format or signature invalid | Verify transaction structure and signing |
| Rate Limit Exceeded | API rate limit has been exceeded | Implement request throttling or upgrade plan |

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
- **Tron Documentation**: [developers.tron.network](https://developers.tron.network)
- **Tron API Reference**: [tronapi.com](https://tronapi.com)