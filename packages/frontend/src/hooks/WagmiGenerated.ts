import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OnchainRiddle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const onchainRiddleAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      { name: 'correct', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'AnswerAttempt',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'riddle',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'RiddleSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'Winner',
  },
  {
    type: 'function',
    inputs: [],
    name: 'bot',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'riddle',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_riddle', internalType: 'string', type: 'string' },
      { name: '_answerHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'setRiddle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_answer', internalType: 'string', type: 'string' }],
    name: 'submitAnswer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'winner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link onchainRiddleAbi}__
 */
export const useReadOnchainRiddle = /*#__PURE__*/ createUseReadContract({
  abi: onchainRiddleAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link onchainRiddleAbi}__ and `functionName` set to `"bot"`
 */
export const useReadOnchainRiddleBot = /*#__PURE__*/ createUseReadContract({
  abi: onchainRiddleAbi,
  functionName: 'bot',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link onchainRiddleAbi}__ and `functionName` set to `"isActive"`
 */
export const useReadOnchainRiddleIsActive = /*#__PURE__*/ createUseReadContract(
  { abi: onchainRiddleAbi, functionName: 'isActive' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link onchainRiddleAbi}__ and `functionName` set to `"riddle"`
 */
export const useReadOnchainRiddleRiddle = /*#__PURE__*/ createUseReadContract({
  abi: onchainRiddleAbi,
  functionName: 'riddle',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link onchainRiddleAbi}__ and `functionName` set to `"winner"`
 */
export const useReadOnchainRiddleWinner = /*#__PURE__*/ createUseReadContract({
  abi: onchainRiddleAbi,
  functionName: 'winner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link onchainRiddleAbi}__
 */
export const useWriteOnchainRiddle = /*#__PURE__*/ createUseWriteContract({
  abi: onchainRiddleAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link onchainRiddleAbi}__ and `functionName` set to `"setRiddle"`
 */
export const useWriteOnchainRiddleSetRiddle =
  /*#__PURE__*/ createUseWriteContract({
    abi: onchainRiddleAbi,
    functionName: 'setRiddle',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link onchainRiddleAbi}__ and `functionName` set to `"submitAnswer"`
 */
export const useWriteOnchainRiddleSubmitAnswer =
  /*#__PURE__*/ createUseWriteContract({
    abi: onchainRiddleAbi,
    functionName: 'submitAnswer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link onchainRiddleAbi}__
 */
export const useSimulateOnchainRiddle = /*#__PURE__*/ createUseSimulateContract(
  { abi: onchainRiddleAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link onchainRiddleAbi}__ and `functionName` set to `"setRiddle"`
 */
export const useSimulateOnchainRiddleSetRiddle =
  /*#__PURE__*/ createUseSimulateContract({
    abi: onchainRiddleAbi,
    functionName: 'setRiddle',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link onchainRiddleAbi}__ and `functionName` set to `"submitAnswer"`
 */
export const useSimulateOnchainRiddleSubmitAnswer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: onchainRiddleAbi,
    functionName: 'submitAnswer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link onchainRiddleAbi}__
 */
export const useWatchOnchainRiddleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: onchainRiddleAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link onchainRiddleAbi}__ and `eventName` set to `"AnswerAttempt"`
 */
export const useWatchOnchainRiddleAnswerAttemptEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: onchainRiddleAbi,
    eventName: 'AnswerAttempt',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link onchainRiddleAbi}__ and `eventName` set to `"RiddleSet"`
 */
export const useWatchOnchainRiddleRiddleSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: onchainRiddleAbi,
    eventName: 'RiddleSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link onchainRiddleAbi}__ and `eventName` set to `"Winner"`
 */
export const useWatchOnchainRiddleWinnerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: onchainRiddleAbi,
    eventName: 'Winner',
  })
