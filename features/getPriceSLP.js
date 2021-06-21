const fetch = require('node-fetch');

const slpPrice = async () => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/smooth-love-potion?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false');
        if(!response.ok) {
            throw Error('Axie Infinity API have a problem')
        }
        const price = await response.json();
        return price["market_data"]["current_price"]["usd"];
    } catch (error) {
        console.log(error);
        return false;       
    }
};

module.exports = { slpPrice }