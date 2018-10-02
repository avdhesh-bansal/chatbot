require('cls-hooked');
var loopback = require('loopback');
var LoopBackContext = require('loopback-context');
var boot = require('loopback-boot');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var path = require('path');
var fs = require('fs');

// require('paint-console');
require('dotenv').config();
// require('dotenv').config({path: path.join(__dirname, '../.env')})

process.env.PORT = process.env.PORT || 8080;
process.env.VCAP_SERVICES = process.env.VCAP_SERVICES || fs.readFileSync('./credentials.json', 'utf-8');

var app = module.exports = loopback();


console.log("\n\n<<<<<<< RUNNING ON ", process.env.NODE_ENV, " ENVIRONMENT >>>>>>>>>> \n\n")

//Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var flash = require('express-flash');

//attempt to build the providers/passport config
var config = {};
try {
  if(process.env.GOOGLE_LOGIN_CLIENT_ID){
      config = require('../server/providers.js');
  }
} catch (err) {
  console.error("ERROR in loading Providers: >>>> ");
  console.error(err);
  process.exit(1); // fatal
}

/*
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
   res.header("Access-Control-Allow-Credentials", true);
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
   res.header("Access-Control-Allow-Headers",
 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
   next();
 });
 */

bootOptions = { "appRootDir": __dirname};

boot(app, bootOptions, function(err) {
	if (err) throw err;

  //start the server if `$ node server.js`
  if (require.main === module){
		try{
      console.info("\n\n<<<<<<<< IN SERVER BOOT >>>>>>> ");
      app.io = require('socket.io')(app.start());
      // app.io.origins(allowedOrigins);
      app.io.on('connection', function(socket){
        console.info('a user connected');
        socket.on('CHAT', function(msg){
          console.info('\n\n\n\nmessage:>>>>>>>> ' + msg);
          // app.io.emit('CHAT', msg);
        });
        socket.on('disconnect', function(){
            console.warn('\n\n<<<<<<<< USER DISCONNECTED >>>>>> \n\n');
        });
      });
		}catch(err){
			console.log(err);
		}
	}
});

passportConfigurator.init(false);

//app.use(loopback.cookieParser(app.get('cookieSecret')));
app.use(cookieParser(app.get('cookieSecret')));

app.middleware('session:before', cookieParser(app.get('cookieSecret')));
app.middleware('session', expressSession({
  secret: 'kitty',
  saveUninitialized: true,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  resave: true,
  httpOnly: true,
  ephemeral: true
}));

//We need flash messages to see passport errors
app.use(flash());

// var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

  passportConfigurator.setupModels({
	  userModel: app.models.MyUser,
	  userIdentityModel: app.models.MyUserIdentity,
	  userCredentialModel: app.models.UserCredential,
		applicationCredential: app.models.ApplicationCredential
	});

function customProfileToUser(provider, profile, options) {
  // console.log("IN customProfileToUser: >>> ", profile);
	var userObj = profile["_json"];
	delete userObj["_raw"];

  var userInfo = {
    provider: provider,
    providerId: profile.id,
    username: provider+"."+profile.id,
    password: 'secret',
    email: profile.id+"@loopback."+provider+".com",
    profile: userObj
  };
  return userInfo;
}

for (var s in config) {
	var c = config[s];
	c.session = c.session !== false;
  c.profileToUser = customProfileToUser;
	passportConfigurator.configureProvider(s, c);
}

app.on('uncaughtException', function(err) {
    if(err.errno === 'EADDRINUSE')
         console.error('err: >>>>' , err);
    else
         console.error(err);
    app.exit(1);
});

  app.start = function() {
  	  // start the web server
  	  return app.listen(function() {
  	    app.emit('started');
  	    var baseUrl = app.get('url').replace(/\/$/, '');
  	    console.info('Web server listening at: %s', baseUrl);
  	    if (app.get('loopback-component-explorer')) {
  	      var explorerPath = app.get('loopback-component-explorer').mountPath;
  	      console.info('Browse your REST API at %s%s', baseUrl, explorerPath);
  	    }
  	  });
  	};
