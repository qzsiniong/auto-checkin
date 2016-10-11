const superagent = require('superagent'),
    events = require("events"),
    schedule = require("node-schedule"),
    md5 = require("md5");


const url_login = 'http://www.some.com/login',
    url_checkin = 'http://www.some.com/checkin',
    users = [
        ['username', 'password']
    ];

const emitter = new events.EventEmitter();

// schedule.scheduleJob('1 1 9-11 * * *', function() {
  users.forEach((user) => {
      login(getLoginData(user));
  });
// });


function getLoginData(user) {
    return JSON.stringify({
        nameOrEmail: user[0],
        userPassword: md5(user[1])
    });
}

emitter.on("setCookeie", checkin); //监听setCookeie事件

function login(loginData) {
    superagent.post(url_login)
        .type("form")
        .send(loginData)
        .end(function(err, res) {
            if (err) throw err;
            var cookie = res.header['set-cookie'];
            emitter.emit("setCookeie", cookie);
            console.log(res.body);
        })
}

function checkin(cookies) {
    var r = superagent.get(url_checkin);
    cookies.forEach((cookie) => r.set("Cookie", cookie));

    r.end(function(err, res) {
        if (err) {
            throw err;
        };
        //checkin successful
    })
};
