import type { Address } from 'viem';

// Contract configuration with dynamic address from environment variables
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as Address;

// Validate that the contract address is set
if (!CONTRACT_ADDRESS) {
    throw new Error('❌ VITE_CONTRACT_ADDRESS environment variable is required');
}

console.log('📋 Contract Address loaded:', CONTRACT_ADDRESS);