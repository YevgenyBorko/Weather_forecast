(function () {  // local namespace declaration

    let parameters = [];   // array of data parameters cityName, longitude and latitude.

    class location {                                    // location object
        constructor(cityName, longitude, latitude) { // constructor
            this.cityName = cityName;               // name field
            this.longitude = longitude;             // longitude field
            this.latitude = latitude;               // latitude field
        }
    }

    function getUserData(){
        fetch('./WeatherList')
            .then(
                function (response) {
                    // handle the error
                    if (response.status !== 200) {
                        document.querySelector("#data").innerHTML = 'Looks like there was a problem. Status Code: ' +
                            response.status;
                        return;
                    }

                    // Examine the response and generate the HTML
                    response.json().then(function (weatherData) {
                        if (weatherData.error)
                            document.querySelector("#data").innerHTML = "Some error occured, is the database initialized?";
                        else {
                            let html = '';
                            for (let i in weatherData) {
                                let data = new location(weatherData[i].cityName, weatherData[i].longitude, weatherData[i].latitude);             // builds a new data object from received inputs
                                parameters.push(data);      // adds data fields to the coordinates array
                                let newOption = document.getElementById("dropDownSelect"); // finds the elemnt of dropdown menu
                                newOption.add(new Option(weatherData[i].cityName, weatherData[i].cityName));      // adds a new option in dropdown menu
                            }
                            toggleButtons();        // disable buttons at the beginning when there is no options to select
                            // display the HTML
                            document.querySelector("#data").innerHTML = html;
                        }
                    });
                }
            )
            .catch(function (err) {
                // need to display error message!
                document.querySelector("#data").innerHTML = 'Fetch Error :' . err;
                console.log('Fetch Error :', err);
            });
    }



    function ResetList(){

        let dropDown = document.getElementById("dropDownSelect");

        document.getElementById("afterDropdown").innerHTML = "";

        dropDown.length = 1;

        parameters.length = 0;

        fetch(`/api/reset/`, {method: 'DELETE'})
            .then((response)=> {return response.json()})
            .then(function(response) {
                console.log('Request succeeded with JSON response', response);
            }).catch(function(error) {
            console.log('Request failed', error);
        });
    }


    function validateName(cityName){ // name field validation function

        if (cityName === "")        //if name is empty display error message
        {
            document.getElementById("inputCityError").innerHTML += `<div class ="text-danger"><p>City Name cannot be empty</p></div>`;
            return false;
        }

        if (!isNaN(cityName))       //if name is a number display error message
        {
            document.getElementById("inputCityError").innerHTML += `<div class ="text-danger"><p>City Name cannot be a number</p></div>`;
            return false;
        }

        if (!cityName.match(/^[A-Za-z]+$/))         // if name contains numbers or special characters display error message
        {
            document.getElementById("inputCityError").innerHTML += `<div class ="text-danger"><p>City Name must contain only letters from A-Z or a-z</p></div>`;
            return false;
        }

        document.getElementById("inputCityError").innerHTML = "";  // if name is valid, clear error message field
        return true;
    }

    function validateLongitude(longitude){

        if (longitude === "")       //if name is empty display error message
        {
            document.getElementById("inputLongitudeError").innerHTML += `<div class ="text-danger"><p>Longitude cannot be empty</p></div>`;
            return false;
        }

        if (isNaN(longitude))       //if longitude is not a number display error message
        {
            document.getElementById("inputLongitudeError").innerHTML += `<div class ="text-danger"><p>Longitude cannot contain letters</p></div>`;
            return false;
        }

        if (longitude < -180 || longitude > 180 )       // if longitude is out of range display error message
        {
            document.getElementById("inputLongitudeError").innerHTML += `<div class ="text-danger"><p>Longitude out of range (-180 - 180)</p></div>`;
            return false;
        }

        if (!longitude.match(/(-?)\d+\.\d+/))           // if longitude is not decimal display error message
        {
            document.getElementById("inputLongitudeError").innerHTML += `<div class ="text-danger"><p>Longitude must be a decimal number</p></div>`;
            return false;
        }

        document.getElementById("inputLongitudeError").innerHTML = "";      // if longitude is valid, clear error message field
        return true;
    }

    function validateLatitude(latitude){

        if (latitude === "")            //if name is empty display error message
        {
            document.getElementById("inputLatitudeError").innerHTML += `<div class ="text-danger"><p>Latitude cannot be empty</p></div>`;
            return false;
        }

        if (isNaN(latitude))        //if latitude is not a number display error message
        {
            document.getElementById("inputLatitudeError").innerHTML += `<div class ="text-danger"><p>Latitude cannot contain letters</p></div>`;
            return false;
        }

        if (latitude < -90 || latitude > 90 )       // if latitude is out of range display error message
        {
            document.getElementById("inputLatitudeError").innerHTML += `<div class ="text-danger"><p>Latitude out of range (-90 - 90)</p></div>`;
            return false;
        }

        if (!latitude.match(/(-?)\d+\.\d+/))        // if latitude is not decimal display error message
        {
            document.getElementById("inputLatitudeError").innerHTML += `<div class ="text-danger"><p>Latitude must be a decimal number</p></div>`;
            return false;
        }

        document.getElementById("inputLatitudeError").innerHTML = "";       // if latitude is valid, clear error message field
        return true;
    }

    function validateUserInputs(cityName, longitude, latitude) {  // main validation function, validates all field from each validation function

        let validateFields = true;  // saving boolean value

        if (!validateName(cityName)){           // if name is not valid, boolean becomes false
            document.getElementById("inputCityError").innerHTML = "";
            validateFields = validateName(cityName);
        }

        if (!validateLongitude(longitude)){         // if longitude is not valid, boolean becomes false
            document.getElementById("inputLongitudeError").innerHTML = "";
            validateFields = validateLongitude(longitude);
        }

        if (!validateLatitude(latitude)){           // if latitude is not valid, boolean becomes false
            document.getElementById("inputLatitudeError").innerHTML = "";
            validateFields = validateLatitude(latitude);
        }

        for(let c of parameters)        // check if there are duplicates in the parameters array and prevent them to be added
        {
            if(c.longitude === longitude && c.latitude === latitude)        // compare given longitude and latitude parameters to existing ones
            {
                validateFields = false          // if there are duplicates set the validateFields value to false to prevent adding later
                document.getElementById("inputLatitudeError").innerHTML = "Weather parameters duplicate";
                break;
            }
        }

        return validateFields;          // returns boolean value state
    }

    function addLocation()      // location creation function if dropdown
    {
        let cityName = document.getElementById("inputCityName").value.trim(),       // local name variable for html handeling
        longitude = document.getElementById("inputLongitude").value.trim(),         // local longitude variable for html handeling
        latitude = document.getElementById("inputLatitude").value.trim();           // local latitude variable for html handeling

        if(validateUserInputs(cityName, longitude, latitude))   // checks field validation if valid, adds fields to array and builds the dropdown menu
        {

            cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);    // makes saved name input with capital letter

            let data = new location(cityName, longitude, latitude);             // builds a new data object from received inputs

            parameters.push(data);      // adds data fields to the coordinates array

            let newOption = document.getElementById("dropDownSelect"); // finds the elemnt of dropdown menu

            newOption.add(new Option(cityName, cityName));      // adds a new option in dropdown menu
            document.getElementById("fieldinputs").reset();     // resets input field for new insertion

            fetch(`/api/addWeather/${cityName}/${latitude}/${longitude}`, { method: 'POST'})
                .then(
                    function () {window.location.href = "weather";}
                )
                .catch(function (err) {
                    console.log('Fetch Error :', err);
                    document.querySelector("#data").innerHTML = "Looks like there was a problem!";
                });
        }
    }

    function findCoordinates()      // gets coordinates from the array by selected option in dropdown
    {
        let dropDown = document.getElementById("dropDownSelect");       // finds dropdown element

        return parameters[dropDown.selectedIndex - 1];      // returns selected coordinates object in the array
    }

    function toggleButtons() {              // changes buttons state to disabled
        let dropDown = document.getElementById("dropDownSelect"),   // dropdown element variable
        displayButton = document.getElementById("Displayweather"),  // display button element variable
        deleteButton = document.getElementById("deleteButton"),     // delete button element variable
        resetButton = document.getElementById("Reset");     // reset button element variable

        dropDown.selectedIndex === 0 ? displayButton.disabled = true : displayButton.disabled = false;  // if selected index in dropdown is 0 set display button to disabled
        dropDown.selectedIndex === 0 ? deleteButton.disabled = true : deleteButton.disabled = false;    // if selected index in dropdown is 0 set delete button to disabled
        resetButton.disabled = parameters.length === 0; // if there are no parameters in dropdown set clear button to disabled
    }

    function displaySelectedParameters() {  // displays selected parameters in dropdown on screen

        let dropDown = document.getElementById("dropDownSelect");       // find the dropdown ellement
        let docHtml = `<h2>Selected: </h2><h6> City Name: ${findCoordinates().cityName}`
        docHtml += ` <h6>Longitude: ${findCoordinates().longitude}</h6> <h6>Latitude: ${findCoordinates().latitude}</h6>`;

        document.getElementById('afterDropdown').innerHTML = docHtml;       // builds parameters and inserts them in html

        if(dropDown.selectedIndex === 0)
            document.getElementById('afterDropdown').innerHTML = "";

        toggleButtons();
    }

    function DeleteValues() {       // deletes displayed parameters

        let dropDown = document.getElementById("dropDownSelect");

        document.getElementById("afterDropdown").innerHTML = "";

        let cityName = parameters[dropDown.selectedIndex-1].cityName
        let latitude = parameters[dropDown.selectedIndex-1].latitude
        let longitude = parameters[dropDown.selectedIndex-1].longitude

        if(dropDown.selectedIndex !== 0)
            dropDown.remove(dropDown.selectedIndex);

        parameters.length -= 1

        fetch(`/api/delete/${cityName}/${latitude}/${longitude}`, {method: 'DELETE'})
            .then((response)=> {return response.json()})
            .then(function(response) {
                console.log('Request succeeded with JSON response', response);
            }).catch(function(error) {
                console.log('Request failed', error);
            });

        toggleButtons();
    }

    function displayWeatherIcon(Weather){               // loads images according to weather name
        switch (Weather) {    // gets weather string
            case "clear":                   //in case the weather is clear
                return "http://www.7timer.info/img/misc/about_civil_clear.png";
            case "cloudy":                  //in case the weather is cloudy
                return "http://www.7timer.info/img/misc/about_civil_mcloudy.png";
            case "humid":                   //in case the weather is humid
                return "http://www.7timer.info/img/misc/about_civil_fog.png";
            case "ishower":                 //in case the weather is ishower
                return "http://www.7timer.info/img/misc/about_civil_ishower.png";
            case "lightrain":               //in case the weather is light rain
                return "http://www.7timer.info/img/misc/about_civil_lightrain.png";
            case "lightsnow":               //in case the weather is light snow
                return "http://www.7timer.info/img/misc/about_civil_lightsnow.png";
            case "mcloudy":                 //in case the weather is mcloudy
                return "http://www.7timer.info/img/misc/about_civil_cloudy.png";
            case "oshower":                 //in case the weather is oshower
                return "http://www.7timer.info/img/misc/about_civil_oshower.png";
            case "pcloudy":                 //in case the weather is party cloudy
                return "http://www.7timer.info/img/misc/about_civil_pcloudy.png";
            case "rain":                    //in case the weather is rain
                return "http://www.7timer.info/img/misc/about_civil_rain.png";
            case "rainsnow":                //in case the weather is rain with snow
                return "http://www.7timer.info/img/misc/about_civil_rainsnow.png";
            case "snow":                    //in case the weather is snow
                return "http://www.7timer.info/img/misc/about_civil_snow.png";
            case "tsrain":                  //in case the weather is thunder with rain
                return "http://www.7timer.info/img/misc/about_civil_tsrain.png";
            case "ts":                      //in case the weather is thunder storm
                return "http://www.7timer.info/img/misc/about_civil_tstorm.png";
        }
    }

    function reformatDateData(str) {    // reformats reciaved date from the weather server to a readable format
        console.log(str);

        let num = 0     // iterations variable
        let Year = ""
        let Month = ""
        let Day = ""

        for (let x of str) { // splits date data to day, month and year.
            if (num < 4 )
                Year += x
            else if (num >= 4 && num <= 5)
                Month += x
            else if (num >= 6 && num <= 7)
                Day += x
            num++;
        }
        return Day + '/' + Month + '/' + Year;  // returns string of reformatted date

    }

    function getData() {        // communication with server function
        fetch('http://www.7timer.info/bin/api.pl?lon=' + findCoordinates().longitude + '&lat='+ findCoordinates().latitude + '&product=civillight&output=json')
            .then(
                function (response) {

                    //handle the error
                    if (response.status !== 200) {  // checks for response status if it was successful or not
                        document.querySelector("#data").innerHTML = 'Looks like there was a problem. Status Code: ' +
                            response.status;
                        return;
                    }

                    // Examine the response and generate the HTML
                    response.json().then(function (data) {      // generates the Html from response according to my preference
                        let html = "";
                        for (let i of data.dataseries) {
                            html += `<div class="col bg-light border">`;
                            html += `<img src ='${displayWeatherIcon(i.weather)}' alt="cannot display image">`;
                            html += "<h5>" + "Date: " + reformatDateData(i.date.toString()) + "</h5>";
                            html += "<h5>" + "Weather: " + i.weather + "</h5>";
                            html += "<h5>" + "Temp min: " + i.temp2m.min + "</h5>";
                            html += "<h5>" + "Temp max: " + i.temp2m.max + "</h5>";
                            (i.wind10m_max !== 1) ? html += "<h5>" + "Wind Speed: " + i.wind10m_max + "</h5>" : "";
                            html += "</div>";
                        }
                        // display the HTML
                        document.querySelector("#data").innerHTML = html;
                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :', err);
                document.querySelector("#data").innerHTML = "Looks like there was a problem!";
            });
    }


    function loadImage(url){        // image loader function
        return new Promise(function(resolve, reject) {
            let img = new Image();
            img.src = url;
            img.onload = function() { resolve(img) }
            img.onerror = function(e) { reject(e) }
        });
    }

    document.addEventListener('DOMContentLoaded', function(){

        getUserData();

        const imgFail = "/images/loadFailed.png";     // failure image

        toggleButtons();

        document.getElementById('dropDownSelect').addEventListener('change', function (){ //add
            toggleButtons();                // switch buttons state according to selected option
            displaySelectedParameters();    // display parameters on screen
        });

        document.getElementById('addLocationButton').addEventListener('click', function (){ //add
            addLocation();          // build location
            findCoordinates()       // get selected coordinates
            toggleButtons();        // switch buttons state according to selected option after new location is added
        });

        document.getElementById('deleteButton').addEventListener('click', function (){ // delete
            DeleteValues();     // delete selected value from dropdown
            document.getElementById("content").innerHTML = "";  // clear displayed content images from server on screen
            document.getElementById("data").innerHTML = "";     // clear displayed content data from server on screen
        });

        document.getElementById('Reset').addEventListener('click', function (){ // reset
            ResetList();     // delete selected value from dropdown
            toggleButtons();
            document.getElementById("content").innerHTML = "";  // clear displayed content images from server on screen
            document.getElementById("data").innerHTML = "";     // clear displayed content data from server on screen
        });

        document.getElementById("Displayweather").addEventListener('click', function () { // listens on events of display button
            document.getElementById("content").innerHTML = "";
            document.getElementById("content").innerHTML = "<div class='offset-5'><img src='/images/loadingcircle.gif' alt='cannot display image'></div>";
            document.getElementById("data").innerHTML = "<div class='offset-5'><img src='/images/loadingcircle.gif' alt='cannot display image'></div>";
            const imgPromise = loadImage("http://www.7timer.info/bin/astro.php?%20lon=" + findCoordinates().longitude + "&lat=" + findCoordinates().latitude + "&ac=0&lang=en&unit=metric&output=internal&tzshift=0");
            const imgPromise2 = loadImage("http://www.7timer.info/bin/civillight.php?lon=" + findCoordinates().longitude + "&lat=" + findCoordinates().latitude + "&lang=en&ac=0&unit=metric&output=internal&tzshift=0");

            getData();  // get content from the server

            imgPromise.then(function (img){     // get first image from the server
                document.getElementById("content").innerHTML = "";
            document.getElementById("content").appendChild(img);
            }).catch(function(){                                            // load alternative image if fails to load image from server
                document.getElementById("content").innerHTML = `<img src ='${imgFail}' alt="cannot display image">`;
            });

            imgPromise2.then(function (img){        // get second image from the server
                document.getElementById("content").appendChild(img);
            }).catch(function(){                                            // load alternative image if fails to load image from server
                document.getElementById("content").innerHTML = `<img src ='${imgFail}' alt="cannot display image">`;
            });

        });

        document.querySelector("#data").addEventListener("click", getData);  // get data from server and attach it to html.

        }, false);
})();