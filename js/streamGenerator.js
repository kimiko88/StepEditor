const streamGenerator = {
    simpleStreamPatterns: {
        'LMMM|MMMR': ['LMMM|MMMR', 'LMMM|MMRM', 'LMMM|MRMM', 'MLMM|MMMR', 'MLMM|MMRM', 'MMLM|MMMR', 'MMLM|MRMM'],
        'LMMM|MMRM': ['LMMM|MMRM', 'LMMM|MMMR', 'LMMM|MRMM', 'MLMM|MMMR', 'MLMM|MMRM'], //'MMLM|MMMR', 'MMLM|MRMM'],
        'LMMM|MRMM': ['LMMM|MRMM', 'LMMM|MMMR', 'LMMM|MMRM', 'MMLM|MMMR', 'MMLM|MRMM'], //'MLMM|MMMR', 'MLMM|MMRM',
        'MLMM|MMMR': ['MLMM|MMMR', 'LMMM|MMMR', 'LMMM|MMRM', 'MLMM|MMRM', 'MMLM|MMMR', 'LMMM|MRMM', 'MMLM|MRMM'],
        'MLMM|MMRM': ['MLMM|MMRM', 'LMMM|MMMR', 'LMMM|MMRM', 'MLMM|MMMR', 'LMMM|MRMM'], //, 'MMLM|MMMR', 'MMLM|MRMM'
        'MMLM|MMMR': ['MMLM|MMMR', 'LMMM|MMMR', 'LMMM|MMRM', 'LMMM|MRMM', 'MLMM|MMMR', 'MLMM|MMRM', 'MMLM|MRMM'],
        'MMLM|MRMM': ['MMLM|MRMM', 'LMMM|MMMR', 'LMMM|MMRM', 'LMMM|MRMM', 'MMLM|MMMR'], //'MLMM|MMMR', 'MLMM|MMRM', 
    },

    generate(counter, quantization, canRepeatPattern, avoidFootswith = true, avoidCrossover = true, useMines = false) {
        let startIndex = canRepeatPattern ? 0 : 1
        var key = Object.keys(this.simpleStreamPatterns);
        let totalStream = counter * (quantization / 2)
        var result = ''
        for (var i = 0; i < totalStream; i++) {
            var randomKeyIndex = Math.floor((Math.random() * (key.length - 1)) + startIndex);
            var selectedPattern = key[randomKeyIndex]
            result += selectedPattern + '\n'
            key = this.simpleStreamPatterns[selectedPattern]
            if ((i + 1) % (quantization / 2) === 0) {
                result += ',' + '\n'
            }
        }
        return useMines ? result.replace(/R/g, 1).replace(/L/g, 1).replace(/\|/g, '\n') : result.replace(/R/g, 1).replace(/L/g, 1).replace(/\|/g, '\n').replace(/M/g, 0)
    },

    generateTriple(counter, quantization, canRepeatPattern, startWithEmpty, avoidFootswith = true, avoidCrossover = true, useMines = false) {
        let startIndex = canRepeatPattern ? 0 : 1
        var key = Object.keys(this.simpleStreamPatterns);
        var modulo = startWithEmpty ?  (3 * quantization / 8) : (3 * quantization / 8)
        let totalTriples = counter * modulo
        var result = ''
        for (var i = 0; i < totalTriples; i++) {
            var randomKeyIndex = Math.floor((Math.random() * (key.length - 1)) + startIndex);
            var selectedPattern = key[randomKeyIndex]
            result += selectedPattern + '|'
            key = this.simpleStreamPatterns[selectedPattern]
        }
        var splitted = result.split('|')
        var tripleResult = ''
        var noteCounter = 0
        var measureCounter = 0
        for (var index = 0; index < splitted.length; index++) {
            if (startWithEmpty) {
                if (index % 3 == 0) {
                    noteCounter++
                    tripleResult += 'MMMM\n'
                }
            }
            tripleResult += splitted[index] + '\n'
            noteCounter++
            if (startWithEmpty && noteCounter % quantization === 0) {
                measureCounter++
                tripleResult += ',\n'
                if (measureCounter >= counter) {
                    break
                }
            }
            if (!startWithEmpty) {
                if (index % 3 == 2) {
                    noteCounter++
                    tripleResult += 'MMMM\n'
                }
            }
            if (!startWithEmpty && noteCounter % quantization === 0) {
                measureCounter++
                tripleResult += ',\n'
                if (measureCounter >= counter) {
                    break
                }
            }
        }
        return useMines ? tripleResult.replace(/R/g, 1).replace(/L/g, 1).replace(/\|/g, '\n') : tripleResult.replace(/R/g, 1).replace(/L/g, 1).replace(/\|/g, '\n').replace(/M/g, 0)
    }
}

module.exports = streamGenerator