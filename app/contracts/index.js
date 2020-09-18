import GrowToken from './GrowToken.json';

const assets = {
    eth: {
        growth_token: {
            ticker: 'GRO',
            abi: GrowToken,
        },
        available_assets: {
            cDAI: {
                native: 'DAI',
                base_asset: 'cDAI',
                g_asset: 'gcDAI',
                tvl: '$25.34M',
                base_total_supply: 25340000,
                total_supply: 11234110,
                apy_avg: '12.58%',
                apy_7days: '0.58%',
                img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5263.png',
                native_img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
                minting_fee: 0.01,
                burning_fee: 0.01,
            },
            cETH: {
                native: 'ETH',
                base_asset: 'cETH',
                g_asset: 'gcETH',
                tvl: '$187.45M',
                base_total_supply: 51208,
                total_supply: 78234,
                apy_avg: '13.50%',
                apy_7days: '2.90%',
                img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5636.png',
                native_img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                minting_fee: 0.01,
                burning_fee: 0.01,
            },
            cWBTC: {
                native: 'WBTC',
                base_asset: 'cWBTC',
                g_asset: 'gcWBTC',
                tvl: '$107.45M',
                base_total_supply: 51208,
                total_supply: 78234,
                apy_avg: '13.50%',
                apy_7days: '2.90%',
                img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5744.png',
                native_img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png',
                minting_fee: 0.01,
                burning_fee: 0.01,
            },
            cUSDT: {
                native: 'USDT',
                base_asset: 'cUSDT',
                g_asset: 'gcUSDT',
                tvl: '$107.45M',
                base_total_supply: 51208,
                total_supply: 78234,
                apy_avg: '13.50%',
                apy_7days: '2.90%',
                img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5745.png',
                native_img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                minting_fee: 0.01,
                burning_fee: 0.01,
            },
            cBAT: {
                native: 'BAT',
                base_asset: 'cBAT',
                g_asset: 'gcBAT',
                tvl: '$107.45M',
                base_total_supply: 51208,
                total_supply: 78234,
                apy_avg: '13.50%',
                apy_7days: '2.90%',
                img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5742.png',
                native_img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1697.png',
                minting_fee: 0.01,
                burning_fee: 0.01,
            },
            cREP: {
                native: 'REP',
                base_asset: 'cREP',
                g_asset: 'gcREP',
                tvl: '$107.45M',
                base_total_supply: 51208,
                total_supply: 78234,
                apy_avg: '13.50%',
                apy_7days: '2.90%',
                img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5746.png',
                native_img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1104.png',
                minting_fee: 0.01,
                burning_fee: 0.01,
            },
            aDAI: {
                native: 'DAI',
                base_asset: 'aDAI',
                g_asset: 'gaDAI',
                tvl: '$107.45M',
                base_total_supply: 51208,
                total_supply: 78234,
                apy_avg: '13.50%',
                apy_7days: '2.90%',
                img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5763.png',
                native_img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
                minting_fee: 0.01,
                burning_fee: 0.01,
            },
            aLINK: {
                native: 'LINK',
                base_asset: 'aLINK',
                g_asset: 'gaLINK',
                tvl: '$107.45M',
                base_total_supply: 51208,
                total_supply: 78234,
                apy_avg: '13.50%',
                apy_7days: '2.90%',
                img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5751.png',
                native_img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
                minting_fee: 0.01,
                burning_fee: 0.01,
            },
            aYFI: {
                native: 'YFI',
                base_asset: 'aYFI',
                g_asset: 'gaYFI',
                tvl: '$107.45M',
                base_total_supply: 51208,
                total_supply: 78234,
                apy_avg: '13.50%',
                apy_7days: '2.90%',
                img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7070.png',
                native_img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5864.png',
                minting_fee: 0.01,
                burning_fee: 0.01,
            },
            aWBTC: {
                native: 'WBTC',
                base_asset: 'aWBTC',
                g_asset: 'gaWBTC',
                tvl: '$107.45M',
                base_total_supply: 51208,
                total_supply: 78234,
                apy_avg: '13.50%',
                apy_7days: '2.90%',
                img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6038.png',
                native_img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png',
                minting_fee: 0.01,
                burning_fee: 0.01,
            },
            aETH: {
                native: 'ETH',
                base_asset: 'aETH',
                g_asset: 'gaETH',
                tvl: '$107.45M',
                base_total_supply: 51208,
                total_supply: 78234,
                apy_avg: '13.50%',
                apy_7days: '2.90%',
                img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5762.png',
                native_img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                minting_fee: 0.01,
                burning_fee: 0.01,
            },
            aKNC: {
                native: 'KNC',
                base_asset: 'aKNC',
                g_asset: 'gaKNC',
                tvl: '$107.45M',
                base_total_supply: 51208,
                total_supply: 78234,
                apy_avg: '13.50%',
                apy_7days: '2.90%',
                img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5750.png',
                native_img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1982.png',
                minting_fee: 0.01,
                burning_fee: 0.01,
            },
        }
    },
    ropsten: {},
    kovan: {},
    rinkeby: {},
}

export default assets;