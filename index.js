const ApiInstance = require('iwan-sdk');
const BN = require('bn.js')
const keythereum = require("keythereum");
const wanUtil = require('wanchain-util');
const sleep = require('ko-sleep');
const fs = require('fs');
var Tx = wanUtil.wanchainTx;

//In order to get an YourApiKey and YourSecretKey, sign up at iWan. Then create a new project to get a new YourApiKey and YourSecretKey key pair.
let YourApiKey = "ae8a283e999e4fbba7ea54d6692806efea33b51bf797128a32d3d352d7a214e2";
let YourSecretKey = "7897dde450229bb1da66c8cda21639d95b0248949ad48c1b618f99f2b7e23c31";

//Subject to https://iwan.wanchain.org

// Mainnet
// let option = {
//   url: "api2.wanchain.org",
//   port: 8443,
//   flag: "ws",
//   version: "v3"
// };

// Testnet
let option = {
  url: "apitest.wanchain.org",
  port: 8443,
  flag: "ws",
  version: "v3"
};

let apiTest = new ApiInstance(YourApiKey, YourSecretKey, option);

let keyPassword = "wanglu";
let keystoreStr = fs.readFileSync("/Users/molin/Desktop/bf2.keystore.json", "utf8");
let keystore = JSON.parse(keystoreStr);
let keyAObj = { version: keystore.version, crypto: keystore.crypto };
var privKeyA = keythereum.recover(keyPassword, keyAObj);
let privateKey = privKeyA;
let myAddr = '0x' + keystore.address;
let targetGas = 220000000000;
let gGasLimit = '0x' + (200000).toString(16);
let gGasPrice = '0x' + (targetGas).toString(16);
var gValue = '0x0';

async function main() {
  for (; true;) {
    try {
      let result = await apiTest.getGasPrice('WAN');
      console.log('gasPrice:', result, (new Date()).toString());

      if (result < targetGas) {
        let nonce = await apiTest.getNonce('WAN', myAddr)
        console.log("nonce:", nonce);
        let ret = await transfer_one(myAddr, nonce);
        console.log('send result:', ret);
      }

      await sleep(5000);
    } catch (err) {
      console.log(err);
      apiTest.close();
      process.exit(1);
    }
  }
  // apiTest.close();
  // process.exit(0);
}

async function transfer_one(toAddr, serial) {
  var rawTx = {
    Txtype: '0x01',
    nonce: serial,
    gasPrice: gGasPrice,
    gasLimit: gGasLimit,
    to: toAddr,
    value: gValue
  };

  const tx = new Tx(rawTx);
  tx.sign(privateKey);
  const serializedTx = tx.serialize();
  console.log('serializedTx', "0x" + serializedTx.toString('hex'));
  let txHash = await apiTest.sendRawTransaction('WAN', "0x" + serializedTx.toString('hex'));
  console.log('txHash', txHash);
  if (txHash) {
    for(let i=0;i<10;i++) {
      try {
        let receipt = await apiTest.getTransactionReceipt('WAN', txHash);
        console.log('txReceipt status:', receipt.status);
        return receipt.status;
      } catch (error) {
        console.log(error);
        await sleep(5000);
      }
    }
  }
  return false;
}

main();