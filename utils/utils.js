class Utils {
    calculateOvers(totalBalls) {
        const fullOvers = Math.floor(totalBalls/6);
        const remainingBalls = totalBalls % 6;
        return fullOvers + remainingBalls;
    }
}

module.exports = new Utils;
