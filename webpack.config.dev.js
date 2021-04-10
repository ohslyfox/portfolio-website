const path = require('path');

module.exports = {
    mode: "development",
    watch: true,
    output: {
        path: path.resolve(__dirname, 'root/dist'),
    }
}