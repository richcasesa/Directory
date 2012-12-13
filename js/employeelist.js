var db;
var serviceURL = "../services/"; // relative to html file
    
var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	// open database and load employees when Cordova is ready
    db = window.openDatabase("DirectoryDB", "1.0", "Directory", 400000);	
    db.transaction(getEmployees, getEmployees_error);
}

function getEmployees(tx) {
	// query DB and return results to getEmployees_success
    console.log('Loading employees');
	var sql = "select e.id, e.firstName, e.lastName, e.title, e.picture, count(r.id) reportCount " + 
				"from employee e left join employee r on r.managerId = e.id " +
				"group by e.id order by e.lastName, e.firstName";
	tx.executeSql(sql, [], getEmployees_success);
	//tx.executeSql(sql, [], getRemoteData);
}

function getRemoteData() {
	alert('in getRemoteData');
	$.getJSON('http://coenraets.org/apps/directory/services/getemployees.php', function(data) {
		//$('#employeeList li').remove();
		employees = data.items;
		$.each(employees, function(index, employee) {
			alert(employee.lastName);
			$('#employeeList').append('<li><a href="employeedetails.html?id=' + employee.id + '">' +
					'<h4>' + employee.firstName + ' ' + employee.lastName + '</h4>' +
					'<p>' + employee.title + '</p>' +
					'<span class="ui-li-count">' + employee.reportCount + '</span></a></li>');
		});
		$('#employeeList').listview('refresh');

	});
	setTimeout(function(){
		scroll.refresh();
	},100);
};

function getEmployees_success(tx, results) {
	// hide busy label and add employees to list
	$('#busy').hide();
    var len = results.rows.length;
    for (var i=0; i<len; i++) {
        var employee = results.rows.item(i);
		$('#employeeList').append('<li><a href="employeedetails.html?id=' + employee.id + '">' +
				'<img src="pics/' + employee.picture + '" class="list-icon"/>' +
				'<p class="line1">' + employee.firstName + ' ' + employee.lastName + '</p>' +
				'<p class="line2">' + employee.title + '</p>' +
				'<span class="bubble">' + employee.reportCount + '</span></a></li>');
    }
	setTimeout(function(){
		scroll.refresh();
	},100);
	// done with db, free up memory
    db = null;
}

function getEmployees_error(tx, error) {
	// loading employees failed, recreate and populate employee table
    console.log("Error reading db: " + error);
    db.transaction(setupDB, setupDB_error, setupDB_success);
}

function setupDB(tx) {
    $('#busy').show();
    console.log('Recreating employee table');
	tx.executeSql('DROP TABLE IF EXISTS employee');
	var sql = 
		"CREATE TABLE IF NOT EXISTS employee ( "+
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"firstName VARCHAR(50), " +
		"lastName VARCHAR(50), " +
		"title VARCHAR(50), " +
		"department VARCHAR(50), " + 
		"managerId INTEGER, " +
		"city VARCHAR(50), " +
		"officePhone VARCHAR(30), " + 
		"cellPhone VARCHAR(30), " +
		"email VARCHAR(30), " +
		"picture VARCHAR(200))";
    tx.executeSql(sql);
    console.log('Adding Employees');

	$.getJSON('http://coenraets.org/apps/directory/services/getemployees.php', function(data) {
		//$('#employeeList li').remove();
		employees = data.items;
		$.each(employees, function(index, employee) {
			alert(employee.lastName);
			tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [employee.id,employee.firstName,employee.lastName,employee.managerId, employee.title,employee.department,employee.officePhone,employee.cellPhone,employee.email,employee.city,employee.picture]);
		});
		$('#employeeList').listview('refresh');

	});
/*    
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (12,'Steven','Wells',4,'Software Architect','Engineering','617-000-0012','781-000-0012','swells@fakemail.com','Boston, MA','steven_wells.jpg')");
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (11,'Amy','Jones',5,'Sales Representative','Sales','617-000-0011','781-000-0011','ajones@fakemail.com','Boston, MA','amy_jones.jpg')");
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (10,'Kathleen','Byrne',5,'Sales Representative','Sales','617-000-0010','781-000-0010','kbyrne@fakemail.com','Boston, MA','kathleen_byrne.jpg')");
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (9,'Gary','Donovan',2,'Marketing','Marketing','617-000-0009','781-000-0009','gdonovan@fakemail.com','Boston, MA','gary_donovan.jpg')");
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (8,'Lisa','Wong',2,'Marketing Manager','Marketing','617-000-0008','781-000-0008','lwong@fakemail.com','Boston, MA','lisa_wong.jpg')");
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (7,'Paula','Gates',4,'Software Architect','Engineering','617-000-0007','781-000-0007','pgates@fakemail.com','Boston, MA','paula_gates.jpg')");
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (5,'Ray','Moore',1,'VP of Sales','Sales','617-000-0005','781-000-0005','rmoore@fakemail.com','Boston, MA','ray_moore.jpg')");
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (6,'Paul','Jones',4,'QA Manager','Engineering','617-000-0006','781-000-0006','pjones@fakemail.com','Boston, MA','paul_jones.jpg')");
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (3,'Eugene','Lee',1,'CFO','Accounting','617-000-0003','781-000-0003','elee@fakemail.com','Boston, MA','eugene_lee.jpg')");
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (4,'John','Williams',1,'VP of Engineering','Engineering','617-000-0004','781-000-0004','jwilliams@fakemail.com','Boston, MA','john_williams.jpg')");
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (2,'Julie','Taylor',1,'VP of Marketing','Marketing','617-000-0002','781-000-0002','jtaylor@fakemail.com','Boston, MA','julie_taylor.jpg')");
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (1,'James','King',0,'President and CEO','Corporate','617-000-0001','781-000-0001','jking@fakemail.com','Boston, MA','james_king.jpg')");
*/
}

function setupDB_error(tx, error) {
	// DB Setup failed, hide busy label and show error
	$('#busy').hide();
    alert("Database Error: " + error);
    alert('Error Code: ' + error.code);
}

function setupDB_success() {
	// DB is now setup, try to load Employees again
    console.log('Successfully populated Employees');
    db.transaction(getEmployees, getEmployees_error);
}

/*

function PwClient(){
	//var SERVER = "http://192.168.1.118/firmdirectory/";  // mac book at home
	//var SERVER = "http://10.95.118.125/FirmDir/";  // dev apache server at work
	var SERVER = "https://pwmobiledata.paulweiss.com/firmdirectory/"; // external server at work	
	var LoginRequired = true;
	 	
    var CREDENTIALS = 'Basic ' + Ti.Utils.base64encode("pwmobile-iis:Th#25mZ7!k"); // credentials for external server
	
	var client = Titanium.Network.createHTTPClient();
	client.setTimeout(10000);
	client.getPWFile = function(fname){
		client.open('GET', SERVER + fname, true);
		Ti.API.log('info', 'opening connection to ' + "https://pwmobiledata.paulweiss.com/firmdirectory/" + fname);
		if (LoginRequired) client.setRequestHeader('Authorization',CREDENTIALS);
	};
	return client;	
};

*/

function checkConnection() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);
}
