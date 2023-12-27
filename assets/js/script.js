// Function to make an AJAX request


// single country page 

// this will change when domain chnage 
let pathName = window.location;
let pageName = pathName.pathname.split("/")[2].split(".");
// console.log(pageName);


if(pageName[0] == "countries"){
    var cListHTML = '';
    var listCount = 15;
    var startCount = 0;

    function makeAjaxRequest(url, method, callback) {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };

        xhr.open(method, url, true);
        xhr.send();
    }

    // Example: Making an AJAX GET request
    var apiUrl = 'https://restcountries.com/v3.1/all';

    makeAjaxRequest(apiUrl, 'GET', function(data) {
        printHTML(data)
    });


    function printHTML(data) {
        // Handle the data received from the server
        // console.log(data);
        for (var i = startCount; i < listCount; i++) {
            if (i == data.length) {
                document.getElementById("load_more").style.display = "none";
                break;
            }
            cListHTML += `
                <div class="country_box">
                    <div class="inner">
                        <figure>
                            <img src="${data[i].flags.png}" alt="">
                        </figure>
                        <div class="cntnt_box">
                            <h4 class="region">
                                ${data[i].subregion}
                            </h4>
                            <h3 class="c_name">
                                ${data[i].name.common}
                            </h3>
                            <h4 class="cap_name">`
            if (data[i].capital != undefined) {
                cListHTML += ` Capital : ${data[i].capital[0]}`;
            } else {
                cListHTML += ``;
            }
            cListHTML += `</h4>
                        </div>
                        <a href="./explore-country.htm?country-name=${data[i].name.official}" data-cname="${data[i].name.official}"></a>
                    </div>
                </div>
                `
        }

        var listHtml = "";
        data.forEach(element => {
            // console.log(element.name.official);
            listHtml += `<option value="${element.name.official}">${element.name.official}</option>`;
        });
        document.getElementById("countries_list").innerHTML = cListHTML;
        document.getElementById("countryNameList").innerHTML = listHtml;
    }

    // Load More 
    document.getElementById("load_more").addEventListener("click", function() {
        makeAjaxRequest(apiUrl, 'GET', function(data) {
            printHTML(data);
        });
        listCount = listCount + 15;
        startCount = startCount + 15;
    })

    // tabs code 
    var tabsBtn = document.querySelectorAll(".tabsCntnt li");
    tabsBtn.forEach(element => {
        element.addEventListener("click", function() {
            tabsBtn.forEach(tab => {
                tab.classList.remove("active");
            });
            this.classList.add("active");
            cListHTML = '';
            if (this.dataset.region != 'all') {
                document.getElementById("load_more").style.display = "none";
                apiUrl = `https://restcountries.com/v3.1/region/${this.dataset.region}`;
                makeAjaxRequest(apiUrl, 'GET', function(data) {
                    listCount = data.length;
                    startCount = 0;
                    printHTML(data)
                });
            } else {
                document.getElementById("load_more").style.display = "block";
                apiUrl = 'https://restcountries.com/v3.1/all';
                makeAjaxRequest(apiUrl, 'GET', function(data) {
                    listCount = 15;
                    startCount = 0;
                    printHTML(data)
                });
            }
        })
    });

    $("#countryNameList").select2({
        placeholder: "Search Country Name",
        allowClear: true
    });
}

