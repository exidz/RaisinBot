const fetch = require('node-fetch');


const getRoninAddress = async (ethAddress) => {
    try {
        const response = await fetch(`https://migrate-axie.axieinfinity.com/${ethAddress}`);
        if(!response.ok) {
            throw Error('Axie Infinity API have a problem')
        }
        const data = await response.json();
        return data["roninAddress"]
        
    } catch (error) {
        return
        
    }
}
const getStatus = async (roninAddress) => {
    try { 
        const response = await fetch(`https://lunacia.skymavis.com/game-api/clients/${roninAddress}/items/1`);
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

module.exports = { getStatus, getRoninAddress }