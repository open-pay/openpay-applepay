const start = function (window) {
    if (window.ApplePaySession) {
        if (ApplePaySession.canMakePayments) {
            showApplePayButton();
        }
    } 
};

function showApplePayButton() {
    HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
    const buttons = document.getElementsByClassName("apple-pay-button");
    for (let button of buttons) {
        button.className += " visible";
    }
};

const click = function (request) {
    if (!ApplePaySession) {
        return;
    }

    
    // Create ApplePaySession
    const session = new ApplePaySession(3, request);
    
    session.onvalidatemerchant = async event => {
        // Call your own server to request a new merchant session.
        const merchantSession = await validateMerchant();
        session.completeMerchantValidation(merchantSession);
    };

    
    
    session.onpaymentmethodselected = event => {
        // Define ApplePayPaymentMethodUpdate based on the selected payment method.
        // No updates or errors are needed, pass an empty object.
        const update = {};
        session.completePaymentMethodSelection(update);
    };
    
    session.onshippingmethodselected = event => {
        // Define ApplePayShippingMethodUpdate based on the selected shipping method.
        // No updates or errors are needed, pass an empty object. 
        const update = {};
        session.completeShippingMethodSelection(update);
    };
    
    session.onshippingcontactselected = event => {
        // Define ApplePayShippingContactUpdate based on the selected shipping contact.
        const update = {};
        session.completeShippingContactSelection(update);
    };
    
    session.onpaymentauthorized = event => {
        // Define ApplePayPaymentAuthorizationResult
        const result = {
            "status": ApplePaySession.STATUS_SUCCESS
        };
        session.completePayment(result);
    };
    
    session.oncancel = event => {
        // Payment cancelled by WebKit
    };
    
    session.begin();
};

const buildTotal = function(label,type,amount) {
    var obj = {};
    obj.label = label;
    obj.type = type;
    obj.amount = amount;
    return obj;
}

const buildPaymentRequest = function(countryCode,currencyCode,merchantCapabilities,supportedNetworks,total) {
    var obj = {};
    obj.countryCode = countryCode;
    obj.currencyCode = currencyCode;
    obj.merchantCapabilities = merchantCapabilities;
    obj.supportedNetworks = supportedNetworks;
    obj.total = total;
    return obj;
}

const addshippingType = function(request,shippingType) {
    var obj = request;
    obj.shippingType = shippingType;
    return obj;
}
const addrequiredBillingContactFields = function(request,requiredBillingContactFields) {
    var obj = request;
    obj.requiredBillingContactFields = requiredBillingContactFields;
    return obj;
}

const addrequiredShippingContactFields = function(request,requiredShippingContactFields) {
    var obj = request;
    obj.requiredShippingContactFields = requiredShippingContactFields;
    return obj;
}

const addlineItems = function(request,lineItems) {
    var obj = request;
    obj.lineItems = lineItems;
    return obj;
}


const buildLineItem = function(label,amount) {
    var obj = {};
    obj.label = label;
    obj.amount = amount
    return obj;
}
// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const fetch = require("node-fetch");

    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  
  const  testPost= function (){
      postData('https://postman-echo.com/post', { answer: 42 })
    .then(data => {
      console.log(data); // JSON data parsed by `data.json()` call
    });}

const  testPost2= function() {
    const fs = require('fs');
    var data = {
        name: "helloworld",
        age: 123
    };
    var json = JSON.stringify(data);

    var http = require('https'); //the variable doesn't necessarily have to be named http

    var post_options = {
        hostname : 'apple-pay-gateway-cert.apple.com',
        path: '/paymentservices/registerMerchant',
        cert: fs.readFileSync(__dirname + '/dist/applemerchant.pem'),
        method: 'POST',
        rejectUnauthorized: false,
        headers: {
            'Content-Type': 'application/json'  }
    };

    let post_req = http.request(post_options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
           console.log(chunk);
        });
        res.on("error", (err) => {
            console.log('hola');
            console.log(chunk);
        });
    });
    post_req.write(json);
    post_req.end();
   }

   



module.exports = {
    start: start, 
    click:click, 
    buildTotal: buildTotal,
    buildPaymentRequest: buildPaymentRequest,
    buildLineItem: buildLineItem,
    addshippingType:addshippingType,
    addrequiredBillingContactFields: addrequiredBillingContactFields,
    addrequiredShippingContactFields: addrequiredShippingContactFields,
    addlineItems:addlineItems,
    testPost:testPost
};




