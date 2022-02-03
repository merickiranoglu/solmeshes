import * as web3 from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Token } from '@solana/spl-token'

var connection = new web3.Connection(
  web3.clusterApiUrl('mainnet-beta'),
  'confirmed'
)

const cmId = 'HxrX3nN3JA8iKDJUcS4psDNe6PNeiRw7qJ3WhedDjTbR'

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: web3.PublicKey =
  new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

const SPL_ASSOCIATED_TOKEN_ACCOUNT_CM_ID: web3.PublicKey =
  new web3.PublicKey('HxrX3nN3JA8iKDJUcS4psDNe6PNeiRw7qJ3WhedDjTbR')


const MAX_NAME_LENGTH = 32
const MAX_URI_LENGTH = 200
const MAX_SYMBOL_LENGTH = 10
const MAX_CREATOR_LEN = 32 + 1 + 1

export async function getMintedTokens() {
  connection
    .getProgramAccounts(SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            offset:
              1 +
              32 +
              32 +
              4 +
              MAX_NAME_LENGTH +
              4 +
              MAX_URI_LENGTH +
              4 +
              MAX_SYMBOL_LENGTH +
              2 +
              1 +
              4 +
              0 * MAX_CREATOR_LEN,
            bytes: cmId,
          },
        },
      ],
    })
}

// run()
export default async function getWalletTokenAcounts(
  walletAdress: web3.PublicKey,
  smCollectibleAdresses: any[]
) {
  let token_accounts_by_owner_info =
    await connection.getParsedTokenAccountsByOwner(walletAdress, {
      programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    })

  let ownedAddresses = []

  if (token_accounts_by_owner_info) {
    for (let i = 0; i < token_accounts_by_owner_info.value.length; i++) {
      var tokenInfo =
        token_accounts_by_owner_info.value[i].account.data.parsed.info
      var mint = tokenInfo.mint
      var owner = tokenInfo.owner
      var tokenHolding = tokenInfo.tokenAmount.amount

      if (smCollectibleAdresses.includes(mint)) {
        if (owner == walletAdress.toBase58()) {
          if (tokenHolding === '1') {
            ownedAddresses.push(mint)
          }
        }
      }
    }
  }

  return ownedAddresses
}

export function getWalletBalance(walletAdress: web3.PublicKey) {
  return connection.getBalance(walletAdress).then((res) => {
    return res
  })
}
