import { HardhatNetworkConfig, HttpNetworkConfig } from 'hardhat/types/config';

import { Options as IPFSConnectionOptions } from 'ipfs-http-client';

declare module 'hardhat/types/config' {
  export interface ProjectPathsUserConfig {
    deployments?: string;
    cannon?: string;
  }

  export interface HardhatUserConfig {
    cannon?: {
      registryEndpoint?: string;
      registryAddress?: string;
      ipfsConnection?: IPFSConnectionOptions;
    };
  }

  export interface NetworksConfig {
    cannon: CannonNetworkConfig;
  }

  //export type NetworkConfig = NetworkConfig | HttpNetworkConfig;

  // TODO: this is a known (and apparently decided to be unsolved) issue with ts https://github.com/microsoft/TypeScript/issues/28078
  // therefore, in the future it would be best to update hardhat upstream to use the reccomended workaround and
  // remove the hardhatntework extension
  export interface CannonNetworkConfig extends HardhatNetworkConfig {
    // nothing for now
    port: number;
  }

  export interface ProjectPathsConfig {
    deployments: string;
    cannon: string;
  }

  export interface HardhatConfig {
    cannon: {
      registryEndpoint: string;
      registryAddress: string;
      ipfsConnection: IPFSConnectionOptions;
    };
  }
}
