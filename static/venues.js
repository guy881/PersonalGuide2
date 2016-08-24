/**
 * Created by Stevens on 08.05.2016.
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}

function parseVenueName(name) {
    name.replace(' ', '_');
    return name;
}

function getCorrectWikipediaPage(venueName) {
    var find = "https://www.google.pl/search?as_q=" + venueName.replace(' ', '+') + "&lr=lang_en&as_sitesearch=wikipedia.org";
    console.log(find);
    var xhr = createCORSRequest('GET', find);

    xhr.onload = function () {
        var response = xhr.responseText;
        //console.log(response);
        var wikipediaURLIndex = response.indexOf('.wikipedia.org/wiki');
        var lang = response.substring(wikipediaURLIndex - 2, wikipediaURLIndex);
        // console.log(lang);
        var URLAndRest = response.substring(wikipediaURLIndex + '.wikipedia.org/wiki'.length + 1, wikipediaURLIndex + 100);
        var TitleEndIndex = URLAndRest.indexOf('"');
        var ArticleTitle = URLAndRest.substring(0, TitleEndIndex);
        console.log(ArticleTitle);

        $.getJSON('https://' + lang + '.wikipedia.org/api/rest_v1/page/mobile-text/' + ArticleTitle, function (description) {
            var validDescription = "";
            // console.log(description);
            for (i = 0; i < description['sections'][0]['items'].length; i++) {
                if (description['sections'][0]['items'][i] != undefined && description['sections'][0]['items'][i]['type'] == 'p') {
                    validDescription += description['sections'][0]['items'][i]['text'];
                }
            }
            // console.log(validDescription);
            document.getElementById('venue_description').innerHTML = validDescription;
        });
    };
    xhr.send();
}

function setDescription(venueName) {
    $.getJSON('https://en.wikipedia.org/api/rest_v1/page/mobile-text/' + parseVenueName(venueName), function (description) {

    }).done(function (description) {
        var validDescription = "";
        for (i = 0; i < description['sections'][0]['items'].length; i++) {
            if (description['sections'][0]['items'][i] != undefined && description['sections'][0]['items'][i]['type'] == 'p') {
                validDescription += description['sections'][0]['items'][i]['text'];
            }
        }

        document.getElementById('venue_description').innerHTML = validDescription;

        if (description['title'] == "Not found." || description['description'] == "Wikipedia disambiguation page") {
            getCorrectWikipediaPage(venueName);
        }
    }).fail(function (error) {
        getCorrectWikipediaPage(venueName);
    });
}

function thumbnailClickListener(event) {
    var thumbnail = event.currentTarget;
    var venueNameAndId = thumbnail.getElementsByClassName('venue_name')[0];
    var venueName = venueNameAndId.innerText;
    var venueId = venueNameAndId.id;
    var venuePhoto = thumbnail.getElementsByTagName('img')[0];
    var venueAddress = venueNameAndId.attributes['data_venue_address'].value;
    var venueCategory = venueNameAndId.attributes['data_venue_category'].value;
    var venueDescription;
    //console.log(thumbnail);
    // console.log(venueName);
    // console.log(venueId);
    // console.log(venuePhoto);

    document.getElementById('venue_details_label').innerText = venueName;
    document.getElementById('venue_details_photo').src = venuePhoto.src;
    document.getElementById('venue_details_address').innerText = venueAddress;
    document.getElementById('venue_details_category').innerText = venueCategory;

    setDescription(venueName);
}

$(document).ready(function () {
    var thumbnails = document.getElementsByClassName('thumbnail');
    for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].addEventListener('click', thumbnailClickListener);
    }
});

