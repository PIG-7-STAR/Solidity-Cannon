/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers';
import type { Provider, TransactionRequest } from '@ethersproject/providers';
import type { PromiseOrValue } from '../../common';
import type { Proxy, ProxyInterface } from '../../contracts/Proxy';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'firstImplementation',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'contr',
        type: 'address',
      },
    ],
    name: 'NotAContract',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroAddress',
    type: 'error',
  },
  {
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];

const _bytecode =
  '0x608060405234801561001057600080fd5b50604051610331380380610331833981810160405281019061003291906101e3565b80600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561009a576040517fd92e233d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6100ad8161014560201b6100471760201c565b6100ee57806040517f8a8b41ec0000000000000000000000000000000000000000000000000000000081526004016100e5919061021f565b60405180910390fd5b806100fd61015860201b60201c565b60000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505061023a565b600080823b905060008111915050919050565b60007f32402780481dd8149e50baad867f01da72e2f7d02639a6fe378dbd80b6bb446e905090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101b082610185565b9050919050565b6101c0816101a5565b81146101cb57600080fd5b50565b6000815190506101dd816101b7565b92915050565b6000602082840312156101f9576101f8610180565b5b6000610207848285016101ce565b91505092915050565b610219816101a5565b82525050565b60006020820190506102346000830184610210565b92915050565b60e9806102486000396000f3fe608060405236601057600e6018565b005b60166018565b005b60006020605a565b90503660008037600080366000845af43d6000803e80600081146042573d6000f35b3d6000fd5b600080823b905060008111915050919050565b60006062608b565b60000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60007f32402780481dd8149e50baad867f01da72e2f7d02639a6fe378dbd80b6bb446e90509056fea2646970667358221220a2ac656fcca9603c2d4916fbb4e317bc1c7b3185c06b3c4358ed882c10bd97c864736f6c634300080b0033';

type ProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Proxy__factory extends ContractFactory {
  constructor(...args: ProxyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    firstImplementation: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Proxy> {
    return super.deploy(firstImplementation, overrides || {}) as Promise<Proxy>;
  }
  override getDeployTransaction(
    firstImplementation: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(firstImplementation, overrides || {});
  }
  override attach(address: string): Proxy {
    return super.attach(address) as Proxy;
  }
  override connect(signer: Signer): Proxy__factory {
    return super.connect(signer) as Proxy__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ProxyInterface {
    return new utils.Interface(_abi) as ProxyInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Proxy {
    return new Contract(address, _abi, signerOrProvider) as Proxy;
  }
}
