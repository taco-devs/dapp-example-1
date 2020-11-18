import GrowToken from './GrowToken.json';
import GToken from './GToken.json';
import GCToken from './GCToken.json';

import { CToken, CUSDC } from './Interop';
import { DAI, USDC, USDT } from './Underlying';


const assets = {
    eth: {
        growth_token: {
            ticker: 'GRO',
            abi: GrowToken,
            address: '0x09e64c2b61a5f1690ee6fbed9baf5d6990f8dfd0',
            img_url: 'gro.png',
        },
        available_assets: {
            gcDAI: {
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                compound_id: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
                base_address: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
                gtoken_address: '0x8c659d745eB24DF270A952F68F4B1d6817c3795C',
                underlying_address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                liquidity_pool_address: '0x575d4a489efff11a9a30b7bad6a551a0010ba98d',
                base_abi: CToken,
                gtoken_abi: GCToken,
                underlying_abi: DAI,
                underlying_decimals: 1e18,
                base_decimals: 1e8,
                native: 'DAI',
                base_asset: 'cDAI',
                g_asset: 'gcDAI',
                img_url: 'cdai.png',
                native_img_url: 'dai.png',
                gtoken_img_url: 'gctoken_dai.png',
            },
            gcUSDC: {
                pair_address: "0x477fa5406598f8eb1945291867e1654c4d931659",
                compound_id: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
                base_address: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
                gtoken_address: '0x3C918ab39C4680d3eBb3EAFcA91C3494F372a20D',
                underlying_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                liquidity_pool_address: '0x0197edb9bc39ed1948f437580b2236fdc1729e98',
                base_abi: CToken,
                gtoken_abi: GCToken,
                underlying_abi: USDC,
                underlying_decimals: 1e6,
                base_decimals: 1e8,
                native: 'USDC',
                base_asset: 'cUSDC',
                g_asset: 'gcUSDC',
                img_url: 'cusdc.png',
                native_img_url: 'usdc.png',
                gtoken_img_url: 'gctoken_usdc.png',
            },
        }
    },
    ropsten: {},
    kovan: {
        growth_token: {
            ticker: 'GRO',
            abi: GrowToken,
            address: '0xfcb74f30d8949650aa524d8bf496218a20ce2db4'
        },
        available_assets: {
            gcDAI: {
                type: 1,
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                base_address: '0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad',
                gtoken_address: '0x6620A56BfC69C0694c15495c3d311C2F8EeC0261',
                underlying_address: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
                base_abi: CToken,
                gtoken_abi: GCToken,
                underlying_abi: DAI,
                underlying_decimals: 1e18,
                base_decimals: 1e8,
                native: 'DAI',
                base_asset: 'cDAI',
                g_asset: 'gcDAI',
                img_url: 'cdai.png',
                native_img_url: 'dai.png',
                gtoken_img_url: 'gctoken_dai.png',
            },
            gcUSDC: {
                type: 1,
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                base_address: '0x4a92E71227D294F041BD82dd8f78591B75140d63',
                gtoken_address: '0x151ac053B6EEEB604c957f2E1F69F797834DB39b',
                underlying_address: '0xb7a4f3e9097c08da09517b5ab877f7a917224ede',
                base_abi: CToken,
                gtoken_abi: GCToken,
                underlying_abi: USDC,
                underlying_decimals: 1e6,
                base_decimals: 1e8,
                native: 'USDC',
                base_asset: 'cUSDC',
                g_asset: 'gcUSDC',
                img_url: 'cusdc.png',
                native_img_url: 'usdc.png',
                gtoken_img_url: 'gctoken_usdc.png',
            },
            gDAI: {
                type: 2,
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                base_address: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
                gtoken_address: '0x3C9e45617AD6258FeA400Fd259Fb3eB3e671051d',
                underlying_address: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
                base_abi: DAI,
                gtoken_abi: GToken,
                underlying_abi: DAI,
                underlying_decimals: 1e18,
                base_decimals: 1e18,
                native: 'DAI',
                base_asset: 'DAI',
                g_asset: 'gDAI',
                img_url: 'dai.png',
                native_img_url: 'dai.png',
                gtoken_img_url: 'gtoken_dai.png',
            },
            gUSDC: {
                type: 2,
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                base_address: '0xb7a4f3e9097c08da09517b5ab877f7a917224ede',
                gtoken_address: '0x7AE53D7076c5Df0762A7e85fa24c01408A63c1e8', 
                underlying_address: '0xb7a4f3e9097c08da09517b5ab877f7a917224ede',
                base_abi: USDC,
                gtoken_abi: GToken,
                underlying_abi: USDC,
                underlying_decimals: 1e6,
                base_decimals: 1e6,
                native: 'USDC',
                base_asset: 'USDC',
                g_asset: 'gUDSC',
                img_url: 'usdc.png',
                native_img_url: 'usdc.png',
                gtoken_img_url: 'gtoken_usdc.png',
            },
        }

    },
    rinkeby: {},
}

export default assets;