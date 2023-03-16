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

  try {
    const [contributor, created] = await Contributor.findOrCreate({
      where: {contributor_name: contributor_name },
      defaults: {
      contributor_name: contributor_name,
      token: token,
    }});

    const response = {
      contributor_name: contributor.contributor_name,
      contributor_id: contributor.contributor_id,
      contributor_signature: contributor.contributor_signature,
      token: contributor.token,
    };

    if(created === true) {
      account = algosdk.generateAccount();
      mnemonic = algosdk.secretKeyToMnemonic(account.sk);
      contributor_id = account.addr;
      contributor_signature = algosdk.secretKeyToMnemonic(account.sk);
      console.log("Account Address = " + account.addr);
      console.log("Account Private Key = " + account.sk);
      console.log("Account created. Save off Mnemonic and address");
      console.log("Add funds to account using the TestNet Dispenser: ");
      console.log("https://dispenser.testnet.aws.algodev.network/ ");

          await Contributor.update({
          contributor_id: contributor_id,
          contributor_signature: contributor_signature
        }, {
            where: {contributor_name: contributor_name }
           }
        )
      response.contributor_id = contributor_id
      response.contributor_signature = contributor_signature
      }

    console.log('response', response)
    return response;
  } catch (error) {
    console.log('error', error);
    return `There was an error: ${error}`;
  }
}
module.exports = findOrCreateUser;
