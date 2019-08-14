
const config = require('./../config');
const database = require('./../database');
const display = require('./../display');

module.exports = {
    rollDice: async function(jovo) {
        console.log(`dialog.game.rollDice()`);

        jovo.$user.$data.rounds.total++;
        jovo.$user.$data.rounds.session++;

        if (
            jovo.$user.$data.rounds.session <= config.custom.modeLimit.brief
        ) {
            jovo.$speech.t('dice-intro');
        }
        jovo.$speech.t('dice-sound');

        delete jovo.aplTemplate;
        let aplTemplate = null;
        aplTemplate = display.initiateTemplate();

        const numberOfDice = jovo.$user.$data.numberOfDice;
        const allDice = rollAllDice(numberOfDice);
        const coordinates = display.getDiceCoordinates(allDice);
        aplTemplate = display.placeDice(aplTemplate, allDice, coordinates);

        const sumOfDice = getSumOfBestDice(allDice);
        aplTemplate = display.addSumOfDice(aplTemplate, sumOfDice);

        aplTemplate = display.addLanguage(
            aplTemplate,
            jovo.getLocale()
        );
        aplTemplate.token = jovo.$request.request.requestId;

        jovo.$data.sumOfDice = sumOfDice;
        jovo.$data.aplTemplate = aplTemplate;

        return module.exports.compareResult(jovo);
    },

    compareResult: async function(jovo) {
        console.log(`dialog.game.compareResult()`);

        const playerId = jovo.$user.$data.playerId;
        const totalRounds = jovo.$user.$data.rounds.total;

        let unhappyStreak = jovo.$user.$data.diceBooster.unhappyStreak;
        const purchaseCount = jovo.$user.$data.diceBooster.purchaseCount;

        let aplTemplate = jovo.$data.aplTemplate;

        const sumOfDice = jovo.$data.sumOfDice;
        console.log(`Sum of dice: ${sumOfDice}`);

        const previousHighscore = jovo.$user.$data.previousHighscore;
        console.log(`Previous highscore: ${previousHighscore}`);
        const previousRank = jovo.$user.$data.previousRank;
        console.log(`Previous rank: ${previousRank}`);

        let soundKey = 'result-sound-negative';
        let scoreKey = 'result-score';
        let resultKey = 'result-lowerScore';
        if (
            jovo.$user.$data.rounds.session > config.custom.modeLimit.binge
        ) {
            soundKey = 'result-sound-negative-short';
            scoreKey = 'result-score-short';
            resultKey = '';
        } else if (
            jovo.$user.$data.rounds.session > config.custom.modeLimit.brief
        ) {
            resultKey = '';
        }

        const currentHighscore = Math.max(sumOfDice, previousHighscore);
        console.time('database.getRank() ');
        const rank = await database.getRank(playerId, currentHighscore);
        console.timeEnd('database.getRank() ');
        console.log(`Rank: ${rank}`);

        aplTemplate = display.addRank(aplTemplate, rank);
        jovo.$data.aplTemplate = aplTemplate;

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
                jovo.getPlatformType(),
                jovo.getLocale(),
                jovo.$user.$data.currentDate,
                userStatus
            );
            console.timeEnd('database.submitScore() ');

            jovo.$user.$data.previousHighscore = sumOfDice;
            soundKey = 'result-sound-positive';
            resultKey = 'result-newPersonalHighscore';
            unhappyStreak = 0;
        } else {
            unhappyStreak += 1;
        }
        if (rank < previousRank) {
            jovo.$user.$data.previousRank = rank;
            soundKey = 'result-sound-positive';
            resultKey = 'result-higherRank';
        }
        if (
            rank === 1
            && previousRank !== 1
        ) {
            resultKey = 'result-numberOneRank';
        }

        jovo.$speech
            .t(
                scoreKey,
                {
                    sound: jovo.speechBuilder().t(soundKey).toString(),
                    score: sumOfDice,
                }
            )
            .t(
                resultKey,
                {
                    rank: rank,
                }
            );

        console.log(`Unhappy streak: ${unhappyStreak}`);
        if (
            unhappyStreak >= config.custom.purchase.diceBooster.unhappyStreakLimit
            && rank > 1
            && jovo.$user.$data.diceBooster.purchasable
            && jovo.$user.$data.diceBooster.lastUpsellDate !== jovo.$user.$data.currentDate
        ) {
            jovo.$user.$data.diceBooster.unhappyStreak = 0;
            jovo.$user.$data.diceBooster.lastUpsellDate = jovo.$user.$data.currentDate;

            /*
            The upsellMessage propoerty of the Upsell directive doesn't allow SSML,
            which we require for the dice sounds etc. The workaround is to send the
            response text without the prompt via progressive response, which allows SSML. :)
            */
            let responseText = jovo.$speech.toString();
            console.log(`Response text (for progressive response): ${responseText}`);
            jovo.$alexaSkill.progressiveResponse(responseText);
            await sleep(1500);

            const orderFlag = jovo.$user.$data.diceBooster.purchaseCount ? 'next' : 'first';
            const upsellPrompt = jovo.speechBuilder().t(
                `diceBooster-upsell-${orderFlag}-prompt`
            ).toString();
            const upsellToken = jovo.$request.request.requestId;
            jovo.$alexaSkill.$inSkillPurchase.upsell(
                jovo.$user.$data.diceBooster.productId,
                upsellPrompt,
                upsellToken
            );
        } else {
            jovo.$user.$data.diceBooster.unhappyStreak = unhappyStreak;
            return module.exports.prompt(jovo);
        }
    },

    prompt: async function(jovo) {
        console.log(`dialog.game.prompt()`);

        jovo.addAplDirective(
            jovo.$data.aplTemplate
        );

        if (
            jovo.$user.$data.rounds.session <= config.custom.modeLimit.binge
        ) {
            jovo.$speech.t('prompt-default');
        } else {
            jovo.$speech.t('prompt-short');
        }
        jovo.$reprompt.t('prompt-full');

        return jovo.ask(
            jovo.$speech,
            jovo.$reprompt
        );
    },
};

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

function sleep(ms) {
    return new Promise(
        (resolve) => {
            setTimeout(resolve, ms);
        }
    );
}
