# n8n-nodes-tron

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Tron blockchain providing 5 resources and 14+ operations for TRX transfers, TRC-20 tokens, account management, and blockchain queries.

![n8n](https://img.shields.io/badge/n8n-community--node-brightgreen)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.10-brightgreen)

## Features

| Resource | Operations | Description |
|----------|------------|-------------|
| **Account** | Get Balance, Get Account Info, Get Resources | Query account data, balances, bandwidth, and energy |
| **Transaction** | Send TRX, Get Transaction, Get Transaction Info | Transfer TRX and query transaction details |
| **TRC-20 Token** | Get Token Info, Get Balance, Transfer | Interact with TRC-20 tokens |
| **Block** | Get Current Block, Get Block By Number | Query blockchain blocks |
| **Utility** | Validate Address, TRX↔Sun Conversion, Generate Address | Helper functions and address tools |

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-tron`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n nodes directory
cd ~/.n8n/nodes

# Clone or extract the package
git clone https://github.com/Velocity-BPA/n8n-nodes-tron.git

# Install dependencies and build
cd n8n-nodes-tron
npm install
npm run build

# Restart n8n
```

### Development Installation

```bash
# Extract the zip file
unzip n8n-nodes-tron.zip
cd n8n-nodes-tron

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n nodes directory
mkdir -p ~/.n8n/nodes
ln -s $(pwd) ~/.n8n/nodes/n8n-nodes-tron

# Restart n8n
n8n start
```

## Credentials Setup

1. Go to **Settings** > **Credentials** in n8n
2. Click **Add Credential**
3. Search for **Tron API**
4. Configure the following:

| Field | Description | Required |
|-------|-------------|----------|
| **Network** | Mainnet, Shasta, Nile, or Custom | Yes |
| **Private Key** | For signing transactions | For write operations |
| **TronGrid API Key** | For enhanced rate limits | No |

### Network Options

| Network | URL | Use Case |
|---------|-----|----------|
| Mainnet | https://api.trongrid.io | Production |
| Shasta | https://api.shasta.trongrid.io | Testing |
| Nile | https://nile.trongrid.io | Testing |
| Custom | Your URL | Private nodes |

## Resources & Operations

### Account Resource

| Operation | Description | Required Fields |
|-----------|-------------|-----------------|
| **Get Balance** | Get TRX balance of an address | Address |
| **Get Account Info** | Get detailed account information | Address |
| **Get Resources** | Get bandwidth and energy info | Address |

### Transaction Resource

| Operation | Description | Required Fields |
|-----------|-------------|-----------------|
| **Send TRX** | Send TRX to an address | To Address, Amount |
| **Get Transaction** | Get transaction by ID | Transaction ID |
| **Get Transaction Info** | Get detailed transaction info | Transaction ID |

### TRC-20 Token Resource

| Operation | Description | Required Fields |
|-----------|-------------|-----------------|
| **Get Token Info** | Get token name, symbol, decimals | Contract Address |
| **Get Balance** | Get token balance for an address | Contract Address, Owner Address |
| **Transfer** | Transfer tokens to an address | Contract Address, To Address, Amount |

### Block Resource

| Operation | Description | Required Fields |
|-----------|-------------|-----------------|
| **Get Current Block** | Get the latest block | None |
| **Get Block By Number** | Get a specific block | Block Number |

### Utility Resource

| Operation | Description | Required Fields |
|-----------|-------------|-----------------|
| **Validate Address** | Check if address is valid | Address |
| **Convert TRX to Sun** | Convert TRX to Sun | TRX Amount |
| **Convert Sun to TRX** | Convert Sun to TRX | Sun Amount |
| **Generate Address** | Create a new Tron address | None |

## Usage Examples

### Get Account Balance

```json
{
  "resource": "account",
  "operation": "getBalance",
  "address": "TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW"
}
```

### Send TRX

```json
{
  "resource": "transaction",
  "operation": "sendTrx",
  "toAddress": "TRecipientAddress...",
  "amount": 10
}
```

### Get TRC-20 Token Balance

```json
{
  "resource": "trc20",
  "operation": "getTokenBalance",
  "contractAddress": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  "ownerAddress": "TYourAddress..."
}
```

## Tron Blockchain Concepts

### Units
- **TRX**: Native Tron token
- **Sun**: Smallest unit (1 TRX = 1,000,000 Sun)

### Address Formats
- **Base58**: Starts with `T` (e.g., `TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW`)
- **Hex**: Starts with `41` (e.g., `41a614f803b6fd780986a42c78ec9c7f77e6ded13c`)

### Resources
- **Bandwidth**: Required for all transactions
- **Energy**: Required for smart contract calls

### Popular TRC-20 Tokens
| Token | Contract Address |
|-------|------------------|
| USDT | `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` |
| USDC | `TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8` |
| WTRX | `TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR` |

## Networks

| Network | Chain ID | Description |
|---------|----------|-------------|
| Mainnet | - | Production network |
| Shasta | - | Public testnet (free test TRX from faucet) |
| Nile | - | Development testnet |

## Error Handling

The node handles common errors:

- **Invalid Address**: Address validation before operations
- **Insufficient Balance**: Checked before transactions
- **Missing Private Key**: Required for write operations
- **Network Errors**: Automatic retry with backoff

## Security Best Practices

1. **Never expose private keys** in workflows
2. **Use credentials** to store sensitive data
3. **Test on Shasta/Nile** before mainnet
4. **Verify addresses** before sending transactions
5. **Set appropriate gas limits** for TRC-20 transfers

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Fix lint issues
npm run lint:fix
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please ensure all contributions comply with the BSL 1.1 license.

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-tron/issues)
- **Email**: licensing@velobpa.com

## Acknowledgments

- [TronWeb](https://github.com/tronprotocol/tronweb) - Tron JavaScript SDK
- [n8n](https://n8n.io) - Workflow automation platform
- [TronGrid](https://www.trongrid.io/) - Tron API infrastructure
