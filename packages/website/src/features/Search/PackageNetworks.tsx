import { GetPackagesQuery } from '@/types/graphql/graphql';
import { FC, useMemo, useRef, useState } from 'react';
import { Box, Text, Button, Spinner, Heading } from '@chakra-ui/react';
import chainData from '@/constants/chainsData';
import axios from 'axios';
import pako from 'pako';
import { ChainArtifacts } from '@usecannon/builder';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Copy } from 'react-feather';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';
import _ from 'lodash';
import { useCopy } from '@/lib/copy';
import { CodePreview } from '@/components/CodePreview'; //Example style, you can use another

type Package = GetPackagesQuery['packages'][0];
type Tag = Package['tags'][0];

const PackageNetworks: FC<{
  p: Package | Pick<Tag, 'variants'>;
  download?: boolean;
}> = ({ p, download = false }) => {
  // const toast = useToast();
  const chains = useMemo(() => {
    let variants: Tag['variants'] | undefined = [];

    if ('tags' in p) {
      const latestTag = p.tags?.find((t) => t.name == 'latest');
      variants = latestTag?.variants?.filter((v) => v.preset == 'main') || [];
    } else if ('variants' in p) {
      variants = p.variants || [];
    }
    return variants
      ?.map((v) => {
        return { id: v.chain_id, url: v?.deploy_url, ...chainData[v.chain_id] };
      })
      .sort((a, b) => {
        if (a.id === 13370) {
          return -1;
        } else if (b.id === 13370) {
          return 1;
        } else {
          return a.id - b.id;
        }
      });
  }, [p]);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deployUrl = useRef('');
  const ipfs = useRef<any>(undefined);
  const deployData = useRef('');

  // TODO: Remove unused chainId param? (added console.log to fix TS build)
  const openModal = async (url: string, chainId: number) => {
    console.log(chainId);

    setIsOpen(true);
    deployUrl.current = url;

    setLoading(true);
    const response = await axios.get(
      `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`,
      { responseType: 'arraybuffer' }
    );

    // Parse IPFS data
    const uint8Array = new Uint8Array(response.data);
    const inflated = pako.inflate(uint8Array);
    const raw = new TextDecoder().decode(inflated);
    ipfs.current = JSON.parse(raw);

    const { def, state } = ipfs.current;

    const artifacts: ChainArtifacts = {};
    for (const step of def.topologicalActions) {
      if (state[step] && state[step].artifacts) {
        _.merge(artifacts, state[step].artifacts);
      }
    }

    deployData.current = JSON.stringify(artifacts?.contracts, null, 2);

    setLoading(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    deployUrl.current = '';
  };

  const copyToClipboard = useCopy();
  const copy = () => {
    void copyToClipboard(deployData.current);
  };
  return (
    <Box verticalAlign="middle">
      <Text
        height="24px"
        fontSize="sm"
        display="inline-block"
        mr="2"
        transform="translateY(-4px)"
        opacity="0.8"
      >
        <strong>
          {download ? 'Download ' : ''}Deployment{download ? ' Data' : 's'}:
        </strong>
      </Text>
      {chains?.map((chain) => {
        return (
          <Button
            size="xs"
            mr="2"
            mb="2"
            key={chain.id}
            colorScheme={chain.color || 'whiteAlpha'}
            opacity="download ? '0.8' : '0.7 !important'"
            isDisabled={!download}
            className={!download ? 'disabled-button' : ''}
            onClick={() => {
              if (download) {
                void openModal(chain.url, chain.id);
              }
            }}
          >
            {chain.name || chain.id}
          </Button>
        );
      })}

      <Modal size="5xl" isOpen={isOpen} onClose={closeModal}>
        <ModalContent bg="black" color="white" ref="content">
          <ModalHeader>
            <Heading size="lg">Contract Addresses + ABIs</Heading>
          </ModalHeader>
          <ModalCloseButton onClick={closeModal} />
          <ModalBody>
            {loading && (
              <Box py="20" textAlign="center">
                <Spinner />
              </Box>
            )}
            {deployUrl.current ? (
              <Box>
                <Button color="teal" mb="3" bg="teal.600" onClick={copy}>
                  <Copy className="copy-button" />
                  &nbsp;Copy to clipboard
                </Button>
                {/*    <client-only placeholder={deployData}>*/}
                {/*    <prism-editor*/}
                {/*      class="code-editor"*/}
                {/*      v-model="deployData"*/}
                {/*    highlight={highlighter}*/}
                {/*    ></prism-editor>*/}
                {/*</client-only>*/}
                <CodePreview code={deployData.current} language={'json'} />
              </Box>
            ) : (
              <Box textAlign="center" py="20" opacity="0.5">
                Contract Addresses & ABIs unavailable
              </Box>
            )}
          </ModalBody>
        </ModalContent>
        <ModalOverlay bg="blue.900" opacity="0.66" />
      </Modal>
    </Box>
  );
};

export default PackageNetworks;
