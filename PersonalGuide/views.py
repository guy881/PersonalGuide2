#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json, datetime, urllib2
from django.http import HttpResponse
from django.shortcuts import render
from venues import get_food_venues
# current date
from django.template import Context

today = datetime.datetime.now()
today_date = str(today.strftime("%Y%m%d"))
# client data
client_id = "CXHY5LCAK45SPQMENVNXV11MJUQD50MJH4HT2OYI1MFLOPVX"
client_secret = "XUXPEY3DFLLG2E0P4VSLJ4E43ITUSKUVINWHTHKGC5JIPNQM"


def index(request):  # Post and get
    if request.method == 'GET':
        return render(request, 'index.html')
    if request.method == 'POST':
        city = request.form.get("city")
        if city == "":  # for now
            city = "Warsaw"
        return HttpResponse(city)  # later


def venues_foursquare(request):
    print request.GET
    if 'll' in request.GET:  # get postiton by lat and long
        ll = request.GET['ll']
        location = 'll=' + str(ll)
    elif 'near' in request.GET:
        near = request.GET['near']
        location = 'near=' + str(near)
    else:
        return HttpResponse("You have to specify ll (coordinates) or near")

    if 'query' in request.GET:
        query = request.GET['query']
    else:
        query = ""
    url = "https://api.foursquare.com/v2/venues/search?client_id={}&client_secret={}&v={}&{}&query={}".format(
        client_id, client_secret, today_date, location, query
    )
    venues_text = urllib2.urlopen(url).read()
    venues = json.loads(venues_text)
    return HttpResponse(venues_text)


def popular_venues_foursquare(request):
    if 'll' in request.GET:
        location = 'll=' + str(request.GET['ll'])
    elif 'near' in request.GET:
        location = 'near=' + str(request.GET['near'])
    else:
        return HttpResponse("You have to specify ll (coordinates) or near parameter")

    url = "https://api.foursquare.com/v2/venues/explore?client_id={}&client_secret={}&v={}&{}&section=sights&venuePhotos={}".format(
        client_id, client_secret, today_date, location, 1
    )
    print "url popular: " + url
    venues_text = urllib2.urlopen(url).read()
    venues = json.loads(venues_text)
    venues = venues['response']['groups'][0]['items']

    if 'map' in request.GET:
        venues_for_map = []
        for venue in venues:
            venues_for_map.append({'name': venue['venue']['name'], 'lat': venue['venue']['location']['lat'],
                                   'lng': venue['venue']['location']['lng']})
        return HttpResponse(json.dumps(venues_for_map))
    return HttpResponse(json.dumps(venues))


def venues_map(request):  # probably will be refactored
    if 'city' in request.GET:
        city = request.GET['city']
        context = {
            'city': city
        }
    return render(request, 'venues_map.html', context)


def venues(request):
    if 'city' in request.GET:
        # check if it exists in foursquare
        location = 'near=' + str(request.GET['city'])
        url = "https://api.foursquare.com/v2/venues/explore?client_id={}&client_secret={}&v={}&{}&section=sights&venuePhotos={}&limit=50".format(
            client_id, client_secret, today_date, location, 1
        )
        print "url popular: " + url
        venues_text = urllib2.urlopen(url).read()
        venues = json.loads(venues_text)
        venues = venues['response']['groups'][0]['items']
        venues_list = []
        venues_food = get_food_venues(client_id, client_secret, today_date, location)

        for venue in venues:
            # if(venue['venue']['id'] in venues_food):
            #   continue

            if ('food' in str(venue['venue']['categories'][0]['icon']['prefix'])):
                continue
            if ('nightlife' in str(venue['venue']['categories'][0]['icon']['prefix'])):
                    continue
            try:
                photos = venue['venue']['photos']['groups'][0]['items'][0]
                photo = photos['prefix'] + 'width' + str(photos['width']) + photos['suffix']
            except IndexError:
                photo = ""

            formatted_address = ""
            for line in venue['venue']['location']['formattedAddress']:
                formatted_address += line + ', '
            try:
                venues_list.append({
                    'name': venue['venue']['name'],
                    'id': venue['venue']['id'],
                    'rating': venue['venue']['rating'],
                    'photo': photo,
                    'address': formatted_address,
                    'category': venue['venue']['categories'][0]['name'],
                })
            except KeyError:
                continue

        print venues_list

        context = {
            'city': request.GET['city'],
            'venues': venues_list,
        }
        return render(request, 'venues.html', context)
    else:
        return HttpResponse("Incorrect parameters, you must specify near or ll.")


def venues_foursquare_details(self, venue_id):
    url = "https://api.foursquare.com/v2/venues/" + venue_id + "?client_id={}&client_secret={}&v={}".format(
        client_id, client_secret, today_date,
    )
    print url
    venues_details_text = urllib2.urlopen(url).read()
    venues = json.loads(venues_details_text)
    print venues
    return HttpResponse(json.dumps(venues))
