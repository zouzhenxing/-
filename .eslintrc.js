module.exports = {
    extends : "lei",
    rules : {
        'promise/catch-or-return' : "off",
    },
    globals : {
        express : false,
        rootPath : false,
        config : false,
        util : false,
        log4js : false,
        serialPort: false,
        SocketIO: false,
        serverSocket: false,
        fingerprint: false,
        redisClient: false,
        fprint: false,
        devcard: false,
        cardserver: false,
    }
};