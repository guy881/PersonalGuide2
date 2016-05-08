/**
 * Created by Stevens on 08.05.2016.
 */

function thumbnailClickListener(event) {
    var thumbnail = event.currentTarget;
    var venueNameAndId = thumbnail.getElementsByClassName('venue_name')[0];
    var venueName = venueNameAndId.innerText;
    var venueId = venueNameAndId.id;
    var venuePhoto = thumbnail.getElementsByTagName('img')[0];
    console.log(thumbnail);
    console.log(venueName);
    console.log(venueId);
    console.log(venuePhoto);
}

$(document).ready(function () {
    var thumbnails = document.getElementsByClassName('thumbnail');
    for(var i = 0; i < thumbnails.length; i++){
        thumbnails[i].addEventListener('click', thumbnailClickListener);
    }
});

