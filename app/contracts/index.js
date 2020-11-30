import GrowToken from './GrowToken.json';
import GToken from './GToken.json';
import GCToken from './GCToken.json';
import StkGRO from './StkGRO.json';

import { CToken, CUSDC } from './Interop';
import { DAI, USDC, WBTC, WETH } from './Underlying';

import types from './token_types.json';


const assets = {
    eth: {
        growth_token: {
            ticker: 'GRO',
            abi: GrowToken,
            address: '0x09e64c2b61a5f1690ee6fbed9baf5d6990f8dfd0',
            img_url: 'gro.png',
        },
        available_assets: {
            stkGRO: {
                type: types.STKGRO,
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                // compound_id: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
                base_address: '0x09e64c2b61a5f1690ee6fbed9baf5d6990f8dfd0',
                gtoken_address: '0xD93f98b483CC2F9EFE512696DF8F5deCB73F9497',
                underlying_address: '0x09e64c2b61a5f1690ee6fbed9baf5d6990f8dfd0',
                // liquidity_pool_address: '0x575d4a489efff11a9a30b7bad6a551a0010ba98d',
                base_abi: GrowToken,
                gtoken_abi: StkGRO,
                underlying_abi: GrowToken,
                underlying_decimals: 1e18,
                base_decimals: 1e18,
                card_name: 'Staked GRO',
                native: 'GRO',
                base_asset: 'GRO',
                g_asset: 'stkGRO',
                img_url: 'gro.png',
                native_img_url: 'gro.png',
                gtoken_img_url: 'stkgro.png',
            },
            gWBTC: {
                type: types.PMT,
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                base_address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
                gtoken_address: '0xe567B3174af8eA368ed536998a597147Ec29De8f', 
                underlying_address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
                base_abi: WBTC,
                gtoken_abi: GToken,
                underlying_abi: WBTC,
                underlying_decimals: 1e8,
                base_decimals: 1e8  ,
                native: 'wBTC',
                base_asset: 'wBTC',
                g_asset: 'gwBTC',
                img_url: 'wbtc.png',
                native_img_url: 'wbtc.png',
                gtoken_img_url: 'gtoken_wbtc.png',
            },
            gcWBTC: {
                type: types.TYPE1,
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                base_address: '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4',
                gtoken_address: '0x1085045eF3f1564e4dA4C7315C0B7448d82d5D32', 
                underlying_address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
                base_abi: CToken,
                gtoken_abi: GCToken,
                underlying_abi: WBTC,
                underlying_decimals: 1e8,
                base_decimals: 1e8  ,
                native: 'wBTC',
                base_asset: 'cwBTC',
                g_asset: 'gcwBTC',
                img_url: 'cwbtc.png',
                native_img_url: 'wbtc.png',
                gtoken_img_url: 'gtoken_cwbtc.png',
            },
            gETH: {
                type: types.GETH,
                // pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                // compound_id: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
                base_address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                gtoken_address: '0x3eEE7Fe99640c47ABF43Cd2C2B6A80EB785e38cf',
                underlying_address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                // liquidity_pool_address: '0x575d4a489efff11a9a30b7bad6a551a0010ba98d',
                base_abi: WETH,
                gtoken_abi: GToken,
                underlying_abi: WETH,
                underlying_decimals: 1e18,
                base_decimals: 1e18,
                native: 'ETH',
                base_asset: 'ETH',
                g_asset: 'gETH',
                img_url: 'eth.png',
                native_img_url: 'eth.png',
                gtoken_img_url: 'gtoken_eth.png',
            },
            gcETH: {
                type: types.TYPE_ETH,
                // pair_address: "0x477fa5406598f8eb1945291867e1654c4d931659",
                // compound_id: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
                base_address: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
                gtoken_address: '0xF510949599b90f78A0B40aae82539D09b9bE9e28',
                underlying_address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                // liquidity_pool_address: '0x0197edb9bc39ed1948f437580b2236fdc1729e98',
                base_abi: CToken,
                gtoken_abi: GCToken,
                underlying_abi: WETH,
                underlying_decimals: 1e18,
                base_decimals: 1e8,
                native: 'ETH',
                base_asset: 'cETH',
                g_asset: 'gcETH',
                img_url: 'ceth.png',
                native_img_url: 'eth.png',
                gtoken_img_url: 'gctoken_eth.png',
            },
            gDAI: {
                type: types.PMT,
                // pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                // compound_id: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
                base_address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                gtoken_address: '0x5301988A8EB906a65b57e9BAF4750A3C74e3E635',
                underlying_address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                // liquidity_pool_address: '0x575d4a489efff11a9a30b7bad6a551a0010ba98d',
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
            gcDAI: {
                type: types.TYPE1,
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
            gUSDC: {
                type: types.PMT,
                // pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                // compound_id: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
                base_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                gtoken_address: '0x6dfaabaf237174Fb5E2c12e2130613d64E1a4bbe',
                underlying_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                // liquidity_pool_address: '0x575d4a489efff11a9a30b7bad6a551a0010ba98d',
                base_abi: USDC,
                gtoken_abi: GToken,
                underlying_abi: USDC,
                underlying_decimals: 1e6,
                base_decimals: 1e6,
                native: 'USDc',
                base_asset: 'USDC',
                g_asset: 'gUSDC',
                img_url: 'usdc.png',
                native_img_url: 'usdc.png',
                gtoken_img_url: 'gtoken_usdc.png',
            },
            gcUSDC: {
                type: types.TYPE1,
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
            stkGRO: {
                type: types.STKGRO,
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                base_address: '0xfcb74f30d8949650aa524d8bf496218a20ce2db4',
                gtoken_address: '0x760FbB334dbbc15B9774e3d9fA0def86C0A6e7Af',
                underlying_address: '0xfcb74f30d8949650aa524d8bf496218a20ce2db4',
                base_abi: GrowToken,
                gtoken_abi: StkGRO,
                underlying_abi: GrowToken,
                underlying_decimals: 1e18,
                base_decimals: 1e18,
                native: 'GRO',
                base_asset: 'GRO',
                g_asset: 'stkGRO',
                img_url: 'gro.png',
                native_img_url: 'gro.png',
                gtoken_img_url: 'stkgro.png',
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
                g_asset: 'gUSDC',
                img_url: 'usdc.png',
                native_img_url: 'usdc.png',
                gtoken_img_url: 'gtoken_usdc.png',
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
            gETH: {
                type: 2,
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                base_address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
                gtoken_address: '0x71910006C4A68bb0d49160270999e4B935c27b0d', 
                underlying_address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
                base_abi: WETH,
                gtoken_abi: GToken,
                underlying_abi: WETH,
                underlying_decimals: 1e18,
                base_decimals: 1e18,
                native: 'ETH',
                base_asset: 'ETH',
                g_asset: 'gETH',
                img_url: 'eth.png',
                native_img_url: 'eth.png',
                gtoken_img_url: 'gtoken_eth.png',
            },
            gcETH: {
                type: 1,
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                base_address: '0x41b5844f4680a8c38fbb695b7f9cfd1f64474a72',
                gtoken_address: '0x1A190b13C9665db98F83FA5cB6B91402878ca924', 
                underlying_address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
                base_abi: CToken,
                gtoken_abi: GCToken,
                underlying_abi: WETH,
                underlying_decimals: 1e18,
                base_decimals: 1e8,
                native: 'ETH',
                base_asset: 'cETH',
                g_asset: 'gcETH',
                img_url: 'ceth.png',
                native_img_url: 'eth.png',
                gtoken_img_url: 'gctoken_eth.png',
            },
            gWBTC: {
                type: 2,
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                base_address: '0xd3a691c852cdb01e281545a27064741f0b7f6825',
                gtoken_address: '0xE45d930b67269CeBf207aAB4dCc200463f439634', 
                underlying_address: '0xd3a691c852cdb01e281545a27064741f0b7f6825',
                base_abi: WBTC,
                gtoken_abi: GToken,
                underlying_abi: WBTC,
                underlying_decimals: 1e8,
                base_decimals: 1e8  ,
                native: 'wBTC',
                base_asset: 'wBTC',
                g_asset: 'gwBTC',
                img_url: 'wbtc.png',
                native_img_url: 'wbtc.png',
                gtoken_img_url: 'gtoken_wbtc.png',
            },
            gcWBTC: {
                type: 1,
                pair_address: "0x9896bd979f9da57857322cc15e154222c4658a5a",
                base_address: '0xa1faa15655b0e7b6b6470ed3d096390e6ad93abb',
                gtoken_address: '0x36A0fce9910362aF55b9e68A44C35EB7F14a4154', 
                underlying_address: '0xd3a691c852cdb01e281545a27064741f0b7f6825',
                base_abi: CToken,
                gtoken_abi: GCToken,
                underlying_abi: WBTC,
                underlying_decimals: 1e8,
                base_decimals: 1e8  ,
                native: 'wBTC',
                base_asset: 'cwBTC',
                g_asset: 'gcwBTC',
                img_url: 'cwbtc.png',
                native_img_url: 'wbtc.png',
                gtoken_img_url: 'gtoken_cwbtc.png',
            },

        }

    },
    rinkeby: {},
}

export default assets;