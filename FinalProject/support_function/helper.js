module.exports.pugArg = function(req, anotherAru = null) {
    return {LoggedIn: req.cookies['user-CMND'],
            userName: req.cookies['user-name'],
            teacher: req.cookies['role'] === "teacher",
            ...anotherAru
            };
}