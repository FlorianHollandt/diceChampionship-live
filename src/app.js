'use strict';

const dialog = require('./dialog');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { DynamoDb } = require('jovo-db-dynamodb');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new DynamoDb(),
    new JovoDebugger(),
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({

    async NEW_USER() {
        return dialog.generic.initiateNewUser(this);
    },

    async LAUNCH() {
        return dialog.generic.startSession(this);
    },

    async ON_PURCHASE() {
        return dialog.purchase.parsePurchasingResult(this);
    },

    async YesIntent() {
        return dialog.generic.confirmNewRound(this);
    },

    async HelpIntent() {
        return dialog.generic.help(this);
    },

    async PurchaseDiceBoosterIntent() {
        return dialog.purchase.initiatePurchase(this);
    },

    async WhatCanIBuyIntent() {
        return dialog.purchase.initiatePurchase(this);
    },

    async WhatHaveIBoughtIntent() {
        return dialog.purchase.getPurchaseStatus(this);
    },

    async GetRefundIntent() {
        return dialog.purchase.getRefund(this);
    },

    async END() {
        return dialog.generic.endSession(this);
    },
});

module.exports.app = app;
