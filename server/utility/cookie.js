module.exports = {
    options: {
        maxAge: 3600000,
        signed: true,
        // DISABLED for browser-sync
        // secure: true,
        httpOnly: true,
        // sameSite: true,
        // domain: 'localhost:8080'
    },
    name: 'access-token'
}

// Note res.clearCookie needs the exact parameters including the cookie options to clear them