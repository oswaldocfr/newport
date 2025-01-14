/**
 * Facebook post model
 * 
 * @class Models.ca-connexion
 * @uses core
 * @uses http
 * @uses utilities
 */
var APP = require("core");
var HTTP = require("http");
var UTIL = require("utilities");
var table =  "ca_objects";
	
function Model() {


	/**
	 * Initializes the model
	 * @param {Number} _id The UID of the component
	 */
	this.init = function(_id) {
		APP.log("debug", "CA_MODEL.init(" + _id + ")");



		var db = Ti.Database.open("Newport");

		db.execute("CREATE TABLE IF NOT EXISTS ca_model_" + table + " (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, date TEXT, description TEXT, link TEXT);");

		db.close();
	};

	/**
	 * Fetches the remote data
	 * @param {Object} _params The request paramaters to send
	 * @param {String} _params.url The URL to retrieve data from
	 * @param {Function} _params.callback The function to run on data retrieval
	 * @param {Function} _params.error The function to run on error
	 * @param {Number} _params.cache The length of time to consider cached data 'warm'
	 */
	this.fetch = function(_params) {
		APP.log("debug", "CA_MODEL.fetch");
		APP.log("trace", JSON.stringify(_params));

		var isStale = UTIL.isStale(_params.url, _params.cache);

		if(isStale) {
			if(_params.cache !== 0 && isStale !== "new") {
				_params.callback();
			}

			HTTP.request({
				timeout: 10000,
				headers: [{name: 'Authorization', value: _params.authString}],
				type: "GET",
				format: "JSON",
				url: _params.url,
				passthrough: _params.callback,
				success: this.handleData,
				failure: _params.error
			});
		} else {
			_params.callback();
		}
	};

	/**
	 * Handles the data return
	 * @param {Object} _data The returned data
	 * @param {String} _url The URL of the remote source
	 * @param {Function} _callback The function to run on data retrieval
	 */
	this.handleData = function(_data, _url, _callback) {
		APP.log("debug", "CA_MODEL.handleData");
		//APP.log("trace", JSON.stringify(_data));
		//APP.log("trace", _data);
		APP.log("trace", _data.ok);
		if(_data.ok == true) {
			APP.log("debug", "connected");
			var db = Ti.Database.open("Newport");
			APP.log("debug", table);
			//db.execute("DELETE FROM ca_model_" + table + ";");
			db.execute("BEGIN TRANSACTION;");
			//APP.log("debug",_data);
			APP.log("debug","HERE");
			APP.ca_modele_prop = new Array();
			APP.ca_modele_values = {};
			var _data2;
			
			
			// Browsing data
		    for (var prop in _data) {
		        var _data2 = _data[prop];
		        if(prop != "ok") {
		        	for (var prop2 in _data2) {
		        		APP.ca_modele_prop.push(prop2);
		        		APP.log("debug","HERE2");
		        		APP.ca_modele_values[prop2] = _data2[prop2];
	        		} 
		        }
		    }
    
			/*for(var i = 0, x = _data.entries.length; i < x; i++) {
				var article = _data.entries[i];

				var title = UTIL.cleanEscapeString(article.title);

				if(title.length > 2) {
					var date = article.published.split("T")[0].replace(/-/g, "/") + " " + article.published.split("T")[1].split("+")[0].split("-")[0];
					date = UTIL.escapeString(new Date(date).getTime());
					var description = UTIL.cleanEscapeString(article.content);
					var link = UTIL.cleanEscapeString(article.alternate);

					db.execute("INSERT INTO ca_model_" + table + " (id, title, date, description, link) VALUES (NULL, " + title + ", " + date + ", " + description + ", " + link + ");");
				}
			}*/

			db.execute("INSERT OR REPLACE INTO updates (url, time) VALUES(" + UTIL.escapeString(_url) + ", " + new Date().getTime() + ");");
			db.execute("END TRANSACTION;");
			db.close();
		}

		if(_callback) {
			_callback();
		}
	};

	/**
	 * Retrieves all articles
	 */
	this.getModelFirstLevelInfo = function() {
		return APP.ca_modele_prop;
	};
	
	this.getAllArticles = function() {
		APP.log("debug", "CA_MODEL.getAllArticles(" + table + ")");
		var temp = [];
		return temp;
	};

	/**
	 * Retrieves an article by ID
	 * @param {Number} _id The article ID
	 */
	this.getArticle = function(_id) {
		APP.log("debug", "CA_MODEL.getArticle");
		var temp = [];
		return temp;
	};

	/**
	 * Retrieves the next article
	 * @param {Number} _id The current article ID
	 */
	this.getNextArticle = function(_id) {
		APP.log("debug", "CA_MODEL.getNextArticle");
		var temp = [];
		return temp;

	};

	/**
	 * Retrieves the previous article
	 * @param {Number} _id The current article ID
	 */
	this.getPreviousArticle = function(_id) {
		APP.log("debug", "CA_MODEL.getPreviousArticle");
		var temp = [];
		return temp;

	};
	
	/**
	 * Return if the user is logged in or not
	 * @param ???
	 */
	this.isConnected = function() {
		return true;
	};
}

module.exports = function() {
	return new Model();
};