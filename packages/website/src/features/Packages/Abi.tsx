import { FC, useMemo } from 'react';
import { Abi as AbiType, AbiFunction } from 'abitype/src/abi';
import { ChainArtifacts } from '@usecannon/builder';
import { Box } from '@chakra-ui/react';
import { Function } from '@/features/Packages/Function';

export const Abi: FC<{
  abi: AbiType;
  address: string;
  cannonOutputs: ChainArtifacts;
}> = ({ abi, address, cannonOutputs }) => {
  const functions = useMemo<AbiFunction[]>(
    () => abi.filter((a) => a.type === 'function') as AbiFunction[],
    [abi]
  );

  return (
    <Box mb="2">
      {functions.map((f, index) => (
        <Box key={index}>
          <Function f={f} address={address} cannonOutputs={cannonOutputs} />
        </Box>
      ))}
    </Box>
  );
};
