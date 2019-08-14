
module.exports = {
    initiateTemplate: function() {
        delete require.cache[require.resolve('./template')];
        return require('./template');
    },

    getDiceCoordinates: function(allDice) {
        let coordinates = [];

        coordinates.push(
            {
                x: getRandomCoordinate('x'),
                y: getRandomCoordinate('y'),
                rotation: getRandomCoordinate('rotation'),
            }
        );

        const iterationLimit = 200;
        let iterationCount = 0;

        for (let coordinateIndex = 1; coordinateIndex < allDice.length; coordinateIndex++) {
            let distances;
            let candidate;
            do {
                distances = [];
                candidate = {
                    x: getRandomCoordinate('x'),
                    y: getRandomCoordinate('y'),
                    rotation: getRandomCoordinate('rotation'),
                };
                iterationCount += 1;
                coordinates.forEach(
                    (coordinate) => {
                        distances.push(
                            getDistance(coordinate, candidate)
                        );
                    }
                );
                if (iterationCount >= iterationLimit) {
                    return coordinates;
                }
            } while (
                Math.min(...distances) < 18
            );
            coordinates.push(candidate);
        }

        return coordinates;
    },

    placeDice: function(template, allDice, coordinates) {
        let diceType;
        for (let index = 0; index < coordinates.length; index++) {
            template.document.mainTemplate.items[0].items[3].items.push(
                {
                    type: 'Dice',
                    faceValue: `\${datasource.payload.dice.items[${index}].faceValue}`,
                    diceType: `\${datasource.payload.dice.items[${index}].diceType}`,
                    xCoordinate: `\${datasource.payload.dice.items[${index}].xCoordinate}`,
                    yCoordinate: `\${datasource.payload.dice.items[${index}].yCoordinate}`,
                    rotation: `\${datasource.payload.dice.items[${index}].rotation}`,
                }
            );

            diceType = index < 10 ? 'full' : 'ghost';

            template.datasources.payload.dice.items.push(
                {
                    faceValue: allDice[index],
                    diceType: diceType,
                    xCoordinate: `${coordinates[index].x}%`,
                    yCoordinate: `${coordinates[index].y}%`,
                    rotation: `${coordinates[index].rotation}%`,
                }
            );
        }

        return template;
    },

    addLanguage: function(template, locale) {
        const language = locale.match(/([a-z]+)-[A-Z]+/)[1];
        template.datasources.payload.language = language;
        return template;
    },

    addSumOfDice: function(template, sumOfDice) {
        template.datasources.payload.sumOfDice.value = sumOfDice;
        return template;
    },

    addRank: function(template, rank) {
        template.datasources.payload.rank.value = rank;
        return template;
    },
};

function getRandomCoordinate(type) {
    if (type === 'x') {
        return 3 + Math.round(
            84 * Math.random()
        );
    } else if (type === 'y') {
        return 3 + Math.round(
            77 * Math.random()
        );
    } else if (type === 'rotation') {
        return Math.round(
            360 * Math.random()
        );
    } else {
        return Math.round(
            100 * Math.random()
        );
    }
}

function getDistance(point1, point2) {
    const xFactor = 1;
    const yFactor = 1;
    return Math.sqrt(
        Math.pow(
            xFactor * (
                point1.x - point2.x
            ),
            2
        ) + Math.pow(
            yFactor * (
                point1.y - point2.y
            ),
            2
        )
    );
}
