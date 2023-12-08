// Function to make an AJAX request

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
//     console.log(data);
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
                    <a href="#"></a>
                </div>
            </div>
            `
    }
    document.getElementById("countries_list").innerHTML = cListHTML;
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
        this.classList.add("active")
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