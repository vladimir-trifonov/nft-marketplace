import { create as ipfsHttpClient } from "ipfs-http-client"
const CIDTool = require("cid-tool")

const infura = "https://ipfs.infura.io"
const ipfs = ipfsHttpClient({ url: `${infura}:5001/api/v0` })

export const add = async (payload: any, isImage: boolean = false): Promise<string | void> => {
  const res = await ipfs.add(payload, { cidVersion: 1, hashAlg: "blake2b-208" })
  if (isImage) return `${infura}/ipfs/${res.path}`
  return `0x${CIDTool.format(res.path, { base: "base16" }).slice(1)}`
}