var store = require('app-store-scraper');
const download = require('image-downloader');
var fs = require('fs');
const path = require('path');

var categories = [
	'BOOKS', 'BUSINESS', 'CATALOGS', 'EDUCATION', 'ENTERTAINMENT', 
	'FINANCE', 'FOOD_AND_DRINK', 'GAMES', 'HEALTH_AND_FITNESS', 
	'LIFESTYLE', 'MAGAZINES_AND_NEWSPAPERS', 'MAGAZINES_ARTS', 
	'MEDICAL', 'MUSIC', 'NAVIGATION', 'NEWS', 'PHOTO_AND_VIDEO', 
	'PRODUCTIVITY', 'REFERENCE', 'SHOPPING', 'SOCIAL_NETWORKING', 
	'SPORTS', 'TRAVEL', 'UTILITIES', 'WEATHER'
]

categories.forEach(function(category) {
	// Check if directory exists else create it
	var dir = './icons/' + category + '/';
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}

	// Clear all icons
	fs.readdir(dir, (err, files) => {
	  if (err) throw err;

	  for (const file of files) {
	    fs.unlink(path.join(dir, file), err => {
	      if (err) throw err;
	    });
	  }
	});

	// Add icons
	store.list({
	  collection: store.collection.TOP_FREE_IOS,
	  category: store.category[category],
	  num: 200
	})
	.then(function(value) {
		var app_arr = []

		for (i = 0; i < value.length; i++) {
			var app_dict = {}

			app_dict["appId"] = value[i].appId;
			app_dict["title"] = value[i].title;
			app_dict["icon"] = value[i].icon;
			app_dict["description"] = value[i].description;
			app_dict["genre"] = value[i].genre;

			// Push back into app list
			app_arr.push(app_dict)

			// Download image
			const options = {
			  url: value[i].icon,
			  dest: './icons/' + category + '/' + app_dict["appId"] + '.jpg' // Save to /path/to/dest/image.jpg
			}


			download.image(options)
			  .then(({ filename, image }) => {
			    console.log('Saved to', filename)  // Saved to /path/to/dest/image.jpg
			  })
			  .catch((err) => console.error(err))
		}

		console.log(app_arr);
	})
	.catch(console.log);
});
