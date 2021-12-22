require('dotenv').config()
const fetch = require('node-fetch');
const Web3 = require('web3');
const web3 = new Web3();
const QRCode = require('easyqrcodejs-nodejs');

//Async function that return the query of random message in the Axie Infinity Grapql API
const getRawMessage = async () => {
  try {
      const response = await fetch('https://graphql-gateway.axieinfinity.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'operationName': "CreateRandomMessage",
          'query': "mutation CreateRandomMessage {\n  createRandomMessage\n}\n",
          'variables': {}
        }),
      });
      if(!response.ok) {
        throw Error('Axie Infinity API have a problem')
    }
      const randMessage = await response.json();
      return randMessage['data']['createRandomMessage'];
  } catch (error) {
      console.log(error);
      return true;
  };
};

// Async function with 2 parameters (accountAddress and privatekey) that sign the random message above, submit signature to the Axie Infinity GraphQL API and return an AccessToken 
const submitSignature = async (accountAddress, privateKey, randMessage) => {
    // get the random message in the getRawMessage Function
    // sign the random message using the private key of corresponding scholar discord ID
    let hexSignature = web3.eth.accounts.sign(randMessage, privateKey);
    hexSignature = hexSignature["signature"];
     
    try {
        //Call the Axie Infinity GraphQL API and provide the required parameters that we set up in this function
        const response = await fetch('https://graphql-gateway.axieinfinity.com/graphql',{
        method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            "operationName":"CreateAccessTokenWithSignature",
            "variables":{"input":{"mainnet":"ronin","owner":accountAddress,"message":randMessage,"signature":hexSignature }},
            "query":"mutation CreateAccessTokenWithSignature($input: SignatureInput!) {\n  createAccessTokenWithSignature(input: $input) {\n    newAccount\n    result\n    accessToken\n    __typename\n  }\n}\n"
            })

        });
        //Get the response in JSON format
        const accessToken = await response.json();
        //return the value of access token
        return accessToken['data']['createAccessTokenWithSignature']['accessToken'];   
    } catch (error) {
        console.log(error.name);
        
    }
};

// A Async function with 2 parameters (accessToken and filenameID) that convert the access token to qr code 
const generateQR = async (accessToken, fileNameID) => {
    //wait for the accessToken in submitSignature async function 
    const token = await accessToken;
    try {
        // assigning the object (options of qr code) into a variable 
        const qrcode = new QRCode({
        text: token, // the access Token
        width: 256, // width of the qr 
        height: 256, // height of the qr
        colorDark : "#000000", // color of the qr 
        colorLight : "#ffffff", // color of the qr 
        correctLevel : QRCode.CorrectLevel.L,
        quietZone: 15, // size of the quiet zone of qr code
        quietZoneColor: "rgba(0,0,0,0)", // color of the quite zone of qr code
        logo: './logo.png', // your brand logo path that put in the center of qr
        logoWidth: 50, // logo width size
        logoHeight: 63, // logo height size
        title: 'Your Axie Infinity Login QR',  // title of your QR code
        titleFont: "normal normal bold 18px Ubuntu", // font of the title of the QR code
        titleColor: "#004284", // color of the title of qr code
        titleBackgroundColor: "#fff", // background color of the title
        titleHeight: 20, // title height
        titleTop: 10, //draws y coordinates
        });
        //save the qr with the object of options as png file with the corrensponding scholar id
        qrcode.saveImage({
        path: './qrcode-images/qr-'+ fileNameID + '.png'
        });
    } catch (err) {
        console.log(err);
    }
};

// exports the two function as module for later use
module.exports = { generateQR, submitSignature, getRawMessage }
