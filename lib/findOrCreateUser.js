const { Contributor } = require("../server/db");
const algosdk = require('algosdk');

async function findOrCreateUser(
  /*owner:*/ owner,
  /*repo:*/ repo,
  /*contributor_id:*/ contributor_id,
  /*contributor_name:*/ contributor_name,
  /*contributor_signature:*/ contributor_signature,
  /*token:*/ token
) {
  if(contributor_id === 'none' || contributor_signature === 'none'){
    account = algosdk.generateAccount();
    mnemonic = algosdk.secretKeyToMnemonic(account.sk);
    contributor_id = account.addr;
    contributor_signature = algosdk.secretKeyToMnemonic(account.sk);
    console.log("Account Address = " + account.addr);
    console.log("Account Private Key = " + account.sk);
    console.log("Account created. Save off Mnemonic and address");
    console.log("Add funds to account using the TestNet Dispenser: ");
    console.log("https://dispenser.testnet.aws.algodev.network/ ");
  }

  try {
    const [contributor, created] = await Contributor.findOrCreate({
      where: {contributor_name: contributor_name },
      defaults: {
      contributor_id: contributor_id,
      contributor_name: contributor_name,
      contributor_signature: contributor_signature,
      token: token,
    }});
    const response = {
      contributor_name: contributor.contributor_name,
      contributor_id: contributor.contributor_id,
      contributor_signature: contributor.contributor_signature,
      token: contributor.token,
    };
    console.log('response', response.contributor_name)
    return response;
  } catch (error) {
    console.log('error', error);
    return `There was an error: ${error}`;
  }
}
module.exports = findOrCreateUser;
