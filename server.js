const http = require("http");
const fs = require('fs');

http.createServer(function(request, response){
    if(request.url === "/Peditor" || request.url === "/"){
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		response.end(fs.readFileSync('./index.html'));
    }
	else 
	{
		    const filePath = request.url.substr(1);
			fs.access(filePath, fs.constants.R_OK, err => {
			if(err){
			console.log(filePath);
            response.statusCode = 404;
            response.end("Resource not found!");
			}
			else{
            fs.createReadStream(filePath).pipe(response);
		}});
	}
}).listen(8080);
console.log("server listen on port 8080");