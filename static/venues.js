/**
 * Created by Stevens on 08.05.2016.
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

function setVenueDescription(venueName) {
    var findInGoogleUrl = "https://www.google.pl/search?as_q=" + venueName.replace(' ', '+') + "&lr=lang_en&as_sitesearch=wikipedia.org";
    //console.log(findInGoogleUrl);
    var xhr = createCORSRequest('GET', findInGoogleUrl);

    xhr.onload = function () {
        var response = xhr.responseText;
        //console.log(response);
        var wikipediaURLIndex = response.indexOf('en.wikipedia.org/wiki') + 2;
        if (wikipediaURLIndex == -1) {
            wikipediaURLIndex = response.indexOf('.wikipedia.org/wiki');
        }
        var lang = response.substring(wikipediaURLIndex - 2, wikipediaURLIndex);
        // console.log(lang);
        // get url from google page source code
        var URLAndRest = response.substring(wikipediaURLIndex + '.wikipedia.org/wiki'.length + 1, wikipediaURLIndex + 256);
        var TitleEndIndex = URLAndRest.indexOf('"'); // end of URL
        var ArticleTitle = URLAndRest.substring(0, TitleEndIndex);
        console.log(ArticleTitle);

        var wikipediaURL = 'https://' + lang + '.wikipedia.org/api/rest_v1/page/mobile-text/' + ArticleTitle;
        console.log(wikipediaURL);
        $.getJSON(wikipediaURL, function (description) {
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

    setVenueDescription(venueName);
}

$(document).ready(function () {
    var thumbnails = document.getElementsByClassName('thumbnail');
    for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].addEventListener('click', thumbnailClickListener);
    }
});

