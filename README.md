# NodeHTMLPDFCreator
convert HTML to PDF using node.js

Try deploying with existing deployment methods - use remote build.

You need to use Postman/curl to trigger a post request.

**URI **-  https://kmalyalanodetest.azurewebsites.net/generatehtmlpdf

**BODY of the Request:**

{
	"source": {
		"id": "0001",
		"type": "donut",
		"name": "Cake",
		"ppu": 0.55,
		"batters": {
			"batter": [{
				"id": "1001",
				"type": "Regular"
			}]
		},
		"topping": [{
			"id": "5001",
			"type": "None"
		}]
	},
	"options": {
		"format": "A3",
		"orientation": "landscape"
	}
}

**Response screenshot:**

<img width="617" alt="image" src="https://user-images.githubusercontent.com/84483984/170003122-ef7e7b65-3ebd-4473-8daf-c8c8162d7e42.png">

First. you will get empty response from postman, Try fixing it by checking the logs
