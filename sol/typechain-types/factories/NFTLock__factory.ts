/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { NFTLock, NFTLockInterface } from "../NFTLock";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "isLocked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060ae8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063f6aacfb114602d575b600080fd5b604d60383660046061565b60009081526020819052604090205460ff1690565b604051901515815260200160405180910390f35b6000602082840312156071578081fd5b503591905056fea2646970667358221220c9a8e75d97c90b71f4bd774bdfb6b0b79ba467f2367f0025346097c0046855f864736f6c63430008040033";

type NFTLockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NFTLockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class NFTLock__factory extends ContractFactory {
  constructor(...args: NFTLockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "NFTLock";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<NFTLock> {
    return super.deploy(overrides || {}) as Promise<NFTLock>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): NFTLock {
    return super.attach(address) as NFTLock;
  }
  connect(signer: Signer): NFTLock__factory {
    return super.connect(signer) as NFTLock__factory;
  }
  static readonly contractName: "NFTLock";
  public readonly contractName: "NFTLock";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NFTLockInterface {
    return new utils.Interface(_abi) as NFTLockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NFTLock {
    return new Contract(address, _abi, signerOrProvider) as NFTLock;
  }
}
