import pinataSDK, { PinataOptions } from "@pinata/sdk"
const CIDTool = require('cid-tool');

const pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY as string, process.env.REACT_APP_PINATA_SECRET_API_KEY as string);

export const pinJSONToIPFS = (body: { name: string, description?: string, image?: string }): Promise<string | void> => {
  const options = {
    pinataOptions: {
      cidVersion: 1
    } as PinataOptions
  };

  return pinata.pinJSONToIPFS(body, options).then(({ IpfsHash }) => {
    return `0x${CIDTool.format(IpfsHash, { base: 'base16' }).slice(9)}`
  }).catch((err) => {
    console.warn(err);
  });
}