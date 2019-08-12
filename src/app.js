'use strict';

const murmurhash = require('murmurhash');

const database = require('./database');
const display = require('./display');
const config = require('./config');

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
        console.log(`NEW_USER()`);

        const playerId = getPlayerId(this);
        this.$user.$data.playerId = playerId;

        this.$user.$data.previousHighscore = 0;
        this.$user.$data.previousRank = 999999999;
        this.$user.$data.rounds = {
            total: 0,
            session: 0,
        };
        this.$user.$data.diceBooster = {
            purchaseCount: 0,
            lastUpsellDate: null,
            unhappyStreak: 0,
            productId: null,
            purchasable: false,
        };
        this.$user.$data.numberOfDice = config.custom.game.numberOfDice;

        return;
    },

    async LAUNCH() {
        console.log(`LAUNCH()`);

        this.$user.$data.currentDate = this.getTimestamp().match(
            /\d{4}-\d{2}-\d{2}/
        )[0];

        /* Sanitize data for old users */
        if (!this.$user.$data.diceBooster) {
            this.$user.$data.diceBooster = {
                purchaseCount: 0,
                lastUpsellDate: null,
                unhappyStreak: 0,
                productId: null,
                purchasable: false,
            };
        }

        let productData;
        try {
            productData = await this.$alexaSkill
                .$inSkillPurchase
                .getProductByReferenceName(
                    config.custom.purchase.diceBooster.productName
                );
        } catch (error) {
            console.log(`Error upon retrieving product info: ${
                JSON.stringify(error, null, 4)
            }`);
        }
        if (!productData) {
            productData = {
                productId: this.$user.$data.diceBooster.productId,
                activeEntitlementCount: this.$user.$data.diceBooster.purchaseCount,
                purchasable: 'NOT_PURCHASABLE',
            };
        }
        console.log(`Product data: ${JSON.stringify(productData, null, 4)}`);
        this.$user.$data.diceBooster.productId = productData.productId;
        this.$user.$data.diceBooster.purchaseCount = productData.activeEntitlementCount;
        this.$user.$data.diceBooster.purchasable = (
            productData.purchasable === 'PURCHASABLE'
        );
        console.log(`Product data: ${JSON.stringify(productData, null, 4)}`);

        const purchaseCount = this.$user.$data.diceBooster.purchaseCount;
        const dicePerPurchase = config.custom.purchase.diceBooster.extraDiceNumber;
        const numberOfDice = (
            config.custom.game.numberOfDice
            + (purchaseCount * dicePerPurchase)
        );
        this.$user.$data.numberOfDice = numberOfDice;
        console.log(`Number of dice: ${numberOfDice}`);

        this.$user.$data.rounds.session = 0;
        this.$user.$data.diceBooster.unhappyStreak = 0;

        if (this.$user.$data.rounds.total === 0) {
            this.$speech.t('welcome-new');
        } else {
            const playerId = this.$user.$data.playerId;
            const highscore = this.$user.$data.previousHighscore;
            console.log(`Highscore: ${highscore}`);

            console.time('database.getRank() ');
            const rank = await database.getRank(playerId, highscore);
            console.timeEnd('database.getRank() ');
            this.$user.$data.previousRank = rank;
            console.log(`Rank: ${rank}`);

            const responseKey = `welcome-returning${
                purchaseCount > 0 ? '-diceBooster' : ''
            }`;

            this.$speech.t(
                responseKey,
                {
                    score: highscore,
                    rank: rank,
                    diceCount: numberOfDice,
                }
            );
        }

        return this.toIntent('_rollDice');
    },

    ON_PURCHASE() {
        console.log(`ON_PURCHASE()`);

        const transactionType = this.$request.name;
        const transactionResult = this.$alexaSkill.$inSkillPurchase.getPurchaseResult();
        if (
            (
                transactionType === 'Buy'
                || transactionType === 'Upsell'
            )
            && transactionResult === 'ACCEPTED'
        ) {
            this.$user.$data.diceBooster.purchaseCount += 1;
            const purchaseCount = this.$user.$data.diceBooster.purchaseCount;
            const dicePerPurchase = config.custom.purchase.diceBooster.extraDiceNumber;
            const numberOfDice = (
                config.custom.game.numberOfDice
                + (purchaseCount * dicePerPurchase)
            );
            this.$user.$data.numberOfDice = numberOfDice;

            this.$speech.t(
                'diceBooster-upsell-accept',
                {
                    diceCount: numberOfDice,
                }
            );
        } else if (
            transactionResult === 'ERROR'
            || transactionType === 'Cancel'
        ) {
            return this.ask(
                this.$speech.t('prompt-resume'),
                this.$reprompt.t('prompt-full')
            );
        } else {
            this.$speech.t('diceBooster-upsell-decline');
        }

        this.$speech.t('dice-intro');
        return this.toIntent('_rollDice');
    },

    async YesIntent() {
        console.log(`YesIntent()`);

        if (
            this.$user.$data.rounds.session <= config.custom.briefModeLimit
        ) {
            this.$speech.t('confirm');
        }

        return this.toIntent('_rollDice');
    },

    async _rollDice() {
        console.log(`_rollDice()`);

        this.$user.$data.rounds.total++;
        this.$user.$data.rounds.session++;

        if (
            this.$user.$data.rounds.session <= config.custom.briefModeLimit
        ) {
            this.$speech.t('dice-intro');
        }
        this.$speech.t('dice-sound');

        delete this.aplTemplate;
        let aplTemplate = null;
        aplTemplate = display.initiateTemplate();
        console.log(`APL dice data sources initated: ${
            JSON.stringify(aplTemplate.datasources.payload.dice, null, 4)
        }`);

        const numberOfDice = this.$user.$data.numberOfDice;
        const allDice = rollAllDice(numberOfDice);
        const coordinates = display.getDiceCoordinates(allDice);
        aplTemplate = display.placeDice(aplTemplate, allDice, coordinates);

        console.log(`APL dice data sources with coordinates: ${
            JSON.stringify(aplTemplate.datasources.payload.dice, null, 4)
        }`);

        const sumOfDice = getSumOfBestDice(allDice);
        aplTemplate = display.addSumOfDice(aplTemplate, sumOfDice);

        aplTemplate.token = this.$request.request.requestId;

        this.$data.sumOfDice = sumOfDice;
        this.$data.aplTemplate = aplTemplate;

        return this.toIntent('_compareResult');
    },

    async _compareResult() {
        console.log(`_compareResult()`);

        const playerId = this.$user.$data.playerId;
        const totalRounds = this.$user.$data.rounds.total;

        let unhappyStreak = this.$user.$data.diceBooster.unhappyStreak;
        const purchaseCount = this.$user.$data.diceBooster.purchaseCount;

        let aplTemplate = this.$data.aplTemplate;

        const sumOfDice = this.$data.sumOfDice;
        console.log(`Sum of dice: ${sumOfDice}`);

        const previousHighscore = this.$user.$data.previousHighscore;
        console.log(`Previous highscore: ${previousHighscore}`);
        const previousRank = this.$user.$data.previousRank;
        console.log(`Previous rank: ${previousRank}`);

        let soundKey = 'result-sound-negative';
        let speechKey = 'result-lowerScore';

        const currentHighscore = Math.max(sumOfDice, previousHighscore);
        console.time('database.getRank() ');
        const rank = await database.getRank(playerId, currentHighscore);
        console.timeEnd('database.getRank() ');
        console.log(`Rank: ${rank}`);

        aplTemplate = display.addRank(aplTemplate, rank);
        this.$data.aplTemplate = aplTemplate;

        let userStatus = 'default';
        if (purchaseCount) {
            userStatus = `diceBooster-${purchaseCount}`;
        }

        if (sumOfDice > previousHighscore) {
            console.time('database.submitScore() ');
            await database.submitScore(
                playerId,
                sumOfDice,
                totalRounds,
                this.getPlatformType(),
                this.getLocale(),
                this.$user.$data.currentDate,
                userStatus
            );
            console.timeEnd('database.submitScore() ');

            this.$user.$data.previousHighscore = sumOfDice;
            soundKey = 'result-sound-positive';
            speechKey = 'result-newPersonalHighscore';
            unhappyStreak = 0;
        } else {
            unhappyStreak += 1;

            if (
                this.$user.$data.rounds.session > config.custom.briefModeLimit
            ) {
                speechKey = '';
            }
        }
        if (rank < previousRank) {
            this.$user.$data.previousRank = rank;
            soundKey = 'result-sound-positive';
            speechKey = 'result-higherRank';
        }
        if (
            rank === 1
            && previousRank !== 1
        ) {
            speechKey = 'result-numberOneRank';
        }

        this.$speech
            .t(
                'result-score',
                {
                    sound: this.speechBuilder().t(soundKey).toString(),
                    score: sumOfDice,
                }
            )
            .t(
                speechKey,
                {
                    rank: rank,
                }
            );

        console.log(`Unhappy streak: ${unhappyStreak}`);
        if (
            unhappyStreak >= config.custom.purchase.diceBooster.unhappyStreakLimit
            && rank > 1
            && this.$user.$data.diceBooster.purchasable
            && this.$user.$data.diceBooster.lastUpsellDate !== this.$user.$data.currentDate
        ) {
            this.$user.$data.diceBooster.unhappyStreak = 0;
            this.$user.$data.diceBooster.lastUpsellDate = this.$user.$data.currentDate;

            /*
            The upsellMessage propoerty of the Upsell directive doesn't allow SSML,
            which we require for the dice sounds etc. The workaround is to send the
            response text without the prompt via progressive response, which allows SSML. :)
            */
            let responseText = this.$speech.toString();
            console.log(`Response text (for progressive response): ${responseText}`);
            this.$alexaSkill.progressiveResponse(responseText);
            await sleep(1500);

            const orderFlag = this.$user.$data.diceBooster.purchaseCount ? 'next' : 'first';
            const upsellPrompt = this.speechBuilder().t(
                `diceBooster-upsell-${orderFlag}-prompt`
            ).toString();
            const upsellToken = this.$request.request.requestId;
            this.$alexaSkill.$inSkillPurchase.upsell(
                this.$user.$data.diceBooster.productId,
                upsellPrompt,
                upsellToken
            );
        } else {
            this.$user.$data.diceBooster.unhappyStreak = unhappyStreak;
            return this.toIntent('_prompt');
        }
    },

    async _prompt() {
        console.log(`_prompt()`);

        if (
            this.getLocale.match('en-')
        ) {
            this.addAplDirective(
                this.$data.aplTemplate
            );
        }

        return this.ask(
            this.$speech.t('prompt-short'),
            this.$reprompt.t('prompt-full')
        );
    },

    async HelpIntent() {
        console.log(`HelpIntent()`);

        if (this.isNewSession()) {
            this.$speech.t('help-launch');
        } else {
            const previousRank = this.$user.$data.previousRank;
            const highscore = this.$user.$data.previousHighscore;

            this.$speech.t(
                'help-rank',
                {
                    rank: previousRank,
                    score: highscore,
                }
            );
        }

        this.$speech.t('prompt-full');
        this.$reprompt.t('prompt-full');

        return this.ask(
            this.$speech,
            this.$reprompt
        );
    },

    async PurchaseDiceBoosterIntent() {
        console.log(`PurchaseDiceBoosterIntent()`);

        this.$user.$data.diceBooster.lastUpsellDate = this.$user.$data.currentDate;

        if (this.$user.$data.diceBooster.purchasable) {
            const upsellToken = this.$request.request.requestId;
            this.$alexaSkill.$inSkillPurchase.buy(
                this.$user.$data.diceBooster.productId,
                upsellToken
            );
        } else {
            this.$speech.t('diceBooster-notPurchasable');
            this.ask(
                this.$speech
            );
        }
    },

    async WhatCanIBuyIntent() {
        console.log(`WhatCanIBuyIntent()`);

        this.toStatelessIntent('PurchaseDiceBoosterIntent');
    },

    async WhatHaveIBoughtIntent() {
        console.log(`WhatHaveIBoughtIntent()`);

        this.$user.$data.diceBooster.lastUpsellDate = this.$user.$data.currentDate;

        const productData = await this.$alexaSkill
            .$inSkillPurchase
            .getProductByReferenceName(
                config.custom.purchase.diceBooster.productName
            );
        const purchaseCount = productData.activeEntitlementCount;

        let responseKey;
        if (productData.purchasable !== 'PURCHASABLE') {
            this.$speech.t('diceBooster-notPurchasable');
            return this.ask(
                this.$speech
            );
        } else if (
            !purchaseCount
        ) {
            responseKey = 'diceBooster-whatHaveIBought-none';
        } else if (
            purchaseCount === 1
        ) {
            responseKey = 'diceBooster-whatHaveIBought-single';
        } else {
            responseKey = 'diceBooster-whatHaveIBought-multiple';
        }

        const upsellPrompt = this.speechBuilder().t(
            responseKey,
            {
                count: purchaseCount,
            }
        ).toString();
        const upsellToken = this.$request.request.requestId;
        this.$alexaSkill.$inSkillPurchase.upsell(
            this.$user.$data.diceBooster.productId,
            upsellPrompt,
            upsellToken
        );
    },

    async GetRefundIntent() {
        console.log(`GetRefundIntent()`);

        this.$user.$data.diceBooster.lastUpsellDate = this.$user.$data.currentDate;

        const productData = await this.$alexaSkill
            .$inSkillPurchase
            .getProductByReferenceName(
                config.custom.purchase.diceBooster.productName
            );
        const purchaseCount = productData.activeEntitlementCount;

        if (!purchaseCount) {
            this.$speech.t('diceBooster-refund-notPurchased');
            return this.ask(
                this.$speech.t('prompt-resume'),
                this.$reprompt.t('prompt-full')
            );
        } else {
            const refundToken = this.$request.request.requestId;
            this.$alexaSkill.$inSkillPurchase.cancel(
                productData.productId,
                refundToken
            );
        }
    },

    async END() {
        console.log(`END()`);
        this.$speech.t('goodbye');

        return this.tell(
            this.$speech
        );
    },
});

module.exports.app = app;

function rollSingleDice() {
    return Math.ceil(
        Math.random() * config.custom.game.sidesPerDice
    );
}

function rollAllDice(numberOfDice) {
    let allDice = [];
    for (let i = 0; i < numberOfDice; i++) {
        allDice.push(
            rollSingleDice()
        );
    }
    return allDice;
}

function getSumOfBestDice(allDice) {
    allDice.sort(
        (a, b) => {
            return b-a;
        }
    );
    let bestDice = allDice.splice(
        0,
        config.custom.game.numberOfDice
    );
    const sumOfDice = bestDice.reduce(
        (a, b) => {
            return a + b;
        },
        0
    );
    return sumOfDice;
}

function getPlayerId(jovo) {
    const sessionId = jovo.$request.session.sessionId;
    return murmurhash.v2(sessionId).toString();
}

function sleep(ms) {
    return new Promise(
        (resolve) => {
            setTimeout(resolve, ms);
        }
    );
}
