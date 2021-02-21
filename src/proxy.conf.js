
module.exports = {
    "/weather-information": {
        "target": "https://storage.googleapis.com/kisanhub-interview-question-data",
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
        	"^/weather-information": "metoffice"
	    }
    }
};
