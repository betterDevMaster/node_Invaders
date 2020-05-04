var Database = function() {
	this.mysql = require('mysql');
};
Database.prototype.mysqlDB = function() {
	if(this.mysql){
		var mysql_use = this.mysql.createConnection({
			host     : 'localhost',
			user     : 'phpmyadmin',
			password : '0000',
			database : 'Invaders'
		});
		
		mysql_use.connect(function(err){
			if(!err) {
			    console.log("Database is connected ... nn");    
			}else {
				console.log(err);
			    console.log("Error connecting database ... nn");    
			}
		});
		return mysql_use;

	}
	else{
		console.log('not mysql connection');
	}
};
module.exports = new Database();