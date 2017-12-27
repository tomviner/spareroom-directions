// ==UserScript==
// @name         Spareroom Directions to Work
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a Directions to Work button to Spareroom flat listings pages
// @author       Tom V
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        ://*spareroom.co.uk/flatshare/*
// @match        ://*spareroom.com/flatshare/*
// @match        ://*spareroom.co.uk/roommate/*
// @match        ://*spareroom.com/roommate/*
// @match        ://*spareroom.co.uk/rooms-for-rent/*
// @match        ://*spareroom.com/rooms-for-rent/*
// @noframes

// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

(function() {
    'use strict';

    if (typeof(jQuery)  === "undefined"){
        return
    }

    jQuery(function($){
        var map = $('.feature--map');
        if (map.length === 0){
            return
        }

        // Flat coords are written in a script tag as follows:
        //
        // SR.listing.detail.init({
        //   coords: {
        //     lat: '51.4992180788083',
        //     lon: '-0.0817307614796427'
        //   }
        // });
        //
        // Currently we parse this script tag as text, would be better if
        // the coords could be located in the SR data structure directly.
        var script_tag = $('script')
            .filter(
                function(i, e){
                    return $(e).text().indexOf('SR.listing.detail.init({') >= 0;
                }
            ).text()
             .split('coords:')[1].split('})')[0];

        var coords = JSON.parse(
            script_tag
            .replace(/lat/, '"lat"')
            .replace(/lon/, '"lon"')
            .replace(/'/g, '"')
        );

        // https://developers.google.com/maps/documentation/urls/guide#directions-action
        var base = 'https://www.google.com/maps/dir/?api=1&travelmode=transit&';
        // This relies on setting your workplace in your Google Maps account.
        // See https://support.google.com/maps/answer/3093979
        var dest = 'Work';
        var url = `${base}origin=${coords.lat},${coords.lon}&destination=${dest}`;

        map.append('<button id="d2work">Directions to Work</button>');

        $('#d2work').click(function(){
            window.open(url);
        });
    })

})();
/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */
