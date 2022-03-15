/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { NFT, NFTInterface } from "../NFT";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "exists",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "lock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_market",
        type: "address",
      },
    ],
    name: "setMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "i",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "ml",
        type: "uint8",
      },
    ],
    name: "uint2hex64str",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "unlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051806060016040528060228152602001620023e760229139620000378162000049565b50620000433362000062565b62000197565b80516200005e906002906020840190620000b4565b5050565b600480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b828054620000c2906200015a565b90600052602060002090601f016020900481019282620000e6576000855562000131565b82601f106200010157805160ff191683800117855562000131565b8280016001018555821562000131579182015b828111156200013157825182559160200191906001019062000114565b506200013f92915062000143565b5090565b5b808211156200013f576000815560010162000144565b600181811c908216806200016f57607f821691505b602082108114156200019157634e487b7160e01b600052602260045260246000fd5b50919050565b61224080620001a76000396000f3fe608060405234801561001057600080fd5b50600436106101205760003560e01c80636dcea85f116100ad578063bd85b03911610071578063bd85b0391461027a578063dd4670641461029a578063e985e9c5146102ad578063f242432a146102e9578063f2fde38b146102fc57600080fd5b80636dcea85f1461021e578063715018a6146102315780638da5cb5b1461023957806394bf804d14610254578063a22cb4651461026757600080fd5b80632eb2c2d6116100f45780632eb2c2d6146101a35780633ff947a0146101b65780634e1273f4146101c95780634f558e79146101e95780636198e3391461020b57600080fd5b8062fdd58e1461012557806301ffc9a71461014b5780630e89341c1461016e57806323b872dd1461018e575b600080fd5b610138610133366004611bea565b61030f565b6040519081526020015b60405180910390f35b61015e610159366004611cde565b6103d1565b6040519015158152602001610142565b61018161017c366004611d16565b610421565b6040516101429190611f25565b6101a161019c366004611b12565b61045a565b005b6101a16101b1366004611a6c565b610754565b6101816101c4366004611d50565b6107eb565b6101dc6101d7366004611c13565b610953565b6040516101429190611ee4565b61015e6101f7366004611d16565b600090815260036020526040902054151590565b6101a1610219366004611d16565b610ab1565b6101a161022c366004611a19565b610b24565b6101a1610bbb565b6004546040516001600160a01b039091168152602001610142565b6101a1610262366004611d2e565b610bf1565b6101a1610275366004611bb0565b610d30565b610138610288366004611d16565b60009081526003602052604090205490565b6101a16102a8366004611d16565b610d3f565b61015e6102bb366004611a3a565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205460ff1690565b6101a16102f7366004611b4d565b610db5565b6101a161030a366004611a19565b610e3c565b60006001600160a01b03831661037c5760405162461bcd60e51b815260206004820152602760248201527f4e46543a2062616c616e636520717565727920666f7220746865207a65726f206044820152666164647265737360c81b60648201526084015b60405180910390fd5b600554610392906001600160a01b031683610ed7565b60011480156103ba57506000828152600660205260409020546001600160a01b038481169116145b156103c7575060016103cb565b5060005b92915050565b60006001600160e01b03198216636cdb3d1360e11b148061040257506001600160e01b031982166303a24d0760e21b145b806103cb57506301ffc9a760e01b6001600160e01b03198316146103cb565b606060006104308360406107eb565b9050806040516020016104439190611e08565b604051602081830303815290604052915050919050565b6005546001600160a01b03166104a85760405162461bcd60e51b81526020600482015260136024820152721391950e881b585c9ad95d081b9bdd081cd95d606a1b6044820152606401610373565b6005546001600160a01b031633146105025760405162461bcd60e51b815260206004820152601d60248201527f4e46543a2063616c6c6572206973206e6f7420746865206d61726b65740000006044820152606401610373565b6001600160a01b0383166105585760405162461bcd60e51b815260206004820152601760248201527f4e46543a20746f6b656e206e6f7420666f722073616c650000000000000000006044820152606401610373565b6000818152600660205260409020546001600160a01b03166105b35760405162461bcd60e51b81526020600482015260146024820152731391950e881d1bdad95b881b9bdd08195e1a5cdd60621b6044820152606401610373565b60008181526007602052604090205460ff1615156001141561060b5760405162461bcd60e51b81526020600482015260116024820152701391950e881d1bdad95b881b1bd8dad959607a1b6044820152606401610373565b6001600160a01b03821661066b5760405162461bcd60e51b815260206004820152602160248201527f4e46543a207472616e7366657220746f20746865207a65726f206164647265736044820152607360f81b6064820152608401610373565b336001600160a01b03831614156106bd5760405162461bcd60e51b815260206004820152601660248201527527232a1d103cb7ba9037bbb7103a3432903a37b5b2b760511b6044820152606401610373565b6000818152600660205260409020546001600160a01b03848116911614806106ea57506106ea33806102bb565b6107445760405162461bcd60e51b815260206004820152602560248201527f4e46543a2063616c6c6572206973206e6f74206f776e6572206e6f72206170706044820152641c9bdd995960da1b6064820152608401610373565b61074f838383610f69565b505050565b6001600160a01b038516331480610770575061077085336102bb565b6107d75760405162461bcd60e51b815260206004820152603260248201527f455243313135353a207472616e736665722063616c6c6572206973206e6f74206044820152711bdddb995c881b9bdc88185c1c1c9bdd995960721b6064820152608401610373565b6107e48585858585610fe1565b5050505050565b60608261081057506040805180820190915260018152600360fc1b60208201526103cb565b8260005b811561083357806108248161210b565b915050600482901c9150610814565b849150600f60008267ffffffffffffffff81111561086157634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f19166020018201604052801561088b576020820181803683370190505b509050825b841561091257848316600981116108b4576108ac816030612068565b60f81b6108c3565b6108bf816037612068565b60f81b5b836108cd846120c7565b935083815181106108ee57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600486901c955050610890565b815b8760ff168151101561094757806040516020016109319190611ddf565b6040516020818303038152906040529050610914565b98975050505050505050565b606081518351146109b45760405162461bcd60e51b815260206004820152602560248201527f4e46543a206163636f756e747320616e6420696473206c656e677468206d69736044820152640dac2e8c6d60db1b6064820152608401610373565b6000835167ffffffffffffffff8111156109de57634e487b7160e01b600052604160045260246000fd5b604051908082528060200260200182016040528015610a07578160200160208202803683370190505b50905060005b8451811015610aa957610a6e858281518110610a3957634e487b7160e01b600052603260045260246000fd5b6020026020010151858381518110610a6157634e487b7160e01b600052603260045260246000fd5b602002602001015161030f565b828281518110610a8e57634e487b7160e01b600052603260045260246000fd5b6020908102919091010152610aa28161210b565b9050610a0d565b509392505050565b6000818152600660205260409020546001600160a01b0316331415610b0c5760405162461bcd60e51b815260206004820152601160248201527027232a1d103737ba1030b71037bbb732b960791b6044820152606401610373565b6000908152600760205260409020805460ff19169055565b6004546001600160a01b03163314610b4e5760405162461bcd60e51b81526004016103739061200f565b6001600160a01b038116610b995760405162461bcd60e51b81526020600482015260126024820152714e46543a2057726f6e67206164647265737360701b6044820152606401610373565b600580546001600160a01b0319166001600160a01b0392909216919091179055565b6004546001600160a01b03163314610be55760405162461bcd60e51b81526004016103739061200f565b610bef60006111e8565b565b6005546001600160a01b0316610c3f5760405162461bcd60e51b81526020600482015260136024820152721391950e881b585c9ad95d081b9bdd081cd95d606a1b6044820152606401610373565b6005546001600160a01b03163314610c995760405162461bcd60e51b815260206004820152601d60248201527f4e46543a2063616c6c6572206973206e6f7420746865206d61726b65740000006044820152606401610373565b60008281526003602052604090205415610cf55760405162461bcd60e51b815260206004820152601960248201527f4e46543a20746f6b656e20616c7265616479206d696e746564000000000000006044820152606401610373565b6060610d04338460018461123a565b600083815260066020526040902080546001600160a01b0319163390811790915561074f90838561045a565b610d3b33838361134a565b5050565b6000818152600660205260409020546001600160a01b0316331415610d9a5760405162461bcd60e51b815260206004820152601160248201527027232a1d103737ba1030b71037bbb732b960791b6044820152606401610373565b6000908152600760205260409020805460ff19166001179055565b6001600160a01b038516331480610dd15750610dd185336102bb565b610e2f5760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2063616c6c6572206973206e6f74206f776e6572206e6f7260448201526808185c1c1c9bdd995960ba1b6064820152608401610373565b6107e4858585858561142b565b6004546001600160a01b03163314610e665760405162461bcd60e51b81526004016103739061200f565b6001600160a01b038116610ecb5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610373565b610ed4816111e8565b50565b60006001600160a01b038316610f435760405162461bcd60e51b815260206004820152602b60248201527f455243313135353a2062616c616e636520717565727920666f7220746865207a60448201526a65726f206164647265737360a81b6064820152608401610373565b506000908152602081815260408083206001600160a01b03949094168352929052205490565b60008181526006602090815260409182902080546001600160a01b0319166001600160a01b0386811691821790925583518581526001938101939093528351339491939288169285927fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6292918290030190a450505050565b81518351146110435760405162461bcd60e51b815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206044820152670dad2e6dac2e8c6d60c31b6064820152608401610373565b6001600160a01b0384166110695760405162461bcd60e51b815260040161037390611f80565b33611078818787878787611548565b60005b845181101561117a5760008582815181106110a657634e487b7160e01b600052603260045260246000fd5b6020026020010151905060008583815181106110d257634e487b7160e01b600052603260045260246000fd5b602090810291909101810151600084815280835260408082206001600160a01b038e1683529093529190912054909150818110156111225760405162461bcd60e51b815260040161037390611fc5565b6000838152602081815260408083206001600160a01b038e8116855292528083208585039055908b1682528120805484929061115f908490612068565b92505081905550505050806111739061210b565b905061107b565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516111ca929190611ef7565b60405180910390a46111e081878787878761168c565b505050505050565b600480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b03841661129a5760405162461bcd60e51b815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f206164647265736044820152607360f81b6064820152608401610373565b336112ba816000876112ab886117f7565b6112b4886117f7565b87611548565b6000848152602081815260408083206001600160a01b0389168452909152812080548592906112ea908490612068565b909155505060408051858152602081018590526001600160a01b0380881692600092918516917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a46107e481600087878787611850565b816001600160a01b0316836001600160a01b031614156113be5760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c20737461747573604482015268103337b91039b2b63360b91b6064820152608401610373565b6001600160a01b03838116600081815260016020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0384166114515760405162461bcd60e51b815260040161037390611f80565b336114618187876112ab886117f7565b6000848152602081815260408083206001600160a01b038a168452909152902054838110156114a25760405162461bcd60e51b815260040161037390611fc5565b6000858152602081815260408083206001600160a01b038b81168552925280832087850390559088168252812080548692906114df908490612068565b909155505060408051868152602081018690526001600160a01b03808916928a821692918616917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a461153f828888888888611850565b50505050505050565b6001600160a01b0385166115eb5760005b83518110156115e95782818151811061158257634e487b7160e01b600052603260045260246000fd5b6020026020010151600360008684815181106115ae57634e487b7160e01b600052603260045260246000fd5b6020026020010151815260200190815260200160002060008282546115d39190612068565b909155506115e290508161210b565b9050611559565b505b6001600160a01b0384166111e05760005b835181101561153f5782818151811061162557634e487b7160e01b600052603260045260246000fd5b60200260200101516003600086848151811061165157634e487b7160e01b600052603260045260246000fd5b6020026020010151815260200190815260200160002060008282546116769190612080565b9091555061168590508161210b565b90506115fc565b6001600160a01b0384163b156111e05760405163bc197c8160e01b81526001600160a01b0385169063bc197c81906116d09089908990889088908890600401611e4d565b602060405180830381600087803b1580156116ea57600080fd5b505af192505050801561171a575060408051601f3d908101601f1916820190925261171791810190611cfa565b60015b6117c757611726612152565b806308c379a01415611760575061173b61216a565b806117465750611762565b8060405162461bcd60e51b81526004016103739190611f25565b505b60405162461bcd60e51b815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e20455243313135356044820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b6064820152608401610373565b6001600160e01b0319811663bc197c8160e01b1461153f5760405162461bcd60e51b815260040161037390611f38565b6040805160018082528183019092526060916000919060208083019080368337019050509050828160008151811061183f57634e487b7160e01b600052603260045260246000fd5b602090810291909101015292915050565b6001600160a01b0384163b156111e05760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e61906118949089908990889088908890600401611e9f565b602060405180830381600087803b1580156118ae57600080fd5b505af19250505080156118de575060408051601f3d908101601f191682019092526118db91810190611cfa565b60015b6118ea57611726612152565b6001600160e01b0319811663f23a6e6160e01b1461153f5760405162461bcd60e51b815260040161037390611f38565b80356001600160a01b038116811461193157600080fd5b919050565b600082601f830112611946578081fd5b8135602061195382612044565b60405161196082826120de565b8381528281019150858301600585901b8701840188101561197f578586fd5b855b8581101561199d57813584529284019290840190600101611981565b5090979650505050505050565b600082601f8301126119ba578081fd5b813567ffffffffffffffff8111156119d4576119d461213c565b6040516119eb601f8301601f1916602001826120de565b8181528460208386010111156119ff578283fd5b816020850160208301379081016020019190915292915050565b600060208284031215611a2a578081fd5b611a338261191a565b9392505050565b60008060408385031215611a4c578081fd5b611a558361191a565b9150611a636020840161191a565b90509250929050565b600080600080600060a08688031215611a83578081fd5b611a8c8661191a565b9450611a9a6020870161191a565b9350604086013567ffffffffffffffff80821115611ab6578283fd5b611ac289838a01611936565b94506060880135915080821115611ad7578283fd5b611ae389838a01611936565b93506080880135915080821115611af8578283fd5b50611b05888289016119aa565b9150509295509295909350565b600080600060608486031215611b26578283fd5b611b2f8461191a565b9250611b3d6020850161191a565b9150604084013590509250925092565b600080600080600060a08688031215611b64578081fd5b611b6d8661191a565b9450611b7b6020870161191a565b93506040860135925060608601359150608086013567ffffffffffffffff811115611ba4578182fd5b611b05888289016119aa565b60008060408385031215611bc2578182fd5b611bcb8361191a565b915060208301358015158114611bdf578182fd5b809150509250929050565b60008060408385031215611bfc578182fd5b611c058361191a565b946020939093013593505050565b60008060408385031215611c25578182fd5b823567ffffffffffffffff80821115611c3c578384fd5b818501915085601f830112611c4f578384fd5b81356020611c5c82612044565b604051611c6982826120de565b8381528281019150858301600585901b870184018b1015611c88578889fd5b8896505b84871015611cb157611c9d8161191a565b835260019690960195918301918301611c8c565b5096505086013592505080821115611cc7578283fd5b50611cd485828601611936565b9150509250929050565b600060208284031215611cef578081fd5b8135611a33816121f4565b600060208284031215611d0b578081fd5b8151611a33816121f4565b600060208284031215611d27578081fd5b5035919050565b60008060408385031215611d40578182fd5b82359150611a636020840161191a565b60008060408385031215611d62578182fd5b82359150602083013560ff81168114611bdf578182fd5b6000815180845260208085019450808401835b83811015611da857815187529582019590820190600101611d8c565b509495945050505050565b60008151808452611dcb816020860160208601612097565b601f01601f19169290920160200192915050565b600360fc1b815260008251611dfb816001850160208701612097565b9190910160010192915050565b7f68747470733a2f2f697066732e696f2f697066732f6630313535313232300000815260008251611e4081601e850160208701612097565b91909101601e0192915050565b6001600160a01b0386811682528516602082015260a060408201819052600090611e7990830186611d79565b8281036060840152611e8b8186611d79565b905082810360808401526109478185611db3565b6001600160a01b03868116825285166020820152604081018490526060810183905260a060808201819052600090611ed990830184611db3565b979650505050505050565b602081526000611a336020830184611d79565b604081526000611f0a6040830185611d79565b8281036020840152611f1c8185611d79565b95945050505050565b602081526000611a336020830184611db3565b60208082526028908201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b606082015260800190565b60208082526025908201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604082015264647265737360d81b606082015260800190565b6020808252602a908201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60408201526939103a3930b739b332b960b11b606082015260800190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b600067ffffffffffffffff82111561205e5761205e61213c565b5060051b60200190565b6000821982111561207b5761207b612126565b500190565b60008282101561209257612092612126565b500390565b60005b838110156120b257818101518382015260200161209a565b838111156120c1576000848401525b50505050565b6000816120d6576120d6612126565b506000190190565b601f8201601f1916810167ffffffffffffffff811182821017156121045761210461213c565b6040525050565b600060001982141561211f5761211f612126565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b600060033d111561216757600481823e5160e01c5b90565b600060443d10156121785790565b6040516003193d81016004833e81513d67ffffffffffffffff81602484011181841117156121a857505050505090565b82850191508151818111156121c05750505050505090565b843d87010160208285010111156121da5750505050505090565b6121e9602082860101876120de565b509095945050505050565b6001600160e01b031981168114610ed457600080fdfea26469706673582212207fa9253fae83a837525a9a74dc24742268340ec3880068378db676df989eb86464736f6c6343000804003368747470733a2f2f697066732e696f2f697066732f6630313535313232307b69647d";

type NFTConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NFTConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class NFT__factory extends ContractFactory {
  constructor(...args: NFTConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "NFT";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<NFT> {
    return super.deploy(overrides || {}) as Promise<NFT>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): NFT {
    return super.attach(address) as NFT;
  }
  connect(signer: Signer): NFT__factory {
    return super.connect(signer) as NFT__factory;
  }
  static readonly contractName: "NFT";
  public readonly contractName: "NFT";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NFTInterface {
    return new utils.Interface(_abi) as NFTInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): NFT {
    return new Contract(address, _abi, signerOrProvider) as NFT;
  }
}