if(pageName[0] == "explore-country"){
    if(pathName.search != ""){
        queryString = pathName.search.slice(1);
        // Split the query string into an array of key-value pairs
        var queryParams = queryString.split('&');
    
        var params = {};
        for (var i = 0; i < queryParams.length; i++) {
            var pair = queryParams[i].split('=');
            var key = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1] || '');
            params[key] = value;
        }
    
        // get search country usin fetch api
        function makeAjaxRequest(url, method, callback) {
            var xhr = new XMLHttpRequest();
    
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    callback(JSON.parse(xhr.responseText));
                }
            };
    
            xhr.open(method, url, true);
            xhr.send();
        }
        
        // Example: Making an AJAX GET request
        // console.log(params['country-name'].split("+").join(" "));
        params['country-name'] = params['country-name'].split("+").join(" ")
        var apiUrl = `https://restcountries.com/v3.1/name/${params['country-name']}`;
    
        makeAjaxRequest(apiUrl, 'GET', function(data) {
            printHTML(data[0])
        });
    
        function printHTML(countrydata){
            // console.log(countrydata);
            document.getElementById("countryTitle").innerText = `${countrydata.name.official} | Jags Fact`
            document.getElementById("countryFlag").setAttribute("src",countrydata.flags.svg)
            document.getElementById("officialName").innerHTML = countrydata.name.official  ; //put coat of arm here
            document.querySelector(".oName img").setAttribute("src",countrydata.coatOfArms.png)
    
            // native name
            var nativeName = countrydata.name.nativeName;
            var nativeNameList = "";
            for (let x in nativeName) {
                if(x != "eng"){
                    // console.log(nativeName[x].official);
                    nativeNameList += `<i>${nativeName[x].official}</i>`;
                }
            }
            document.getElementById("nativeNames").innerHTML = nativeNameList;
            document.getElementById("commonName").innerText = countrydata.name.common;
            document.getElementById("capitalName").innerText = countrydata.capital[0];
            document.getElementById("contientName").innerText = countrydata.continents[0];
    
            // maps
            var mapsHref = document.querySelectorAll(".mapsHdng a");
            mapsHref[0].setAttribute("href", countrydata.maps.googleMaps);
            mapsHref[1].setAttribute("href", countrydata.maps.openStreetMaps);
    
            // other information
            let popinCommas = addCommas(countrydata.population);
            document.getElementById("population").innerText = popinCommas;
            let areainCommas = addCommas(countrydata.area);
            document.getElementById("area").innerHTML = areainCommas + " km<sup>2</sup>";
            document.getElementById("idd").innerText = countrydata.idd.root + countrydata.idd.suffixes[0];
            document.getElementById("tld").innerText = countrydata.tld;
    
            // is un member 
            if(countrydata.unMember == true){
                document.getElementById("unMember").innerHTML = "<i class='info'>yes</i>";
            } else{
                document.getElementById("unMember").innerHTML = "<i class='warning'>no</i>";
            }
    
            // currency 
            let currHTML = "";
            let currList = countrydata.currencies;
            for (let x in currList) {
                currHTML += `<i class="currname">${currList[x].name}</i>`
            }
    
            document.getElementById("curr").innerHTML = currHTML;
            document.getElementById("carSide").innerText = countrydata.car.side;
            document.getElementById("startOfWeek").innerText = countrydata.startOfWeek;
            

            // creeating object for mapTiler
            var dataShowOnMap = {
                "cName" : countrydata.name.common,
                "cCapital" : countrydata.capital[0],
                "cPopulation" : countrydata.population,
                "cArea" : countrydata.area,
                "cLng" : countrydata.latlng[1],
                "cLat" : countrydata.latlng[0]
            }
            // call function to display map in popup
            mapTilerCountries(dataShowOnMap);
    
        }
        // add comma to a bigger numbers
        function addCommas(number) {
            let numberString = number.toString();
            numberString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return numberString;
        }
    } else{
        window.location.href = "./countries.htm";
    }


    // check if search contry is availabe in mapTiler
    function mapTilerCountries(countrydataObj){
        var countriesData = [
            { mId: 20, cName: "Andorra" },
            { mId: 784, cName: "United Arab Emirates" },
            { mId: 4, cName: "Afghanistan" },
            { mId: 28, cName: "Antigua and Barbuda" },
            { mId: 660, cName: "Anguilla" },
            { mId: 8, cName: "Albania" },
            { mId: 51, cName: "Armenia" },
            { mId: 24, cName: "Angola" },
            { mId: 10, cName: "Antarctica" },
            { mId: 32, cName: "Argentina" },
            { mId: 16, cName: "American Samoa" },
            { mId: 40, cName: "Austria" },
            { mId: 36, cName: "Ashmore & Cartier Islands" },
            { mId: 36, cName: "Australia" },
            { mId: 36, cName: "Australian Indian Ocean Territories" },
            { mId: 36, cName: "Coral Sea Islands" },
            { mId: 533, cName: "Aruba" },
            { mId: 31, cName: "Azerbaijan" },
            { mId: 70, cName: "Bosnia and Herzegovina" },
            { mId: 52, cName: "Barbados" },
            { mId: 50, cName: "Bangladesh" },
            { mId: 56, cName: "Belgium" },
            { mId: 854, cName: "Burkina Faso" },
            { mId: 100, cName: "Bulgaria" },
            { mId: 48, cName: "Bahrain" },
            { mId: 108, cName: "Burundi" },
            { mId: 204, cName: "Benin" },
            { mId: 652, cName: "Saint BarthÃ©lemy" },
            { mId: 60, cName: "Bermuda" },
            { mId: 96, cName: "Brunei" },
            { mId: 68, cName: "Bolivia" },
            { mId: 535, cName: "Bonaire" },
            { mId: 76, cName: "Brazil" },
            { mId: 44, cName: "The Bahamas" },
            { mId: 64, cName: "Bhutan" },
            { mId: 74, cName: "Bouvet Island" },
            { mId: 72, cName: "Botswana" },
            { mId: 112, cName: "Belarus" },
            { mId: 84, cName: "Belize" },
            { mId: 124, cName: "Canada" },
            { mId: 166, cName: "Cocos (Keeling) Islands" },
            { mId: 180, cName: "Democratic Republic of the Congo" },
            { mId: 140, cName: "Central African Republic" },
            { mId: 178, cName: "Republic of the Congo" },
            { mId: 756, cName: "Switzerland" },
            { mId: 384, cName: "Ivory Coast" },
            { mId: 184, cName: "Cook Islands" },
            { mId: 152, cName: "Chile" },
            { mId: 120, cName: "Cameroon" },
            { mId: 156, cName: "China" },
            { mId: 170, cName: "Colombia" },
            { mId: 188, cName: "Costa Rica" },
            { mId: 192, cName: "Cuba" },
            { mId: 132, cName: "Cabo Verde" },
            { mId: 531, cName: "CuraÃ§ao" },
            { mId: 196, cName: "Cyprus" },
            { mId: 203, cName: "Czechia" },
            { mId: 276, cName: "Germany" },
            { mId: 262, cName: "Djibouti" },
            { mId: 208, cName: "Denmark" },
            { mId: 212, cName: "Dominica" },
            { mId: 214, cName: "Dominican Republic" },
            { mId: 12, cName: "Algeria" },
            { mId: 218, cName: "Ecuador" },
            { mId: 233, cName: "Estonia" },
            { mId: 818, cName: "Egypt" },
            { mId: 732, cName: "Western Sahara" },
            { mId: 232, cName: "Eritrea" },
            { mId: 724, cName: "Canary Islands" },
            { mId: 724, cName: "Spain" },
            { mId: 231, cName: "Ethiopia" },
            { mId: 246, cName: "Finland" },
            { mId: 242, cName: "Fiji" },
            { mId: 238, cName: "Falkland Islands" },
            { mId: 583, cName: "Federated States of Micronesia" },
            { mId: 234, cName: "Faroe Islands" },
            { mId: 250, cName: "Clipperton Island" },
            { mId: 250, cName: "France" },
            { mId: 266, cName: "Gabon" },
            { mId: 917, cName: "Akrotiri" },
            { mId: 919, cName: "Dhekelia" },
            { mId: 826, cName: "United Kingdom" },
            { mId: 308, cName: "Grenada" },
            { mId: 268, cName: "Georgia" },
            { mId: 254, cName: "French Guiana" },
            { mId: 831, cName: "Guernsey" },
            { mId: 288, cName: "Ghana" },
            { mId: 292, cName: "Gibraltar" },
            { mId: 304, cName: "Greenland" },
            { mId: 270, cName: "Gambia" },
            { mId: 324, cName: "Guinea" },
            { mId: 312, cName: "Guadeloupe" },
            { mId: 226, cName: "Equatorial Guinea" },
            { mId: 300, cName: "Greece" },
            { mId: 239, cName: "South Georgia and the South Sandwich Islands" },
            { mId: 320, cName: "Guatemala" },
            { mId: 316, cName: "Guam" },
            { mId: 624, cName: "Guinea-Bissau" },
            { mId: 328, cName: "Guyana" },
            { mId: 344, cName: "Hong Kong" },
            { mId: 334, cName: "Heard Island and McDonald Islands" },
            { mId: 340, cName: "Honduras" },
            { mId: 191, cName: "Croatia" },
            { mId: 332, cName: "Haiti" },
            { mId: 348, cName: "Hungary" },
            { mId: 360, cName: "Indonesia" },
            { mId: 372, cName: "Ireland" },
            { mId: 376, cName: "Israel" },
            { mId: 833, cName: "Isle of Man" },
            { mId: 356, cName: "India" },
            { mId: 86, cName: "British Indian Ocean Territory" },
            { mId: 368, cName: "Iraq" },
            { mId: 364, cName: "Iran" },
            { mId: 352, cName: "Iceland" },
            { mId: 380, cName: "Italy" },
            { mId: 832, cName: "Jersey" },
            { mId: 388, cName: "Jamaica" },
            { mId: 400, cName: "Jordan" },
            { mId: 392, cName: "Japan" },
            { mId: 404, cName: "Kenya" },
            { mId: 417, cName: "Kyrgyzstan" },
            { mId: 116, cName: "Cambodia" },
            { mId: 296, cName: "Kiribati" },
            { mId: 174, cName: "Comoros" },
            { mId: 659, cName: "Saint Kitts and Nevis" },
            { mId: 408, cName: "North Korea" },
            { mId: 410, cName: "South Korea" },
            { mId: 414, cName: "Kuwait" },
            { mId: 136, cName: "Cayman Islands" },
            { mId: 398, cName: "Kazakhstan" },
            { mId: 418, cName: "Laos" },
            { mId: 422, cName: "Lebanon" },
            { mId: 662, cName: "Saint Lucia" },
            { mId: 438, cName: "Liechtenstein" },
            { mId: 144, cName: "Sri Lanka" },
            { mId: 430, cName: "Liberia" },
            { mId: 426, cName: "Lesotho" },
            { mId: 440, cName: "Lithuania" },
            { mId: 442, cName: "Luxembourg" },
            { mId: 428, cName: "Latvia" },
            { mId: 434, cName: "Libya" },
            { mId: 504, cName: "Morocco" },
            { mId: 492, cName: "Monaco" },
            { mId: 498, cName: "Moldova" },
            { mId: 499, cName: "Montenegro" },
            { mId: 663, cName: "Saint Martin" },
            { mId: 450, cName: "Madagascar" },
            { mId: 584, cName: "Marshall Islands" },
            { mId: 807, cName: "North Macedonia" },
            { mId: 466, cName: "Mali" },
            { mId: 104, cName: "Myanmar" },
            { mId: 496, cName: "Mongolia" },
            { mId: 446, cName: "Macau" },
            { mId: 580, cName: "Northern Mariana Islands" },
            { mId: 474, cName: "Martinique" },
            { mId: 478, cName: "Mauritania" },
            { mId: 500, cName: "Montserrat" },
            { mId: 470, cName: "Malta" },
            { mId: 480, cName: "Mauritius" },
            { mId: 462, cName: "Maldives" },
            { mId: 454, cName: "Malawi" },
            { mId: 484, cName: "Mexico" },
            { mId: 458, cName: "Malaysia" },
            { mId: 508, cName: "Mozambique" },
            { mId: 516, cName: "Namibia" },
            { mId: 540, cName: "New Caledonia" },
            { mId: 562, cName: "Niger" },
            { mId: 574, cName: "Norfolk Island" },
            { mId: 566, cName: "Nigeria" },
            { mId: 558, cName: "Nicaragua" },
            { mId: 528, cName: "Netherlands" },
            { mId: 744, cName: "Jan Mayen" },
            { mId: 578, cName: "Norway" },
            { mId: 744, cName: "Svalbard" },
            { mId: 524, cName: "Nepal" },
            { mId: 520, cName: "Nauru" },
            { mId: 570, cName: "Niue" },
            { mId: 554, cName: "New Zealand" },
            { mId: 512, cName: "Oman" },
            { mId: 591, cName: "Panama" },
            { mId: 604, cName: "Peru" },
            { mId: 258, cName: "French Polynesia" },
            { mId: 598, cName: "Papua New Guinea" },
            { mId: 608, cName: "Philippines" },
            { mId: 586, cName: "Pakistan" },
            { mId: 616, cName: "Poland" },
            { mId: 666, cName: "Saint Pierre and Miquelon" },
            { mId: 612, cName: "Pitcairn Islands" },
            { mId: 630, cName: "Puerto Rico" },
            { mId: 620, cName: "Azores" },
            { mId: 620, cName: "Madeira" },
            { mId: 620, cName: "Portugal" },
            { mId: 585, cName: "Palau" },
            { mId: 600, cName: "Paraguay" },
            { mId: 634, cName: "Qatar" },
            { mId: 638, cName: "RÃ©union" },
            { mId: 642, cName: "Romania" },
            { mId: 688, cName: "Serbia" },
            { mId: 643, cName: "Russia" },
            { mId: 646, cName: "Rwanda" },
            { mId: 682, cName: "Sanafir & Tiran Islands" },
            { mId: 682, cName: "Saudi Arabia" },
            { mId: 90, cName: "Solomon Islands" },
            { mId: 690, cName: "Seychelles" },
            { mId: 729, cName: "Sudan" },
            { mId: 752, cName: "Sweden" },
            { mId: 702, cName: "Singapore" },
            { mId: 654, cName: "Saint Helena" },
            { mId: 705, cName: "Slovenia" },
            { mId: 703, cName: "Slovakia" },
            { mId: 694, cName: "Sierra Leone" },
            { mId: 674, cName: "San Marino" },
            { mId: 686, cName: "Senegal" },
            { mId: 706, cName: "Somalia" },
            { mId: 740, cName: "Suriname" },
            { mId: 728, cName: "South Sudan" },
            { mId: 678, cName: "São Tomé and Príncipe" },
            { mId: 222, cName: "El Salvador" },
            { mId: 534, cName: "Sint Maarten" },
            { mId: 760, cName: "Syria" },
            { mId: 748, cName: "eSwatini" },
            { mId: 796, cName: "Turks and Caicos Islands" },
            { mId: 148, cName: "Chad" },
            { mId: 260, cName: "French Southern and Antarctic Lands" },
            { mId: 768, cName: "Togo" },
            { mId: 764, cName: "Thailand" },
            { mId: 762, cName: "Tajikistan" },
            { mId: 772, cName: "Tokelau" },
            { mId: 626, cName: "East Timor" },
            { mId: 795, cName: "Turkmenistan" },
            { mId: 788, cName: "Tunisia" },
            { mId: 776, cName: "Tonga" },
            { mId: 792, cName: "Turkey" },
            { mId: 780, cName: "Trinidad and Tobago" },
            { mId: 798, cName: "Tuvalu" },
            { mId: 158, cName: "Taiwan" },
            { mId: 834, cName: "Tanzania" },
            { mId: 804, cName: "Ukraine" },
            { mId: 800, cName: "Uganda" },
            { mId: 581, cName: "Navassa Island" },
            { mId: 581, cName: "United States Minor Outlying Islands" },
            { mId: 840, cName: "United States" },
            { mId: 840, cName: "Wake Island" },
            { mId: 858, cName: "Uruguay" },
            { mId: 860, cName: "Uzbekistan" },
            { mId: 336, cName: "Vatican" },
            { mId: 670, cName: "Saint Vincent and the Grenadines" },
            { mId: 862, cName: "Venezuela" },
            { mId: 92, cName: "British Virgin Islands" },
            { mId: 850, cName: "United States Virgin Islands" },
            { mId: 704, cName: "Vietnam" },
            { mId: 548, cName: "Vanuatu" },
            { mId: 876, cName: "Wallis and Futuna" },
            { mId: 882, cName: "Samoa" },
            { mId: 724, cName: "Ceuta" },
            { mId: 910, cName: "Kosovo" },
            { mId: 887, cName: "Yemen" },
            { mId: 175, cName: "Mayotte" },
            { mId: 710, cName: "South Africa" },
            { mId: 894, cName: "Zambia" },
            { mId: 716, cName: "Zimbabwe" },
            { mId: 901, cName: "Abyei" },
            { mId: 902, cName: "Aksai Chin" },
            { mId: -99, cName: "Brazilian Island" },
            { mId: 903, cName: "China–India border" },
            { mId: 905, cName: "Croatia–Slovenia border disputes" },
            { mId: 904, cName: "Demchok sector" },
            { mId: 906, cName: "Dramana-Shakatoe" },
            { mId: 907, cName: "Gaza Strip" },
            { mId: 909, cName: "Kalapani" },
            { mId: 911, cName: "Koalou" },
            { mId: 912, cName: "Liancourt Rocks" },
            { mId: 913, cName: "No man's land" },
            { mId: 914, cName: "Paracel Islands" },
            { mId: 915, cName: "Senkaku Islands" },
            { mId: 920, cName: "Siachen Glacier" },
            { mId: 916, cName: "Spratly Islands" },
            { mId: 921, cName: "West Bank" }
          ];
        var isFound = false;
        for (let index = 0; index < countriesData.length; index++) {
            const element = countriesData[index];
            if(element.cName == countrydataObj.cName){
                // console.log("Yipee I Found this Country");
                isFound = true;
                mapTilerId = element.mId;
                break;
            }
        }

        // if search country found in maptiler data the this condition will execute
        if(isFound){
            createTileMap(mapTilerId,countrydataObj);
        }
    }

    // create map tiler map
    function createTileMap(mId,cdo){
        document.getElementById("showMapPoup").style.display = "block";
        document.getElementById("showMapPoup").addEventListener("click",function(){
            document.querySelector(".map_modal").classList.add("show");
        })
        document.querySelector(".map_modal").addEventListener("click",function(event){
            console.log(event.target.getAttribute("class"));
            if(event.target.getAttribute("class") == "map_modal show"){
                document.querySelector(".map_modal").classList.remove("show");
            }
        })

        // india,china,us,china,australia,brazil,canada
        let zoomSize;
        if(mId == 156 || mId == 840 || mId == 643 || mId == 36 || mId == 124 || mId == 124 || mId == 304){
            zoomSize = 2;
        } else if(mId == 356 || mId == 76 || mId == 32 || mId == 152){
            zoomSize = 3
        } else{
            zoomSize = 4
        }

        const vizData = { 
            "id":mId,
            "name":"India",
            "population":cdo.cPopulation,
            "area":cdo.cArea,
            "capital":cdo.cCapital,
            "lat":cdo.cLat,
            "lng":cdo.cLng,
        };
        
        function setStates() {
          const countries = map.querySourceFeatures('statesData', {
            sourceLayer: 'administrative',
            // filter: ['all', ['==', 'level', 0]],
          });
          countries.forEach(country => {
            if(country.id == mId) {
              map.setFeatureState({
                source: 'statesData',
                sourceLayer: 'administrative',
                id: country.id
              }, {
                population: vizData.population,
                area: vizData.area,
                capital: vizData.capital,
              });
            }
          });
          if (countries.length !== 0) {
            map.off('data', afterLoad);
          }
        }
        
        function afterLoad() {
          if (map.getSource('statesData') && map.isSourceLoaded('statesData')) {
            setStates();
          }
        }
        maptilersdk.config.apiKey = 'a1BqKgyELkA2HWkXus3s';
        const map = new maptilersdk.Map({
          container: 'map', // container's id or the HTML element to render the map
          style: maptilersdk.MapStyle.DATAVIZ.LIGHT,
          center: [vizData.lng, vizData.lat], // starting position [lng, lat]
          zoom: zoomSize, // starting zoom
        });
        map.on('load', function() {
          map.addSource('statesData', {
            type: 'vector',
            url: `https://api.maptiler.com/tiles/countries/tiles.json?key=a1BqKgyELkA2HWkXus3s`
          });
  
          // Find the id of the first symbol layer in the map style
          const layers = map.getStyle().layers;
          let firstSymbolId;
          for (let i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol') {
              firstSymbolId = layers[i].id;
              break;
            }
          }
  
          map.addLayer(
            {
              'id': 'countries',
              'source': 'statesData',
              'source-layer': 'administrative',
              'type': 'fill',
              'filter': ['==', 'level', 0],
              'paint': {
                  'fill-color': ['case', ['!=', ['to-number', ['feature-state', 'population']], 0], ['interpolate', ['linear'], ['feature-state', 'population'], 5000000, 'rgba(171,126,91,1)', 90000000, 'rgba(0,0,0,1)'],'rgba(0, 0, 0, 0)'],
                  // 'fill-opacity': 1
              }
            },
            firstSymbolId
          );
        });
        map.on('data', afterLoad);
        map.on('click', 'countries', function (e) {
          new maptilersdk.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <div class="infoBoxOnMap">
                    <ul>
                        <li>
                            Population
                        </li>
                        <li>
                            ${e.features[0].state.population.toLocaleString()}
                        </li>
                        <li>
                            Area
                        </li>
                        <li>
                            ${e.features[0].state.area.toLocaleString()}
                        </li>
                        <li>
                            Capital
                        </li>
                        <li>
                            ${e.features[0].state.capital.toLocaleString()}
                        </li>
                    </ul>
                </div>
            `)
            .addTo(map);
        });
        // Change the cursor to a pointer when the mouse is over the layer.
        map.on('mouseenter', 'countries', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
  
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'countries', function () {
            map.getCanvas().style.cursor = '';
        });
    }
}
