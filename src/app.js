'use strict';

const murmurhash = require('murmurhash');

const database = require('./database');
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

        return;
    },

    async LAUNCH() {
        console.log(`LAUNCH()`);

        this.$user.$data.rounds.session = 0;

        if (this.$user.$data.rounds.total === 0) {
            this.$speech.t('welcome-new');
        } else {
            this.$speech.t('welcome-returning');
        }

        return this.toIntent('_rollDice');
    },

    async YesIntent() {
        console.log(`YesIntent()`);

        this.$speech.t('confirm');

        return this.toIntent('_rollDice');
    },

    async _rollDice() {
        console.log(`_rollDice()`);

        this.$user.$data.rounds.total++;
        this.$user.$data.rounds.session++;


        this.$speech
            .t('dice-intro')
            .t('dice-sound');
        
        let sumOfDice = 0;
        for (let i = 0; i <  config.custom.game.numberOfDice; i++ ){
            sumOfDice += getDiceRollResult();
        }
        this.$data.sumOfDice = sumOfDice;

        return this.toIntent('_compareResult');
    },

    async _compareResult() {
        console.log(`_compareResult()`);

        const playerId = this.$user.$data.playerId;
        const totalRounds = this.$user.$data.rounds.total;

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
        
        if (sumOfDice > previousHighscore) {
            console.time('database.submitScore() ');
            await database.submitScore(
                playerId,
                sumOfDice,
                totalRounds,
                this.getPlatformType(),
                this.getLocale()
            );
            console.timeEnd('database.submitScore() ');

            this.$user.$data.previousHighscore = sumOfDice;
            soundKey = 'result-sound-positive';
            speechKey = 'result-newPersonalHighscore';
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

        return this.toIntent('_prompt');
    },

    async _prompt() {
        console.log(`_prompt()`);

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
            this.$speech.t('help-rank');
        }
        
        this.$speech.t('prompt-full');
        this.$reprompt.t('prompt-full');

        return this.ask(
            this.$speech,
            this.$reprompt
        );
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

function getDiceRollResult() {
    return Math.ceil(
        Math.random() *  config.custom.game.sidesPerDice
    )
}

function getPlayerId(jovo) {
    const sessionId = jovo.$request.session.sessionId;
    return murmurhash.v2(sessionId).toString();
}