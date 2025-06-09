export interface EnvironmentVariables {
  VITE_CONTRACT_ADDRESS: string;
  VITE_RPC_URL: string;
  PRIVATE_KEY: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariables {}
  }
}