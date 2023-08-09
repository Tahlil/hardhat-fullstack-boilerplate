import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-solhint";
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, './.env') });

const chainIds = {
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  sepolia: 11155111,
  ropsten: 3,
  bsctest: 97,
  bscmain: 56,
  mumbai: 80001,
  polygon: 137,
  fuji: 43113,
  avalanche: 43114,
  alfajores: 44787,
  celo: 42220
};

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_KEY  = process.env.RPC_NODE_API_KEY;
const MNEMONIC  = process.env.MNEMONIC;
const ETHERSCAN_API_KEY  = process.env.ETHERSCAN_API_KEY as string;

const defaultRPCNodeProvider = process.env.RPC_PROVIDER as string;

const getRPCURL = (network: string, RPCNodeProvider: string) => {
  switch (RPCNodeProvider) {
    case "moralis":
      return `https://speedy-nodes-nyc.moralis.io/${API_KEY}/eth/${network}`;
      
    case "alchemy":
      return `https://eth-${network}.g.alchemy.com/v2/${API_KEY}`;
  
    case "infura":
      return `https://${network}.infura.io/v3/${API_KEY}`;
      
    case "datahub":
      return `https://ethereum-${network}--rpc.datahub.figment.io//apikey/${API_KEY}`;
      
    default:
      console.error("Unknown provider:", RPCNodeProvider);
  }
  return;
};



const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      accounts: {
        mnemonic: MNEMONIC,
      },
      chainId: chainIds.hardhat,
    },
    ropsten: {
      url: getRPCURL('ropsten', defaultRPCNodeProvider),
      accounts:  [`0x${PRIVATE_KEY}`],
      chainId: chainIds.ropsten,
    },
    rinkeby: {
      url: getRPCURL('rinkeby', defaultRPCNodeProvider),
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: chainIds.rinkeby,
    },
    kovan: {
      url: getRPCURL('kovan', defaultRPCNodeProvider),
      accounts:  [`0x${PRIVATE_KEY}`],
      chainId: chainIds.kovan,
    },
    goerli: {
      url: getRPCURL('goerli', defaultRPCNodeProvider),
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: chainIds.goerli,
    },
    sepolia: {
      url: getRPCURL('sepolia', defaultRPCNodeProvider),
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: chainIds.sepolia,
    },
    mainnet: {
      url: getRPCURL('mainnet', defaultRPCNodeProvider),
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: chainIds.mainnet,
    },
    bsctest: {
      url: 'https://data-seed-prebsc-2-s1.binance.org:8545/',
      chainId: chainIds.bsctest,
      gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    bscmain: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: chainIds.bscmain,
      gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      chainId: chainIds.mumbai,
      gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    polygon: {
      url: 'https://polygon-rpc.com/',
      chainId: chainIds.polygon,
      gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: chainIds.fuji,
      // gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      chainId: chainIds.avalanche,
      // gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    alfajores: {
      url: 'https://alfajores-forno.celo-testnet.org',
      chainId: chainIds.alfajores,
      // gasPrice: 20000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    celo: {
      url: 'https://forno.celo.org',
      chainId: chainIds.celo,
      // gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
 
  solidity: {
    compilers: [
      {
        version: '0.8.17',
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
    ],
  },
  gasReporter: {
    currency: 'USD',
    enabled: true,
  },
  typechain: {
    outDir: './typechain',
  },
  etherscan: {
    apiKey: {
      rinkeby: ETHERSCAN_API_KEY
    }
  }
};

export default config;
