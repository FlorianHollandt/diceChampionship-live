
const murmurhash = require('murmurhash');

const config = require('./../config');
const database = require('./../database');
const game = require('./game');

module.exports = {
    initiateNewUser: async function(jovo) {
        console.log('dialog.generic.initiateNewUser()');

        const playerId = getPlayerId(jovo);
        jovo.$user.$data.playerId = playerId;

        jovo.$user.$data.previousHighscore = 0;
        jovo.$user.$data.previousRank = 999999999;
        jovo.$user.$data.rounds = {
            total: 0,
            session: 0,
        };
        jovo.$user.$data.diceBooster = {
            purchaseCount: 0,
            lastUpsellDate: null,
            unhappyStreak: 0,
            productId: null,
            purchasable: false,
        };
        jovo.$user.$data.numberOfDice = config.custom.game.numberOfDice;

        return;
    },

    startSession: async function(jovo) {
        console.log('dialog.generic.startSession()');

        jovo.$user.$data.currentDate = jovo.getTimestamp().match(
            /\d{4}-\d{2}-\d{2}/
        )[0];

        /* Sanitize data for old users */
        if (!jovo.$user.$data.diceBooster) {
            jovo.$user.$data.diceBooster = {
                purchaseCount: 0,
                lastUpsellDate: null,
                unhappyStreak: 0,
                productId: null,
                purchasable: false,
            };
        }

        let productData;
        try {
            productData = await jovo.$alexaSkill
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
                productId: jovo.$user.$data.diceBooster.productId,
                activeEntitlementCount: jovo.$user.$data.diceBooster.purchaseCount,
                purchasable: 'NOT_PURCHASABLE',
            };
        }
        console.log(`Product data: ${JSON.stringify(productData, null, 4)}`);
        jovo.$user.$data.diceBooster.productId = productData.productId;
        jovo.$user.$data.diceBooster.purchaseCount = productData.activeEntitlementCount;
        jovo.$user.$data.diceBooster.purchasable = (
            productData.purchasable === 'PURCHASABLE'
        );
        console.log(`Product data: ${JSON.stringify(productData, null, 4)}`);

        const purchaseCount = jovo.$user.$data.diceBooster.purchaseCount;
        const dicePerPurchase = config.custom.purchase.diceBooster.extraDiceNumber;
        const numberOfDice = (
            config.custom.game.numberOfDice
            + (purchaseCount * dicePerPurchase)
        );
        jovo.$user.$data.numberOfDice = numberOfDice;
        console.log(`Number of dice: ${numberOfDice}`);

        jovo.$user.$data.rounds.session = 0;
        jovo.$user.$data.diceBooster.unhappyStreak = 0;

        if (jovo.$user.$data.rounds.total === 0) {
            jovo.$speech.t('welcome-new');
        } else {
            const playerId = jovo.$user.$data.playerId;
            const highscore = jovo.$user.$data.previousHighscore;
            console.log(`Highscore: ${highscore}`);

            console.time('database.getRank() ');
            const rank = await database.getRank(playerId, highscore);
            console.timeEnd('database.getRank() ');
            jovo.$user.$data.previousRank = rank;
            console.log(`Rank: ${rank}`);

            const responseKey = `welcome-returning${
                purchaseCount > 0 ? '-diceBooster' : ''
            }`;

            jovo.$speech.t(
                responseKey,
                {
                    score: highscore,
                    rank: rank,
                    diceCount: numberOfDice,
                }
            );
        }

        return game.rollDice(jovo);
    },

    confirmNewRound: async function(jovo) {
        console.log('dialog.generic.confirmNewRound()');

        if (
            jovo.$user.$data.rounds.session <= config.custom.modeLimit.brief
        ) {
            jovo.$speech.t('confirm');
        }

        return game.rollDice(jovo);
    },

    help: async function(jovo) {
        console.log('dialog.generic.help()');

        if (jovo.isNewSession()) {
            jovo.$speech.t('help-launch');
        } else {
            const previousRank = jovo.$user.$data.previousRank;
            const highscore = jovo.$user.$data.previousHighscore;

            jovo.$speech.t(
                'help-rank',
                {
                    rank: previousRank,
                    score: highscore,
                }
            );
        }

        jovo.$speech.t('prompt-full');
        jovo.$reprompt.t('prompt-full');

        return jovo.ask(
            jovo.$speech,
            jovo.$reprompt
        );
    },

    endSession: async function(jovo) {
        console.log('dialog.generic.endSession()');
        jovo.$speech.t('goodbye');

        return jovo.tell(
            jovo.$speech
        );
    },
};

function getPlayerId(jovo) {
    const sessionId = jovo.$request.session.sessionId;
    return murmurhash.v2(sessionId).toString();
}
