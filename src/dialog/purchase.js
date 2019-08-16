
const config = require('./../config');

module.exports = {
    initiatePurchase: async function(jovo) {
        console.log(`dialog.game.initiatePurchase()`);

        jovo.$user.$data.diceBooster.lastUpsellDate = jovo.$user.$data.currentDate;

        if (jovo.$user.$data.diceBooster.purchasable) {
            const upsellToken = jovo.$request.request.requestId;
            jovo.$alexaSkill.$inSkillPurchase.buy(
                jovo.$user.$data.diceBooster.productId,
                upsellToken
            );
        } else {
            jovo.$speech.t('diceBooster-notPurchasable');
            jovo.ask(
                jovo.$speech
            );
        }
    },

    getPurchaseStatus: async function(jovo) {
        console.log(`dialog.game.getPurchaseStatus()`);

        jovo.$user.$data.diceBooster.lastUpsellDate = jovo.$user.$data.currentDate;

        const productData = await jovo.$alexaSkill
            .$inSkillPurchase
            .getProductByReferenceName(
                config.custom.purchase.diceBooster.productName
            );
        const purchaseCount = productData.activeEntitlementCount;

        let responseKey;
        if (productData.purchasable !== 'PURCHASABLE') {
            jovo.$speech.t('diceBooster-notPurchasable');
            return jovo.ask(
                jovo.$speech
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

        const upsellPrompt = jovo.speechBuilder().t(
            responseKey,
            {
                count: purchaseCount,
            }
        ).toString();
        const upsellToken = jovo.$request.request.requestId;
        jovo.$alexaSkill.$inSkillPurchase.upsell(
            jovo.$user.$data.diceBooster.productId,
            upsellPrompt,
            upsellToken
        );
    },

    getRefund: async function(jovo) {
        console.log(`dialog.game.getRefund()`);

        jovo.$user.$data.diceBooster.lastUpsellDate = jovo.$user.$data.currentDate;

        const productData = await jovo.$alexaSkill
            .$inSkillPurchase
            .getProductByReferenceName(
                config.custom.purchase.diceBooster.productName
            );
        const purchaseCount = productData.activeEntitlementCount;

        if (!purchaseCount) {
            jovo.$speech.t('diceBooster-refund-notPurchased');
            return jovo.ask(
                jovo.$speech.t('prompt-resume'),
                jovo.$reprompt.t('prompt-full')
            );
        } else {
            const refundToken = jovo.$request.request.requestId;
            jovo.$alexaSkill.$inSkillPurchase.cancel(
                productData.productId,
                refundToken
            );
        }
    },

    parsePurchasingResult: async function(jovo) {
        console.log(`ON_PURCHASE()`);

        const transactionType = jovo.$request.name;
        const transactionResult = jovo.$alexaSkill.$inSkillPurchase.getPurchaseResult();
        if (
            (
                transactionType === 'Buy'
                || transactionType === 'Upsell'
            )
            && transactionResult === 'ACCEPTED'
        ) {
            jovo.$user.$data.diceBooster.purchaseCount += 1;
            const purchaseCount = jovo.$user.$data.diceBooster.purchaseCount;
            const dicePerPurchase = config.custom.purchase.diceBooster.extraDiceNumber;
            const numberOfDice = (
                config.custom.game.numberOfDice
                + (purchaseCount * dicePerPurchase)
            );
            jovo.$user.$data.numberOfDice = numberOfDice;

            jovo.$speech.t(
                'diceBooster-upsell-accept',
                {
                    diceCount: numberOfDice,
                }
            );
        } else if (
            transactionResult === 'ERROR'
            || transactionType === 'Cancel'
        ) {
            return jovo.ask(
                jovo.$speech.t('prompt-resume'),
                jovo.$reprompt.t('prompt-full')
            );
        } else {
            jovo.$speech.t('diceBooster-upsell-decline');
        }

        jovo.$speech.t('dice-intro');
        return jovo.toIntent('_rollDice');
    },
};
