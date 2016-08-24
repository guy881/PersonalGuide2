#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import urllib2


def get_food_venues(client_id, client_secret, date, location):
    url = "https://api.foursquare.com/v2/venues/explore?client_id={}&client_secret={}&v={}&{}&section=food&limit=50".format(
        client_id, client_secret, date, location
    )
    venues_text = urllib2.urlopen(url).read()
    venues = json.loads(venues_text)
    venues = venues['response']['groups'][0]['items']
    venues_list = []

    for venue in venues:
        try:
            venues_list.append(venue['venue']['id'])
        except KeyError:
            continue  # skip if something's wrong
    return venues_list
