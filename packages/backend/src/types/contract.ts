import type { Address, Hash, TransactionReceipt } from 'viem';

export interface Riddle {
  question: string;
  answer: string;
}

export interface ContractABI {
  abi: readonly unknown[];
}

export interface ContractConfig {
  address: Address;
  rpcUrl: string;
  privateKey: Hash;
}

export interface RiddleTransaction {
  hash: Hash;
  receipt: TransactionReceipt;
}