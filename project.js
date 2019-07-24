// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

require('dotenv').config();

const manifest = {
	privacyAndCompliance: {
		privacyPolicyUrl: "",
		termsOfUseUrl: ""
	},
	publishingInformation: {
		locales: {
			'en': {
				stage: {
					staging: {
						name: 'Dice Tournament',
						summary: "👉 Can throw the dice better than everyone else? 🎲 Find you just how lucky you are! 🍀",
						description: "Staging Skill for Dice Championship (EN)",
						examplePhrases: [
							"Alexa open Dice Tournament"
						],
						smallIconUri: "https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChampionship_stage_small.png",
						largeIconUri: "https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChampionship_stage_large.png",
						keywords: [
							"test"
						],
					},
					live: {
						name: 'Dice Championship',
						summary: "👉 Can throw the dice better than everyone else? 🎲 Find you just how lucky you are! 🍀",
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
					},
				},
			},
			'de': {
				stage: {
					staging: {
						name: 'Würfel-Turnier',
						summary: "👉 Würfelst Du besser als alle anderen? 🎲 Spiel mit und teste Dein Würfelglück! 🍀",
						description: "Staging Skill for Dice Championship (DE)",
						examplePhrases: [
							"Alexa, starte Würfel-Turnier"
						],
						smallIconUri: "https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChampionship_stage_small.png",
						largeIconUri: "https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChampionship_stage_large.png",
						keywords: [
							"test"
						],
					},
					live: {
						name: 'Würfel Meisterschaft',
						summary: "👉 Würfelst Du besser als alle anderen? 🎲 Spiel mit und teste Dein Würfelglück! 🍀",
						description: "Du gegen den Rest der Welt - Mit nicht als zehn Würfel! Wie weit nach oben schaffst Du es in der Bestenliste?\n\nDie Regeln sind einfach:\n- Pro Runde ergibt sich Deine Punktzahl aus der Summe des Würfelergebnisses mit 10 sechsseitigen Würfeln\n- Nur Dein Würfelrekord bestimmt, welche Position in der Bestenliste Du einnimmst\n- Falls zwei Spieler Gleichstand haben, erhält der erste von beiden den höheren Rang\n\nDann mal los: Zeig der Welt Dein goldenes Würfelhändchen! \n\nAktuell ist dieser Skill noch recht schlicht gehalten, aber es gibt große Pläne für die Würfelmeisterschaft! Auf der Wunschliste stehen Bildschirmunterstützung, bessere Soundeffekte, Premiuminhalte und mehr!\n\nViel Spaß, und viel Glück beim Würfeln!",
						examplePhrases: [
							"Alexa, starte Würfel-Meisterschaft"
						],
						smallIconUri: "https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChallenge_small.png",
						largeIconUri: "https://exampleresources.s3-eu-west-1.amazonaws.com/skillIcon_diceChallenge_large.png",
						keywords: [
							"spiel",
							"spaß",
							"turnier",
							"gewinnen",
							"meister",
							"herausforderung",
							"action",
							"aufregend",
							"highscore",
							"bestenliste",
							"würfel",
							"glücksspiel",
							"gewinner",
							"sieger",
							"meisterschaft",
							"würfeln",
							"ablenkung",
							"unterhaltung",
							"statistik",
							"glück",
							"kasino",
							"jackpot",
							"punktzahl",
							"ergebnis",
							"wettbewerb"
						],
					},
				},
			},
		}
	}
};

const invocationName = {
	locales: {
		'en': {
			invocation: 'dice championship',
		},
		'de': {
			invocation: 'würfel meisterschaft',
		},
	},
};

module.exports = {
	alexaSkill: {
		nlu: {
			name: 'alexa',
			lang: {
				en: [
					'en-US',
					'en-CA',
				],
				de: [
					'de-DE',
				]
			  }
		},
		manifest: {
			privacyAndCompliance: {
				locales: {
					'en-US': manifest.privacyAndCompliance,
					'en-CA': manifest.privacyAndCompliance,
					'de-DE': manifest.privacyAndCompliance,
				},
				allowsPurchases: false,
				usesPersonalInfo: false,
				isChildDirected: false,
				isExportCompliant: true,
				containsAds: false
			},
			publishingInformation: {
			   locales: {
				  'en-US': manifest.publishingInformation.locales.en.stage.staging,
				  'en-CA': manifest.publishingInformation.locales.en.stage.staging,
				  'de-DE': manifest.publishingInformation.locales.de.stage.staging,
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
		},
		staging: {
			endpoint: process.env.LAMBDA_ARN_STAGING,
		},
		live: {
			endpoint: process.env.LAMBDA_ARN_LIVE,
			alexaSkill: {
				skillId: process.env.SKILL_ID_LIVE,
				languageModel: {
					'en': invocationName.locales.en,
					'de': invocationName.locales.de,
				},
				manifest: {
					publishingInformation: {
						locales: {
							'en-US': manifest.publishingInformation.locales.en.stage.live,
							'en-CA': manifest.publishingInformation.locales.en.stage.live,
							'de-DE': manifest.publishingInformation.locales.de.stage.live,
						}
					}
				},
			},
		},
	},
};