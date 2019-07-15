// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

require('dotenv').config();

module.exports = {
	alexaSkill: {
		nlu: {
			name: 'alexa',
		},
		manifest: {
			privacyAndCompliance: {
				locales: {
				  'en-US': {
					privacyPolicyUrl: "",
					termsOfUseUrl: ""
				  }
				},
				allowsPurchases: false,
				usesPersonalInfo: false,
				isChildDirected: false,
				isExportCompliant: true,
				containsAds: false
			  },
			publishingInformation: {
			   locales: {
				  'en-US': {
					name: 'Dice Tournament',
					summary: "👉 Can throw the dice better than everyone else? 🎲 Find you just how lucky you are! 🍀",
					description: "Staging Skill for Dice Championship",
					examplePhrases: [
						"Alexa open Dice Tournament"
					],
					smallIconUri: "https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChampionship_stage_small.png",
					largeIconUri: "https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChampionship_stage_large.png",
					keywords: [
						"test"
					],
				  },
				},
				isAvailableWorldwide: true,
				testingInstructions: "Sample testing instructions",
				category: "GAMES",
				distributionCountries: []
			},
		 },
		 skillId: process.env.SKILL_ID_STAGING,
		 askProfile: process.env.ASK_PROFILE
	},
	googleAction: {
		nlu:  'dialogflow',
	},
	defaultStage: 'local',
	stages: {
		local: {
			endpoint: '${JOVO_WEBHOOK_URL}',
			deploy: {
				target: [
					'info',
					'model'
				],
			},
			alexaSkill: {
				languageModel: {
					'en-US': {
						invocation: 'dice tournament'
					}
				}
			},
		},
		staging: {
			endpoint: process.env.LAMBDA_ARN_STAGING,
			alexaSkill: {
				languageModel: {
					'en-US': {
						invocation: 'dice tournament'
					}
				}
			},
		},
		live: {
			endpoint: process.env.LAMBDA_ARN_LIVE,
			alexaSkill: {
				skillId: process.env.SKILL_ID_LIVE,
				manifest: {
					publishingInformation: {
						locales: {
							'en-US': {
								name: 'Dice Championship',
								description: "Dice Championship lets you play dice against the whole world! How high can you make it up the highscore?\n\nThe rules are simple:\n- For each throw, your score is the sum of randomly thrown 10 six-sided dice\n- Only your best score ever determines your place in the highscore\n- If you and another player have the same score, the one of you who achived it first gets the higher rank\n\n...now how high can YOU score? \n\nRight now this Skill is as simple as any Skill can be, but there are big plans for Dice Championship! Stay tuned for screen support, high-quality audio, premium content and more!\n\nHave fun, and good luck!",
								examplePhrases: [
									"Alexa open Dice Championship"
								],
								smallIconUri: "https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChallenge_small.png",
								largeIconUri: "https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChallenge_large.png",
								keywords: [
									"game",
									"fun",
									"match",
									"win",
									"epic",
									"challenge",
									"happy",
									"exciting",
									"highscore",
									"leaderboard",
									"die",
									"dice",
									"champion",
									"winner",
									"challenge",
									"challenger",
									"diversion",
									"entertaining",
									"statistics",
									"chance",
									"gambling",
									"winning",
									"perform",
									"result",
									"competition"
								],
							}
						}
					}
				},
			},
		},
	},
};