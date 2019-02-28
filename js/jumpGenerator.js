const jumpGenerator = {
    simpleJumpPatterns: {
        'LRMM': ['LRMM', 'LMMR', 'LMRM', 'MRLM'],
        'LMRM': ['LMRM', 'LRMM', 'LMMR', 'MLRM'],
        'LMMR': ['LMMR', 'LRMM', 'LMRM', 'MMLR', 'MLMR'],
        'MLRM': ['MLRM', 'MLMR', 'LMRM'],
        'MRLM': ['MRLM', 'LRMM', 'MMLR'],
        'MLMR': ['MLMR', 'MLRM', 'LMMR', 'MMLR'],
        'MMLR': ['MMLR', 'MLMR', 'LMMR', 'MRLM']
    },

    jumpPatterns: {
        '11MM': ['11MM', '1M1M', '1MM1', 'M11M', 'M1M1', 'MM11'],
        '1M1M': ['1M1M', '11MM', '1MM1', 'M11M', 'M1M1', 'MM11'],
        '1MM1': ['1MM1', '11MM', '1M1M', 'M11M', 'M1M1', 'MM11'],
        'M11M': ['M11M', '11MM', '1M1M', '1MM1', 'M1M1', 'MM11'],
        'M1M1': ['M1M1', '11MM', '1M1M', '1MM1', 'M11M', 'MM11'],
        'MM11': ['MM11', '11MM', '1M1M', '1MM1', 'M11M', 'M1M1']
    },

    jumps: ['LRMM', 'LMRM', 'LMMR', 'MLRM', 'MRLM', 'MLMR', 'MMLR'],
    allJumps: ['11MM', '1M1M', '1MM1', 'M11M', 'M1M1', 'MM11'],

    generateSimple(counter, quantization, canRepeatJump, useMines = false) {
        let startIndex = canRepeatJump ? 0 : 1
        var key = Object.keys(this.simpleJumpPatterns);
        let totalJumps = counter * quantization
        var result = ''
        for (var i = 0; i < totalJumps; i++) {
            var randomKeyIndex = Math.floor((Math.random() * (key.length - 1)) + startIndex);
            var selectedJump = key[randomKeyIndex]
            result += selectedJump + '\n'
            key = this.simpleJumpPatterns[selectedJump]
            if ((i + 1) % quantization === 0) {
                result += ',' + '\n'
            }
        }
        return useMines ? result.replace(/R/g, 1).replace(/L/g, 1) : result.replace(/R/g, 1).replace(/L/g, 1).replace(/M/g, 0) 
    },

    generateSimpleJumpStep(counter, quantization, canRepeatJump, useMines = false){
        let startIndex = canRepeatJump ? 0 : 1
        var key = Object.keys(this.simpleJumpPatterns);
        let totalJumps = counter * quantization / 2
        var result = ''
        for (var i = 0; i < totalJumps; i++) {
            var randomKeyIndex = Math.floor((Math.random() * (key.length - 1)) + startIndex);
            var selectedJump = key[randomKeyIndex]
            result += selectedJump + '\n'
            var randomFeet = Math.floor((Math.random() * 2));
            result += randomFeet === 0 ? selectedJump.replace(/R/g,'M')+'\n' : selectedJump.replace(/L/g,'M') +'\n'
            key = this.simpleJumpPatterns[selectedJump]
            if ((i + 1) % (quantization/2) === 0) {
                result += ',' + '\n'
            }
        }
        return useMines ? result.replace(/R/g, 1).replace(/L/g, 1) : result.replace(/R/g, 1).replace(/L/g, 1).replace(/M/g, 0) 
    },

    generateRandomJump(counter, quantization, canRepeatJump, useMines = false){
        let startIndex = canRepeatJump ? 0 : 1
        var key = Object.keys(this.jumpPatterns);
        let totalJumps = counter * quantization
        var result = ''
        for (var i = 0; i < totalJumps; i++) {
            var randomKeyIndex = Math.floor((Math.random() * (key.length - 1)) + startIndex);
            var selectedJump = key[randomKeyIndex]
            result += selectedJump + '\n'
            key = this.jumpPatterns[selectedJump]
            if ((i + 1) % quantization === 0) {
                result += ',' + '\n'
            }
        }
        return useMines ? result : result.replace(/M/g, 0) 
    }
}

module.exports = jumpGenerator