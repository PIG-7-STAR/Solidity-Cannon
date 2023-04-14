import Debug from 'debug';
import { DeploymentInfo, StepState } from './types';
import { CannonLoader } from './loader';
import { ChainDefinition } from './definition';
import { createInitialContext } from './builder';
const debug = Debug('cannon:cli:publish');

export async function copyPackage({ packageRef, tags, variant, fromLoader, toLoader, recursive}: {
  packageRef: string,
  variant: string,
  tags: string[],
  fromLoader: CannonLoader,
  toLoader: CannonLoader,
  recursive?: boolean,
}): Promise<string[]> {
  debug(`copy package ${packageRef} (${fromLoader.getLabel()} -> ${toLoader.getLabel()})`);

  const registrationReceipts: string[] = [];

  const deployData = await fromLoader.readDeploy(packageRef, variant.split('-')[1], parseInt(variant.split('-')[0]));

  if (!deployData) {
    throw new Error(
      'ipfs could not find deployment artifact. please double check your settings, and rebuild your package.'
    );
  }
  
  const def = new ChainDefinition(deployData.def);

  if (recursive) {
    for (const stepState of Object.entries(deployData.state || {})) {
      for (const importArtifact of Object.entries((stepState[1] as StepState).artifacts.imports || {})) {
        // if there are any tags defined (even an empty array), then we assume that a publish should be done.
        // otherwise, its a non-provisioned import and we shouldn't do anything
        if (importArtifact[1].tags) {
          // copy package nested
          const nestedDeployInfo: DeploymentInfo = await fromLoader.readMisc(importArtifact[1].url);
          const nestedDef = new ChainDefinition(nestedDeployInfo.def);
          const preCtx = await createInitialContext(nestedDef, nestedDeployInfo.meta, 0, nestedDeployInfo.options);
          console.log('TARGET PRESET', stepState[0], def.getConfig(stepState[0], preCtx));
          registrationReceipts.push(...await copyPackage({
            packageRef: `${nestedDef.getName(preCtx)}:${nestedDef.getVersion(preCtx)}`,
            variant: `${variant.split('-')[0]}-${def.getConfig(stepState[0], preCtx).targetPreset}`,
            tags: importArtifact[1].tags || [],
            fromLoader,
            toLoader,
            recursive
          }));
        }
      }
    }
  }

  const miscUrl = await toLoader.putMisc(await fromLoader.readMisc(deployData!.miscUrl));

  const metaUrl = await fromLoader.resolver.getMetaUrl(packageRef, variant);
  let newMetaUrl = metaUrl;

  if (metaUrl) {
    newMetaUrl = await toLoader.putMisc(await fromLoader.readMisc(metaUrl));
  }
  const url = await toLoader.putDeploy(deployData!);

  if (!url ||/*url !== toPublishUrl || */newMetaUrl !== metaUrl || miscUrl !== deployData.miscUrl) {
    throw new Error('re-deployed urls do not match up');
  }

  const preCtx = await createInitialContext(def, deployData.meta, 0, deployData.options);

  registrationReceipts.push(
    ...await toLoader.resolver.publish(
      [def.getVersion(preCtx), ...tags].map((t) => `${def.getName(preCtx)}:${t}`),
      variant,
      url,
      metaUrl || undefined
    )
  );

  return registrationReceipts;
}