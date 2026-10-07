import { BlockInfo as DemoBlockInfo, BLOCK_TYPE as DEMO_BLOCK_TYPE } from "./demo-block";

// The loader convention (block add-on contract §1): default-export an
// install function that registers the block and RETURNS the config.
export default function install(config: any) {
  config.blocks.blocksConfig[DEMO_BLOCK_TYPE] = DemoBlockInfo;
  return config;
}
