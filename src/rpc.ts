import { signTypedData_v4 } from "eth-sig-util";
import { toBuffer } from 'ethereumjs-util';

export const send = (provider: any, method: string, params?: any[]) => new Promise<any>((resolve, reject) => {
  const _provider = provider.provider || provider;
  _provider
          .send(method, params)
          .then((r: any) => resolve(r))
          .catch((e: any) => reject(e));
});

export interface RSV {
  r: string;
  s: string;
  v: number;
}

export const signData = async (provider: any, typeData: any): Promise<RSV> => {
  const pkeyBuffer = toBuffer(provider.privateKey.substr(0,2) === '0x' ? provider.privateKey : `0x${provider.privateKey}`);

  const result = signTypedData_v4(pkeyBuffer, {
    data: typeData,
  });

  return {
    r: result.slice(0, 66),
    s: '0x' + result.slice(66, 130),
    v: parseInt(result.slice(130, 132), 16),
  };
};

let chainIdOverride: null | number = null;
export const setChainIdOverride = (id: number) => { chainIdOverride = id };
export const getChainId = async (provider: any): Promise<any> => chainIdOverride || send(provider, 'eth_chainId');

export const call = (provider: any, to: string, data: string) => send(provider, 'eth_call', [{
  to,
  data,
}, 'latest']);
