/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////------Location.js-------//////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
// 
// Version: 2.1
// Author: Joseph Rogan (joseph.rogan@forces.gc.ca canadajebus@gmail.com)
// 
// 
// This reusable widget allows the user to Goto a map coordinate in MGRS, DD, DMS notation.
// A point graphic can also be placed the input location.
// 
// Location widget example
// var location = new Location({
    // map: mainMap
    // }, "LocationDiv");
// location.startup();
//
// 
// Changes:
// Version 2.1
//  - Added what3words support.  Requires API key and internet access.
// Version 2.0
//  - Major code structure, html template, and css changes.
//  - Removed default field strings.
//  - Combined Lat/Lon DD and DMS tabs.
//  - Added place holder for future UTM tab.
//  - Added constructor options to choose which tabs are shown.
//  - Added feature to fill all fields on map click event
//
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

define([
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin", 
    
    "dijit/layout/ContentPane",
    "dijit/layout/TabContainer",
    
    "dojo/_base/declare",
    "dojo/_base/lang", 
    "dojo/on",
    "require",
    
    "esri/Color",
    "esri/graphic", 
    "esri/request", 
    "esri/SpatialReference",  
    "esri/geometry/Point", 
    "esri/geometry/webMercatorUtils", 
    "esri/symbols/Font", 
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/TextSymbol", 
    
    "./Location/libs/usng",
    
    "dojo/text!./Location/templates/Location.html",
    
    "dojo/domReady!"

], function(_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
    ContentPane, TabContainer, 
    declare, lang, on, require, 
    Color, Graphic, request, SpatialReference, Point, webMercatorUtils, Font, SimpleMarkerSymbol, SimpleLineSymbol, TextSymbol, 
    usng, 
    dijitTemplate)
{
    
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        
        // Set the template .html file
        templateString: dijitTemplate,
        
        // Path to the templates .css file
        css_path: require.toUrl("./Location/css/Location.css"),
        
        
        // The defaults
        defaults: {
            map: null, 
            markerSymbol: SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0,1]), 1), new Color([0,0,0,1])),
            theme: "locationWidget",
            showLatLon: true,
            showMGRS: true,
            showUTM: false,
            showw3w: false,
            w3wAPIKey: ""
        },
        
        
        // Called when the widget is declared as new object
        constructor: function(options) {
            // Mix in the given options with the defaults
            var properties = lang.mixin({}, this.defaults, options);
            this.set(properties);
            
            this.css = {
                tc: "tc",
                tab: "tab",
                label: "label",
                selectLatLonFormat: "selectLatLonFormat", 
                inputMGRS: "inputMGRS",
                inputDD: "inputDD",
                inputDMS: "inputDMS",
                selectHemi: "selectHemi",
                inputw3w: "inputw3w", 
                smallText: "smallText"
            };
            
            
        },
        
        
        // Called after the widget is created
        postCreate: function() {
            this.inherited(arguments);
            
            var _this = this;
            // Wire events to fill the fields on map clicks
            on(this.map, "click", function(evt, $_this)
            {
                // Get the map coordinates in lat/lon
                var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
                
                // If there is a Lat/Lon tab
                if (_this.showLatLon)
                {
                    if (mp.y > 0)
                    {
                        _this.inputLatDD.value = mp.y.toFixed(5);
                        _this.selectLatDDHemi.value = "North";
                        
                        _this.inputLatD.value = Math.floor(mp.y);
                        _this.inputLatM.value = Math.floor((mp.y - Math.floor(mp.y)) * 60);
                        _this.inputLatS.value = Math.round(((mp.y - Math.floor(mp.y) - Math.floor((mp.y - Math.floor(mp.y)) * 60)/60) * 3600) * 10) / 10;
                        _this.selectLatDMSHemi.value = "North";
                    }
                    else
                    {
                        _this.inputLatDD.value = (mp.y.toFixed(5) * -1);
                        _this.selectLatDDHemi.value = "South";
                        
                        _this.inputLatD.value = Math.floor(mp.y * -1);
                        _this.inputLatM.value = Math.floor(((mp.y * -1) - Math.floor((mp.y * -1))) * 60);
                        _this.inputLatS.value = Math.round((((mp.y * -1) - Math.floor((mp.y * -1)) - Math.floor(((mp.y * -1) - Math.floor((mp.y * -1))) * 60)/60) * 3600) * 10) / 10;
                        _this.selectLatDMSHemi.value = "South";
                    }
                    if (mp.x > 0)
                    {
                        _this.inputLonDD.value = mp.x.toFixed(5);
                        _this.selectLonDDHemi.value = "East";
                        
                        _this.inputLonD.value = Math.floor(mp.x);
                        _this.inputLonM.value = Math.floor((mp.x - Math.floor(mp.x)) * 60);
                        _this.inputLonS.value = Math.round(((mp.x - Math.floor(mp.x) - Math.floor((mp.x - Math.floor(mp.x)) * 60)/60) * 3600) * 10) / 10;
                        _this.selectLonDMSHemi.value = "East";
                    }
                    else
                    {
                        _this.inputLonDD.value = (mp.x.toFixed(5) * -1);
                        _this.selectLonDDHemi.value = "West";
                        
                        _this.inputLonD.value = Math.floor(mp.x * -1);
                        _this.inputLonM.value = Math.floor(((mp.x * -1) - Math.floor((mp.x * -1))) * 60);
                        _this.inputLonS.value = Math.round((((mp.x * -1) - Math.floor((mp.x * -1)) - Math.floor(((mp.x * -1) - Math.floor((mp.x * -1))) * 60)/60) * 3600) * 10) / 10;
                        _this.selectLonDMSHemi.value = "West";
                    }
                }
                
                // If there is a MGRS tab
                if (_this.showMGRS)
                {
                    // Get and format MGRS (Polar zones are not supported)
                    var mgrs = usng.LLtoMGRS(mp.y, mp.x, 5);
                    if (mgrs.indexOf("NaN") == -1) mgrs = _this._addSpacesToMGRS(mgrs);
                    else mgrs = "Undetermined";
                    _this.inputMGRS.value = mgrs;
                }
                
                // If there is a UTM tab
                if (_this.showUTM)
                {
                    // Get and format MGRS (Polar zones are not supported)
                    var mgrs = usng.LLtoMGRS(mp.y, mp.x, 5);
                    if (mgrs.indexOf("NaN") == -1) mgrs = _this._addSpacesToMGRS(mgrs);
                    else mgrs = "Undetermined";
                    _this.inputUTM.value = mgrs;
                }
                
                // If there is a w3w tab
                if (_this.showw3w)
                {
                    //Request the w3w
                    var w3wRequest = request({
                        url: "http://api.what3words.com/position", 
                        handleAs: "json",
                        content: {
                            key: _this.w3wAPIKey,
                            lang: "en",
                            position: "'" + mp.y + "," + mp.x + "'"
                        }
                        });
                    // Handle the response
                    w3wRequest.then( function(response){
                        _this.inputw3w.value = response.words[0] + "." + response.words[1] + '.' + response.words[2];
                        });
                }
                
            });
            
            
            // Remove tabs that have had showName set to false
            if (!this.showLatLon) this.tc.removeChild(this.tabLatLon);
            if (!this.showMGRS) this.tc.removeChild(this.tabMGRS);
            if (!this.showUTM) this.tc.removeChild(this.tabUTM);
            if (!this.showw3w) this.tc.removeChild(this.tabw3w);
            
        },
        
        
        
        // Called when the widget resize event is fired (required for layout widgets within template)
        resize: function() {
            this.tc.resize(arguments);
        },
        
        
        // Called when the widget.startup() is used to view the widget
        startup: function() {
            this.inherited(arguments);
        },
        
        // Called when the lat/lon format is changed
        _changeLatLonFormat: function() {
            if (this.selectLatLonFormat.value == "DD")
            {
                this.divDD.style.display = "";
                this.divDMS.style.display = "none";
            }
            else if (this.selectLatLonFormat.value == "DMS")
            {
                this.divDD.style.display = "none";
                this.divDMS.style.display = "";
            }
        },
        
        
        // Called when the Go To button is clicked
        _onGoTo: function() {
            this._onActionPoint("GoTo");
        },
        
        
        // Called when the Add Point button is clicked
        _onAddPoint: function() {
            this._onActionPoint("AddPoint");
        },
        
        
        // Called when an action needs to be performed on a point, either GoTo or AddPoint
        _onActionPoint: function(action) {
            
            // React based on the tab that is selected
            // MGRS tab
            if (this.tc.selectedChildWidget.title == "MGRS")
            {
                // Convert the MGRS back to latlng and set it to the features geometry
                var latlng = [];
                latlong = usng.USNGtoLL(this.inputMGRS.value, latlng);
                
                // Do the action
                if (action == "GoTo") this._goTo(latlng[0], latlng[1]);
                else if (action == "AddPoint") this._addPoint(latlng[0], latlng[1]);
            }
            // UTM tab
            else if (this.tc.selectedChildWidget.title == "UTM")
            {
                // Convert the MGRS back to latlng and set it to the features geometry
                var latlng = [];
                latlong = usng.USNGtoLL(this.inputUTM.value, latlng);
                
                // Do the action
                if (action == "GoTo") this._goTo(latlng[0], latlng[1]);
                else if (action == "AddPoint") this._addPoint(latlng[0], latlng[1]);
            }
            // Lat/Lon tab
            else if (this.tc.selectedChildWidget.title == "Lat/Lon")
            {
                // Format that is select
                if (this.selectLatLonFormat.value == "DD")
                {
                    // Calculate the decimal degrees values
                    var lat = Number(this.inputLatDD.value);
                    if (this.selectLatDDHemi.value == "South") lat *= -1;
                    
                    var lon = Number(this.inputLonDD.value);
                    if (this.selectLonDDHemi.value == "West") lon *= -1;
                    
                    // Do the action
                    if (action == "GoTo") this._goTo(lat, lon);
                    else if (action == "AddPoint") this._addPoint(lat, lon);
                }
                else if (this.selectLatLonFormat.value == "DMS")
                {
                    // Calculate the decimal degrees values
                    var lat = Number(this.inputLatD.value) + (Number(this.inputLatM.value) / 60) + (Number(this.inputLatS.value) / 3600);
                    if (this.selectLatDMSHemi.value == "South") lat *= -1;
                    
                    var lon = Number(this.inputLonD.value) + (Number(this.inputLonM.value) / 60) + (Number(this.inputLonS.value) / 3600);
                    if (this.selectLonDMSHemi.value == "West") lon *= -1;
                    
                    // Do the action
                    if (action == "GoTo") this._goTo(lat, lon);
                    else if (action == "AddPoint") this._addPoint(lat, lon);
                }
            }
            // w3w tab
            else if (this.tc.selectedChildWidget.title == "w3w")
            {
                //Request the w3w
                var w3wRequest = request({
                    url: "http://api.what3words.com/w3w", 
                    handleAs: "json",
                    content: {
                        key: this.w3wAPIKey,
                        lang: "en",
                        string: this.inputw3w.value
                    }
                    });
                // Handle the response
                var _this = this;
                w3wRequest.then( function(response, $action, $_this){
                    // Do the action
                    if (action == "GoTo") _this._goTo(response.position[0], response.position[1]);
                    else if (action == "AddPoint") _this._addPoint(response.position[0], response.position[1]);
                    });
            }
        },
        
        
        // Goes to a lat, lon location
        _goTo: function (lat, lon) {
            // Create a new point, wgs84
            var newPoint = new Point(lon, lat, new SpatialReference({wkid: 4326}));
            
            // Create a feature (Graphic object)
            var newGraphic = new Graphic(newPoint, null, null);
            
            // Center and zoom on the new feature
            this.map.centerAndZoom(newGraphic.geometry, this.map.getMaxZoom() - 2);
        },
        
        
        
        // Add the point to the map
        _addPoint: function (lat, lon) {
            // Text symbol
            // var symbol = new TextSymbol(this.inputMGRS.value).setColor(
                // new Color([0,0,0,1])).setAlign(Font.ALIGN_START).setAngle(0).setDecoration("none").setFont(
                // new Font("12pt").setWeight(Font.WEIGHT_NORMAL).setStyle(Font.STYLE_NORMAL).setFamily("Arial"));
            
                    
            // Add to the map's graphics layer
            this.map.graphics.add(new Graphic(new Point(lon, lat, new SpatialReference({wkid: 4326})), this.markerSymbol));
        },
        
        
        // Clears all graphics
        _onClearGraphic: function () {
            this.map.graphics.clear();
        },
        
        
        // Adds spaces to an mgrs string
        _addSpacesToMGRS: function(mgrs) {
            if (mgrs.length == 14) mgrs = "0" + mgrs;
            return mgrs.substr(0, mgrs.length-12) + " " + mgrs.substr(mgrs.length-12, mgrs.length-13) + " " + mgrs.substr(mgrs.length-10, mgrs.length-10)  + " " + mgrs.substr(mgrs.length-5);
        }
        
    });

});