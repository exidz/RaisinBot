const fetch = require('node-fetch');

const getStatus = async (accounAddress) => {
    try { 
        const response = await fetch('https://lunacia.skymavis.com/game-api/clients/' + accounAddress + '/items/1');
        if(!response.ok) {
            throw Error('Axie Infinity API have a problem')
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = { getStatus }