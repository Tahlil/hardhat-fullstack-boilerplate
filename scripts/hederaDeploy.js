const path = require('path');

require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });
const nftABIDetails = require('../artifacts/contracts/tokenization/NFT.sol/NFT.json');
const marketplaceABIDetails = require('../artifacts/contracts/marketplace/Marketplace.sol/Marketplace.json');
const facadeABIDetails = require('../artifacts/contracts/protocol/Facade.sol/Facade.json');
const {
	AccountId,
	PrivateKey,
	Client,
	// FileCreateTransaction,
	// ContractCreateTransaction,
	ContractFunctionParameters,
	ContractExecuteTransaction,
	// ContractCallQuery,
	// Hbar,
	ContractCreateFlow,
} = require("@hashgraph/sdk");

const {
	NETWORK_ADDRESS,
	PLATFORM_ADDRESS,
	PLATFORM_PRIMARY_PERCENTAGE,
	PLATFORM_SECONDARY_PERCENTAGE,
	NETWORK_PRIMARY_PERCENTAGE,
	NETWORK_SECONDARY_PERCENTAGE,
	ARTIST_PRIMARY_PERCENTAGE,
	ARTIST_SECONDARY_PERCENTAGE,
} = process.env;

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
	// Import the compiled contract bytecode
	const nftContractBytecode = nftABIDetails.bytecode.slice(2);
	const marketplaceContractBytecode = marketplaceABIDetails.bytecode.slice(2);
	const facadeContractBytecode = facadeABIDetails.bytecode.slice(2);
	// Instantiate the smart contract
	let contractInstantiateTx = new ContractCreateFlow()
		.setBytecode(nftContractBytecode)
		.setGas(500000);

	let contractInstantiateSubmit = await contractInstantiateTx.execute(client);
	let contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
	let contractId = contractInstantiateRx.contractId;
	const nftContractId = contractId;
	let contractAddress = contractId.toSolidityAddress();
	console.log(`- The NFT smart contract ID is: ${contractId} \n`);
	console.log(`- The NFT smart contract ID in Solidity format is: ${contractAddress} \n`);
	const nftAddress = "0x" + contractAddress;


	contractInstantiateTx = new ContractCreateFlow()
		.setBytecode(marketplaceContractBytecode)
		.setGas(500000)
		.setConstructorParameters(
			new ContractFunctionParameters()
				.addAddress(PLATFORM_ADDRESS)
				.addAddress(NETWORK_ADDRESS)
				.addUint256(Number(PLATFORM_PRIMARY_PERCENTAGE))
				.addUint256(Number(PLATFORM_SECONDARY_PERCENTAGE))
				.addUint256(Number(NETWORK_PRIMARY_PERCENTAGE))
				.addUint256(Number(NETWORK_SECONDARY_PERCENTAGE))
				.addUint256(Number(ARTIST_PRIMARY_PERCENTAGE))
				.addUint256(Number(ARTIST_SECONDARY_PERCENTAGE))
		);
	contractInstantiateSubmit = await contractInstantiateTx.execute(client);
	contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
	contractId = contractInstantiateRx.contractId;
	const marketplaceContractId = contractId;

	contractAddress = contractId.toSolidityAddress();
	console.log(`- The Marketplace smart contract ID is: ${contractId} \n`);
	console.log(`- The Marketplace smart contract ID in Solidity format is: ${contractAddress} \n`);
	const marketplaceAddress = "0x" + contractAddress;


	contractInstantiateTx = new ContractCreateFlow()
		.setBytecode(facadeContractBytecode)
		.setGas(500000)
		.setConstructorParameters(
			new ContractFunctionParameters().addAddress(nftAddress).addAddress(marketplaceAddress)
		);
	contractInstantiateSubmit = await contractInstantiateTx.execute(client);
	contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
	contractId = contractInstantiateRx.contractId;
	contractAddress = contractId.toSolidityAddress();
	console.log(`- The Facade smart contract ID is: ${contractId} \n`);
	console.log(`- The Facade smart contract ID in Solidity format is: ${contractAddress} \n`);
	const facadeAddress = "0x" + contractAddress;

	// Initialize the contracts
	let contractExecuteTx = new ContractExecuteTransaction()
		.setContractId(nftContractId)
		.setGas(200000)
		.setFunction(
			"configureFacadeCaller",
			new ContractFunctionParameters().addAddress(facadeAddress)
		);
	let contractExecuteSubmit = await contractExecuteTx.execute(client);
	let contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
	console.log(`- Initialize NFT contract : ${contractExecuteRx.status} \n`);

	contractExecuteTx = new ContractExecuteTransaction()
		.setContractId(marketplaceContractId)
		.setGas(200000)
		.setFunction(
			"configureFacadeCaller",
			new ContractFunctionParameters().addAddress(facadeAddress)
		);
	contractExecuteSubmit = await contractExecuteTx.execute(client);
	contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
	console.log(`- Initialize Marketplace contract : ${contractExecuteRx.status} \n`);

}
main();