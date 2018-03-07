module.exports = {
    options: {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        signed: true,
        // DISABLED for browser-sync
        // secure: true,
        httpOnly: true,
        // sameSite: true,
        // domain: 'localhost'
    },
    name: 'access-token'
}

// Note res.clearCookie needs the exact parameters including the cookie options to clear them