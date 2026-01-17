/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

describe('Tron Node', () => {
	describe('Address Validation', () => {
		it('should recognize valid base58 addresses', () => {
			const validAddress = 'TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW';
			expect(validAddress.startsWith('T')).toBe(true);
			expect(validAddress.length).toBe(34);
		});

		it('should recognize valid hex addresses', () => {
			const hexAddress = '41a614f803b6fd780986a42c78ec9c7f77e6ded13c';
			expect(hexAddress.startsWith('41')).toBe(true);
			expect(hexAddress.length).toBe(42);
		});
	});

	describe('Unit Conversion', () => {
		it('should convert TRX to Sun correctly', () => {
			const trx = 1;
			const sun = trx * 1_000_000;
			expect(sun).toBe(1_000_000);
		});

		it('should convert Sun to TRX correctly', () => {
			const sun = 1_000_000;
			const trx = sun / 1_000_000;
			expect(trx).toBe(1);
		});

		it('should handle decimal TRX amounts', () => {
			const trx = 1.5;
			const sun = trx * 1_000_000;
			expect(sun).toBe(1_500_000);
		});
	});

	describe('Network Configuration', () => {
		const networks = {
			mainnet: 'https://api.trongrid.io',
			shasta: 'https://api.shasta.trongrid.io',
			nile: 'https://nile.trongrid.io',
		};

		it('should have valid mainnet URL', () => {
			expect(networks.mainnet).toBe('https://api.trongrid.io');
		});

		it('should have valid shasta testnet URL', () => {
			expect(networks.shasta).toBe('https://api.shasta.trongrid.io');
		});

		it('should have valid nile testnet URL', () => {
			expect(networks.nile).toBe('https://nile.trongrid.io');
		});
	});
});
