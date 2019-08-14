
module.exports = {
    type: 'Alexa.Presentation.APL.RenderDocument',
    version: '1.0',
    document: {
        type: 'APL',
        version: '1.0',
        import: [
            {
                name: 'alexa-viewport-profiles',
                version: '1.0.0',
            },
        ],
        resources: [],
        styles: {
            baseText: {
                values: [
                    {
                        fontFamily: 'Amazon Ember',
                        color: '#b3083b',
                        fontWeight: 900,
                    },
                ],
            },
        },
        layouts: {
            BackgroundImage: {
                parameters: [],
                item: [
                    {
                        when: '${@viewportProfile == @hubRoundSmall}',
                        type: 'BackgroundImageTemplate',
                        source: 'https://dicechampionship.s3-eu-west-1.amazonaws.com/visuals/background_roundSmall_${datasource.payload.language}.png',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeSmall}',
                        type: 'BackgroundImageTemplate',
                        source: 'https://dicechampionship.s3-eu-west-1.amazonaws.com/visuals/background_landscapeSmall_${datasource.payload.language}.png',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeMedium}',
                        type: 'BackgroundImageTemplate',
                        source: 'https://dicechampionship.s3-eu-west-1.amazonaws.com/visuals/background_landscapeMedium_${datasource.payload.language}.png',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeLarge}',
                        type: 'BackgroundImageTemplate',
                        source: 'https://dicechampionship.s3-eu-west-1.amazonaws.com/visuals/background_landscapeLarge_${datasource.payload.language}.png',
                    },
                    {
                        when: '${@viewportProfile == @tvLandscapeXLarge}',
                        type: 'BackgroundImageTemplate',
                        source: 'https://dicechampionship.s3-eu-west-1.amazonaws.com/visuals/background_landscapeXLarge_${datasource.payload.language}.png',
                    },
                ],
            },
            BackgroundImageTemplate: {
                parameters: [
                    'source',
                ],
                item: [
                    {
                        type: 'Image',
                        width: '100vw',
                        height: '100vh',
                        source: '${source}',
                        position: 'absolute',
                    },
                ],
            },
            PlayingField: {
                parameters: [
                    'items',
                ],
                item: [
                    {
                        when: '${@viewportProfile == @hubRoundSmall}',
                        type: 'PlayingFieldTemplate',
                        width: '${datasource.payload.playingField.roundSmall.width}',
                        height: '${datasource.payload.playingField.roundSmall.height}',
                        yOffset: '${datasource.payload.playingField.roundSmall.yOffset}',
                        xOffset: '${datasource.payload.playingField.roundSmall.xOffset}',
                        items: '${items}',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeSmall}',
                        type: 'PlayingFieldTemplate',
                        width: '${datasource.payload.playingField.landscapeSmall.width}',
                        height: '${datasource.payload.playingField.landscapeSmall.height}',
                        yOffset: '${datasource.payload.playingField.landscapeSmall.yOffset}',
                        xOffset: '${datasource.payload.playingField.landscapeSmall.xOffset}',
                        items: '${items}',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeMedium}',
                        type: 'PlayingFieldTemplate',
                        width: '${datasource.payload.playingField.landscapeMedium.width}',
                        height: '${datasource.payload.playingField.landscapeMedium.height}',
                        yOffset: '${datasource.payload.playingField.landscapeMedium.yOffset}',
                        xOffset: '${datasource.payload.playingField.landscapeMedium.xOffset}',
                        items: '${items}',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeLarge}',
                        type: 'PlayingFieldTemplate',
                        width: '${datasource.payload.playingField.landscapeLarge.width}',
                        height: '${datasource.payload.playingField.landscapeLarge.height}',
                        yOffset: '${datasource.payload.playingField.landscapeLarge.yOffset}',
                        xOffset: '${datasource.payload.playingField.landscapeLarge.xOffset}',
                        items: '${items}',
                    },
                    {
                        when: '${@viewportProfile == @tvLandscapeXLarge}',
                        type: 'PlayingFieldTemplate',
                        width: '${datasource.payload.playingField.landscapeXLarge.width}',
                        height: '${datasource.payload.playingField.landscapeXLarge.height}',
                        yOffset: '${datasource.payload.playingField.landscapeXLarge.yOffset}',
                        xOffset: '${datasource.payload.playingField.landscapeXLarge.xOffset}',
                        items: '${items}',
                    },
                ],
            },
            PlayingFieldTemplate: {
                parameters: [
                    'items',
                    'yOffset',
                    'xOffset',
                    'width',
                    'height',
                ],
                item: [
                    {
                        type: 'Frame',
                        borderRadius: 5,
                        borderColor: 'grey',
                        borderWidth: '${datasource.payload.borderWidth}',
                        width: '${width}',
                        height: '${height}',
                        top: '${yOffset}',
                        left: '${xOffset}',
                        position: 'absolute',
                        items: [
                            {
                                type: 'Container',
                                width: '100%',
                                height: '100%',
                                items: '${items}',
                            },
                        ],
                    },
                ],
            },
            Dice: {
                parameters: [
                    'faceValue',
                    'diceType',
                    'xCoordinate',
                    'yCoordinate',
                    'rotation',
                ],
                item: [
                    {
                        when: '${@viewportProfile == @hubRoundSmall}',
                        type: 'DiceTemplate',
                        faceValue: '${faceValue}',
                        diceType: '${diceType}',
                        xCoordinate: '${xCoordinate}',
                        yCoordinate: '${yCoordinate}',
                        rotation: '${rotation}',
                        size: '${datasource.payload.dice.size.roundSmall}',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeSmall}',
                        type: 'DiceTemplate',
                        faceValue: '${faceValue}',
                        diceType: '${diceType}',
                        xCoordinate: '${xCoordinate}',
                        yCoordinate: '${yCoordinate}',
                        rotation: '${rotation}',
                        size: '${datasource.payload.dice.size.landscapeSmall}',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeMedium}',
                        type: 'DiceTemplate',
                        faceValue: '${faceValue}',
                        diceType: '${diceType}',
                        xCoordinate: '${xCoordinate}',
                        yCoordinate: '${yCoordinate}',
                        rotation: '${rotation}',
                        size: '${datasource.payload.dice.size.landscapeMedium}',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeLarge}',
                        type: 'DiceTemplate',
                        faceValue: '${faceValue}',
                        diceType: '${diceType}',
                        xCoordinate: '${xCoordinate}',
                        yCoordinate: '${yCoordinate}',
                        rotation: '${rotation}',
                        size: '${datasource.payload.dice.size.landscapeLarge}',
                    },
                    {
                        when: '${@viewportProfile == @tvLandscapeXLarge}',
                        type: 'DiceTemplate',
                        faceValue: '${faceValue}',
                        diceType: '${diceType}',
                        xCoordinate: '${xCoordinate}',
                        yCoordinate: '${yCoordinate}',
                        rotation: '${rotation}',
                        size: '${datasource.payload.dice.size.landscapeXLarge}',
                    },
                ],
            },
            DiceTemplate: {
                parameters: [
                    'faceValue',
                    'diceType',
                    'xCoordinate',
                    'yCoordinate',
                    'rotation',
                    'size',
                ],
                item: [
                    {
                        type: 'Frame',
                        borderRadius: 5,
                        borderColor: 'grey',
                        borderWidth: '${datasource.payload.borderWidth}',
                        width: '${size}',
                        height: '${size}',
                        top: '${yCoordinate}',
                        left: '${xCoordinate}',
                        transform: [
                            {
                                rotate: '${rotation}',
                            },
                        ],
                        position: 'absolute',
                        items: [
                            {
                                type: 'Image',
                                width: '100%',
                                height: '100%',
                                source: 'https://dicechampionship.s3-eu-west-1.amazonaws.com/visuals/dice_${diceType}_${faceValue}.png',
                            },
                        ],
                    },
                ],
            },
            SumOfDiceText: {
                parameters: [
                    'sumOfDice',
                ],
                item: [
                    {
                        when: '${@viewportProfile == @hubRoundSmall}',
                        type: 'NumberTemplate',
                        yOffset: '${datasource.payload.sumOfDice.roundSmall.yOffset}',
                        xOffset: '${datasource.payload.sumOfDice.roundSmall.xOffset}',
                        text: '${sumOfDice}',
                        fontSize: '${datasource.payload.fontSize.roundSmall}',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeSmall}',
                        type: 'NumberTemplate',
                        yOffset: '${datasource.payload.sumOfDice.landscapeSmall.yOffset}',
                        xOffset: '${datasource.payload.sumOfDice.landscapeSmall.xOffset}',
                        text: '${sumOfDice}',
                        fontSize: '${datasource.payload.fontSize.landscapeSmall}',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeMedium}',
                        type: 'NumberTemplate',
                        yOffset: '${datasource.payload.sumOfDice.landscapeMedium.yOffset}',
                        xOffset: '${datasource.payload.sumOfDice.landscapeMedium.xOffset}',
                        text: '${sumOfDice}',
                        fontSize: '${datasource.payload.fontSize.landscapeMedium}',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeLarge}',
                        type: 'NumberTemplate',
                        yOffset: '${datasource.payload.sumOfDice.landscapeLarge.yOffset}',
                        xOffset: '${datasource.payload.sumOfDice.landscapeLarge.xOffset}',
                        text: '${sumOfDice}',
                        fontSize: '${datasource.payload.fontSize.landscapeLarge}',
                    },
                    {
                        when: '${@viewportProfile == @tvLandscapeXLarge}',
                        type: 'NumberTemplate',
                        yOffset: '${datasource.payload.sumOfDice.landscapeXLarge.yOffset}',
                        xOffset: '${datasource.payload.sumOfDice.landscapeXLarge.xOffset}',
                        text: '${sumOfDice}',
                        fontSize: '${datasource.payload.fontSize.landscapeXLarge}',
                    },
                ],
            },
            RankText: {
                parameters: [
                    'rank',
                ],
                item: [
                    {
                        when: '${@viewportProfile == @hubRoundSmall}',
                        type: 'NumberTemplate',
                        yOffset: '${datasource.payload.rank.roundSmall.yOffset}',
                        xOffset: '${datasource.payload.rank.roundSmall.xOffset}',
                        text: '${rank}',
                        fontSize: '${datasource.payload.fontSize.roundSmall}',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeSmall}',
                        type: 'NumberTemplate',
                        yOffset: '${datasource.payload.rank.landscapeSmall.yOffset}',
                        xOffset: '${datasource.payload.rank.landscapeSmall.xOffset}',
                        text: '${rank}',
                        fontSize: '${datasource.payload.fontSize.landscapeSmall}',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeMedium}',
                        type: 'NumberTemplate',
                        yOffset: '${datasource.payload.rank.landscapeMedium.yOffset}',
                        xOffset: '${datasource.payload.rank.landscapeMedium.xOffset}',
                        text: '${rank}',
                        fontSize: '${datasource.payload.fontSize.landscapeMedium}',
                    },
                    {
                        when: '${@viewportProfile == @hubLandscapeLarge}',
                        type: 'NumberTemplate',
                        yOffset: '${datasource.payload.rank.landscapeLarge.yOffset}',
                        xOffset: '${datasource.payload.rank.landscapeLarge.xOffset}',
                        text: '${rank}',
                        fontSize: '${datasource.payload.fontSize.landscapeLarge}',
                    },
                    {
                        when: '${@viewportProfile == @tvLandscapeXLarge}',
                        type: 'NumberTemplate',
                        yOffset: '${datasource.payload.rank.landscapeXLarge.yOffset}',
                        xOffset: '${datasource.payload.rank.landscapeXLarge.xOffset}',
                        text: '${rank}',
                        fontSize: '${datasource.payload.fontSize.landscapeXLarge}',
                    },
                ],
            },
            NumberTemplate: {
                parameters: [
                    'text',
                    'yOffset',
                    'xOffset',
                    'fontSize',
                ],
                item: [
                    {
                        type: 'Frame',
                        borderRadius: 5,
                        borderColor: 'grey',
                        borderWidth: '${datasource.payload.borderWidth}',
                        width: '18vw',
                        height: '9vw',
                        top: '${yOffset}',
                        left: '${xOffset}',
                        position: 'absolute',
                        items: [
                            {
                                type: 'Text',
                                style: 'baseText',
                                text: '${text}',
                                fontSize: '${fontSize}',
                                textAlign: 'center',
                            },
                        ],
                    },
                ],
            },
            HelperPoint: {
                parameters: [
                    'yCoordinate',
                    'xCoordinate',
                ],
                item: [
                    {
                        type: 'Frame',
                        borderRadius: 5,
                        borderColor: 'red',
                        borderWidth: '1',
                        width: '1vw',
                        height: '1vw',
                        top: '${yCoordinate}',
                        left: '${xCoordinate}',
                        position: 'absolute',
                        items: [
                            {
                                type: 'Text',
                                style: 'baseText',
                                text: '',
                                fontSize: '1',
                                textAlign: 'center',
                            },
                        ],
                    },
                ],
            },
        },
        mainTemplate: {
            parameters: [
                'datasource',
            ],
            items: [
                {
                    type: 'Container',
                    width: '100vw',
                    height: '100vh',
                    alignItems: 'center',
                    items: [
                        {
                            type: 'BackgroundImage',
                        },
                        {
                            type: 'SumOfDiceText',
                            sumOfDice: '${datasource.payload.sumOfDice.value}',
                        },
                        {
                            type: 'RankText',
                            rank: '${datasource.payload.rank.value}',
                        },
                        {
                            type: 'PlayingField',
                            items: [],
                        },
                    ],
                },
            ],
        },
    },
    datasources: {
        payload: {
            borderWidth: 0,
            language: 'en',
            dice: {
                size: {
                    roundSmall: 28,
                    landscapeSmall: 35,
                    landscapeMedium: 50,
                    landscapeLarge: 60,
                    landscapeXLarge: 50,
                },
                items: [],
            },
            helperPoint: {
                xCoordinate: '50%',
                yCoordinate: '50%',
            },
            playingField: {
                roundSmall: {
                    yOffset: '22vh',
                    xOffset: '22vh',
                    width: '57vw',
                    height: '40vh',
                },
                landscapeSmall: {
                    yOffset: '15vw',
                    xOffset: '11vh',
                    width: '59vw',
                    height: '60vh',
                },
                landscapeMedium: {
                    yOffset: '17vw',
                    xOffset: '9vh',
                    width: '59vw',
                    height: '68vh',
                },
                landscapeLarge: {
                    yOffset: '17vw',
                    xOffset: '9vh',
                    width: '58vw',
                    height: '64vh',
                },
                landscapeXLarge: {
                    yOffset: '15vw',
                    xOffset: '11vh',
                    width: '57vw',
                    height: '67vh',
                },
            },
            sumOfDice: {
                value: '42',
                roundSmall: {
                    yOffset: '62vh',
                    xOffset: '55vw',
                },
                landscapeSmall: {
                    yOffset: '41vh',
                    xOffset: '78vw',
                },
                landscapeMedium: {
                    yOffset: '42vh',
                    xOffset: '80vw',
                },
                landscapeLarge: {
                    yOffset: '38vh',
                    xOffset: '78vw',
                },
                landscapeXLarge: {
                    yOffset: '37vh',
                    xOffset: '77vw',
                },
            },
            rank: {
                value: '123',
                roundSmall: {
                    yOffset: '74vh',
                    xOffset: '55vw',
                },
                landscapeSmall: {
                    yOffset: '73vh',
                    xOffset: '77vw',
                },
                landscapeMedium: {
                    yOffset: '71vh',
                    xOffset: '78vw',
                },
                landscapeLarge: {
                    yOffset: '67vh',
                    xOffset: '76vw',
                },
                landscapeXLarge: {
                    yOffset: '73vh',
                    xOffset: '75vw',
                },
            },
            fontSize: {
                roundSmall: 30,
                landscapeSmall: 60,
                landscapeMedium: 70,
                landscapeLarge: 96,
                landscapeXLarge: 70,
            },
        },
    },
    token: 'placeholder',
};
