import { CannonRegistry, OnChainRegistry } from '@usecannon/builder';

import path from 'path';
import fs from 'fs-extra';
import { CliSettings } from './settings';

import { ethers } from 'ethers';
import _ from 'lodash';

import Debug from 'debug';

const debug = Debug('cannon:cli:registry');

// in addition to loading packages from the , also stores tags locally to remember between local builds
export class LocalRegistry extends CannonRegistry {
  packagesDir: string;

  constructor(packagesDir: string) {
    super();
    this.packagesDir = packagesDir;
  }

  getTagReferenceStorage(packageRef: string, variant: string): string {
    return path.join(this.packagesDir, 'tags', `${packageRef.replace(':', '_')}_${variant}.txt`);
  }

  async getUrl(packageRef: string, variant: string): Promise<string | null> {
    const baseResolved = await super.getUrl(packageRef, variant);
    if (baseResolved) {
      return baseResolved;
    }

    debug('load local package link', packageRef, variant, 'at file', this.getTagReferenceStorage(packageRef, variant));
    return (await fs.readFile(this.getTagReferenceStorage(packageRef, variant))).toString();
  }

  async publish(packagesNames: string[], variant: string, url: string): Promise<string[]> {
    for (const packageName of packagesNames) {
      debug('package local link', packageName);
      const file = this.getTagReferenceStorage(packageName, variant);
      await fs.mkdirp(path.dirname(file));
      await fs.writeFile(file, url);
    }

    return [];
  }

  async scanDeploys(packageName: RegExp | string, variant: RegExp | string): Promise<{ name: string; variant: string }[]> {
    const allTags = await fs.readdir(path.join(this.packagesDir, 'tags'));

    debug('scanning deploys in:', path.join(this.packagesDir, 'tags'), allTags);
    debug(`looking for ${packageName}, ${variant}`);

    return allTags
      .filter((t) => {
        const [name, version, tagVariant] = t.replace('.txt', '').split('_');

        return `${name}:${version}`.match(packageName) && tagVariant.match(variant);
      })
      .map((t) => {
        const [name, version, tagVariant] = t.replace('.txt', '').split('_');
        return { name: `${name}:${version}`, variant: tagVariant };
      });
  }
}

export class FallbackRegistry implements CannonRegistry {
  registries: any[];

  constructor(registries: any[]) {
    this.registries = registries;
  }

  async getUrl(packageRef: string, variant: string): Promise<string | null> {
    for (const registry of this.registries) {
      try {
        const result = await registry.getUrl(packageRef, variant);

        if (result) {
          return result;
        }
      } catch (err) {
        debug('WARNING: error caught in registry:', err);
      }
    }

    return null;
  }

  async publish(packagesNames: string[], variant: string, url: string): Promise<string[]> {
    debug('publish to fallback database: ', packagesNames);
    // the fallback registry is usually something easy to write to or get to later
    return _.last(this.registries).publish(packagesNames, variant, url);
  }
}

export function createDefaultReadRegistry(settings: CliSettings): FallbackRegistry {
  const provider = new ethers.providers.JsonRpcProvider(settings.registryProviderUrl);

  return new FallbackRegistry([
    new OnChainRegistry({ signerOrProvider: provider, address: settings.registryAddress }),
    new LocalRegistry(settings.cannonDirectory),
  ]);
}
