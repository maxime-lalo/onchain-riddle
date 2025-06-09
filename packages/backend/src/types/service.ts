export interface IBackgroundService {
  start(): Promise<void>;
  stop(): void;
  checkAndInitializeContract(): Promise<void>;
  handleWinnerEvent(): Promise<void>;
  setNewRiddle(): Promise<void>;
}

export interface ServiceState {
  isRunning: boolean;
  unwatchEvents: (() => void) | null;
}