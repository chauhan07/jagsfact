// Function to make an AJAX request


// single country page 

// this will change when domain chnage 
let pathName = window.location;
console.log(pathName.pathname.split("/")[2]);
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
    console.log(params['country-name'].split("+").join(" "));
    params['country-name'] = params['country-name'].split("+").join(" ")
    var apiUrl = `https://restcountries.com/v3.1/name/${params['country-name']}`;

    makeAjaxRequest(apiUrl, 'GET', function(data) {
        printHTML(data[0])
    });

    function printHTML(countrydata){
        console.log(countrydata);
        document.getElementById("countryTitle").innerText = `${countrydata.name.official} | Jags Fact`
        document.getElementById("countryFlag").setAttribute("src",countrydata.flags.svg)
        document.getElementById("officialName").innerHTML = countrydata.name.official  ; //put coat of arm here
        document.querySelector(".oName img").setAttribute("src",countrydata.coatOfArms.png)

        // native name
        var nativeName = countrydata.name.nativeName;
        var nativeNameList = "";
        for (let x in nativeName) {
            if(x != "eng"){
                console.log(nativeName[x].official);
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

    }
    // add comma to a bigger numbers
    function addCommas(number) {
        let numberString = number.toString();
        numberString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return numberString;
    }
    
}
