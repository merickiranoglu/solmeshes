import * as web3 from '@solana/web3.js'
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'
import { decodeMetadata } from './utils'
let connection = new web3.Connection('https://rpc.ankr.com/solana', 'confirmed')
const METADATA_PUBKEY = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)
const MAX_NAME_LENGTH = 32
const MAX_URI_LENGTH = 200
const MAX_SYMBOL_LENGTH = 10
const MAX_CREATOR_LEN = 32 + 1 + 1
const MAX_CREATOR_LIMIT = 5
const MAX_DATA_SIZE =
  4 +
  MAX_NAME_LENGTH +
  4 +
  MAX_SYMBOL_LENGTH +
  4 +
  MAX_URI_LENGTH +
  2 +
  1 +
  4 +
  MAX_CREATOR_LIMIT * MAX_CREATOR_LEN
const MAX_METADATA_LEN = 1 + 32 + 32 + MAX_DATA_SIZE + 1 + 1 + 9 + 172
const CREATOR_ARRAY_START =
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
  4

const TOKEN_METADATA_PROGRAM = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)
const CANDY_MACHINE_V2_PROGRAM = new PublicKey(
  'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ'
)
const candyMachineId = new PublicKey(
  'HxrX3nN3JA8iKDJUcS4psDNe6PNeiRw7qJ3WhedDjTbR'
)
export async function getNft(address: string) {
  const keyOfNFT: web3.PublicKey = new web3.PublicKey(address)

  let [pda, bump] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      METADATA_PUBKEY.toBuffer(),
      new PublicKey(address).toBuffer(),
    ],
    METADATA_PUBKEY
  )

  const data = {
    jsonrpc: '2.0',
    id: 1,
    method: 'getAccountInfo',
    params: [
      pda.toBase58(),
      {
        encoding: 'base64',
      },
    ],
  }
  return await fetch('https://api.mainnet-beta.solana.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      let buf = Buffer.from(data.result.value.data[0], 'base64')
      let m = decodeMetadata(buf)
      return fetch(m.data.uri)
        .then((res) => res.json())
        .then((data) => {
          return data
        })
    })
    .catch((e) => {})
}
