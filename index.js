const ApiInstance = require('iwan-sdk');

//In order to get an YourApiKey and YourSecretKey, sign up at iWan. Then create a new project to get a new YourApiKey and YourSecretKey key pair.
let YourApiKey = "ae8a283e999e4fbba7ea54d6692806efea33b51bf797128a32d3d352d7a214e2";
let YourSecretKey = "7897dde450229bb1da66c8cda21639d95b0248949ad48c1b618f99f2b7e23c31";

//Subject to https://iwan.wanchain.org
let option = {
  url: "api2.wanchain.org",
  port: 8443,
  flag: "ws",
  version: "v3"
};

let apiTest = new ApiInstance(YourApiKey, YourSecretKey, option);

let testArray = [
  ['getBalance', 'WAN', '0x4e6b5f1abdd517739889334df047113bd736c546'],
  ['getRegTokens', 'ETH'],
  ['getMultiTokenInfo', 'ETH', ["0xc5bc855056d99ef4bda0a4ae937065315e2ae11a","0x7017500899433272b4088afe34c04d742d0ce7df"]],
  ['getEpochID', 'WAN'],
  ['getSlotID', 'WAN'],
  ['getStakerInfo', 'WAN', 5989868],
  ['getEpochIncentivePayDetail', 'WAN', 18253],
  ['getEpochIncentivePayDetail', 'WAN', 18203],
  ['getValidatorInfo', 'WAN', '0x7212b9e259792879d85ca3227384f1005437e5f5'],
  ['getValidatorStakeInfo', 'WAN', '0x7212b9e259792879d85ca3227384f1005437e5f5'],
  ['getValidatorTotalIncentive', 'WAN', '0x7212b9e259792879d85ca3227384f1005437e5f5'],
  ['getDelegatorStakeInfo', 'WAN', '0x4e6b5f1abdd517739889334df047113bd736c546'],
  ['getDelegatorIncentive', 'WAN', '0x4e6b5f1abdd517739889334df047113bd736c546'],
  ['getDelegatorTotalIncentive', 'WAN', '0x4e6b5f1abdd517739889334df047113bd736c546'],
  ['getCurrentEpochInfo', 'WAN'],
  ['getCurrentStakerInfo', 'WAN'],
  ['getSlotCount', 'WAN'],
  ['getSlotTime', 'WAN'],
  ['getValidatorSupStakeInfo', 'WAN', ['0x7212b9e259792879d85ca3227384f1005437e5f5']],
  ['getDelegatorSupStakeInfo', 'WAN', '0x4e6b5f1abdd517739889334df047113bd736c546'],
  ['getEpochIncentiveBlockNumber', 'WAN', 18253],
  ['getEpochStakeOut', 'WAN', 18253],
  ['getMultiBalances', 'WAN', ['0x7212b9e259792879d85ca3227384f1005437e5f5', '0x4e6b5f1abdd517739889334df047113bd736c546']],

];

async function main() {
  try {
    console.log('Total:', testArray.length);
    let result = await apiTest.getBalance('WAN', '0x4e6b5f1abdd517739889334df047113bd736c546');
    console.log('balance:', result);

    for (let i=0; i<testArray.length; i++) {
      await apiCall(testArray[i][0], testArray[i][1], testArray[i][2]);
    }
    apiTest.close();
    process.exit(0);
  } catch (err) {
    console.log(err);
    apiTest.close();
    process.exit(1);
  }
}

let count = 0;
async function apiCall(name, chain = 'WAN', value) {
  let start = Date.now();
  await apiTest[name](chain, value);
  console.log(count++, name, (Date.now() - start)/1000 + ' s');
}

main();