const express = require("express");
const cors = require("cors");
const debug = require("debug");

const config = require("./game-client-config");
const gameClient = require("l1.client.node-js")(config);
gameClient.autoUpdateToken(console.log);

const routes = require("./routes");
const applyMiddlewares = require("./middleware");

const app = express();

const corsOptions = {
    origin: (origin, callback) => {
        if (!config.enableCors) {
            callback(null, true);
        } else {
            if (config.corsUrls?.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error(`Test test Not allowed by CORS ${origin}`));
            }
        }
    }
};

app.use(
    cors({
        origin: corsOptions
    })
);

applyMiddlewares(app);
app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// production error handler ///
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

app.set("port", config.port || 5002);

var server = app.listen(app.get("port"), function () {
    console.log("Express server listening on port " + server.address().port);
    debug("Express server listening on port " + server.address().port);
});
