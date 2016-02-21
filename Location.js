/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////------Location.js-------//////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
// 
// Version: 1.0
// Author: Joseph Rogan (joseph.rogan@forces.gc.ca canadajebus@gmail.com)
// 
// 
// This reusable widget allows the user to Goto a map coordinate in MGRS, DD, DMS notation.
// A point graphic can also be placed the input location.
// 
// Location widget example
// var location = new Location({
    // map: mainMap,
    // defaultMGRS: "18T VR 45339 30260",
    // defaultDD: {lat: "45.42372", latHemi: "North", lon: "75.69870", lonHemi: "West"},
    // defaultDMS: {latD: "45", latM: "25", latS: "25.4", latHemi: "North", lonD: "75", lonM: "41", lonS: "55.3", lonHemi: "West"}
    // }, "LocationDiv");
// location.startup();
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
    "esri/SpatialReference",  
    "esri/geometry/Point", 
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
    Color, Graphic, SpatialReference, Point, Font, SimpleMarkerSymbol, SimpleLineSymbol, TextSymbol, 
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
            theme: "locationWidget",
            defaultMGRS: "",
            defaultDD: {lat: "", latHemi: "North", lon: "", lonHemi: "West"},
            defaultDMS: {latD: "", latM: "", latS: "", latHemi: "North", lonD: "", lonM: "", lonS: "", lonHemi: "West"}
        },
        
        
        // Called when the widget is declared as new object
        constructor: function(options) {
            // Mix in the given options with the defaults
            var properties = lang.mixin({}, this.defaults, options);
            this.set(properties);
            
            this.css = {
                tc: "tc",
                label: "label",
                inputFieldMGRS: "inputFieldMGRS",
                inputFieldDD: "inputFieldDD",
                inputFieldDMS: "inputFieldDMS",
                selectHemi: "selectHemi",
                smallText: "smallText"
            };
            
            
        },
        
        
        // Called after the widget is created
        postCreate: function() {
            this.inherited(arguments);
            
            // Set the default values
            this.locationMGRS.value = this.defaultMGRS;
            this.locationLatDD.value = this.defaultDD.lat;
            this.locationLatDDHemi.value = this.defaultDD.latHemi;
            this.locationLonDD.value = this.defaultDD.lon;
            this.locationLonDDHemi.value = this.defaultDD.lonHemi;
            this.locationLatD.value = this.defaultDMS.latD;
            this.locationLatM.value = this.defaultDMS.latM;
            this.locationLatS.value = this.defaultDMS.latS;
            this.locationLatDMSHemi.value = this.defaultDMS.latHemi;
            this.locationLonD.value = this.defaultDMS.lonD;
            this.locationLonM.value = this.defaultDMS.lonM;
            this.locationLonS.value = this.defaultDMS.lonS;
            this.locationLonDMSHemi.value = this.defaultDMS.lonHemi;
            
        },
        
        // Called when the widget resize event is fired (required for layout widgets within template)
        resize: function() {
            this.LocationTabContainer.resize(arguments);
        },
        
        
        // Called when the widget.startup() is used to view the widget
        startup: function() {
            this.inherited(arguments);
        },
        
        
        // Pans and centers to MGRS coordinate
        _onGoToMGRS: function() {
            // Convert the MGRS back to latlng and set it to the features geometry
            var latlng = [];
            latlong = usng.USNGtoLL(this.locationMGRS.value, latlng);
            
            // Go to the location
            this._goTo(latlng[0], latlng[1]);
        },
        
        
        // Pans and centers to DD coordinate
        _onGoToDD: function () {
            // Calculate the decimal degrees values
            var lat = Number(this.locationLatDD.value);
            if (this.locationLatDDHemi.value == "South") lat *= -1;
            
            var lon = Number(this.locationLonDD.value);
            if (this.locationLonDDHemi.value == "West") lon *= -1;
            
            // Go to the location
            this._goTo(lat, lon);
        },
        
        
        // Pans and centers to DMS coordinate
        _onGoToDMS: function () {
            // Calculate the decimal degrees values
            var lat = Number(this.locationLatD.value) + (Number(this.locationLatM.value) / 60) + (Number(this.locationLatS.value) / 3600);
            if (this.locationLatDMSHemi.value == "South") lat *= -1;
            
            var lon = Number(this.locationLonD.value) + (Number(this.locationLonM.value) / 60) + (Number(this.locationLonS.value) / 3600);
            if (this.locationLonDMSHemi.value == "West") lon *= -1;
            
            // Go to the location
            this._goTo(lat, lon);
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
        
        
        // Creates a graphic at the MGRS coordinate
        _onGraphicMGRS: function () {
            // Convert the MGRS back to latlng and set it to the features geometry
            var latlng = [];
            latlong = usng.USNGtoLL(this.locationMGRS.value, latlng);
            
            // Add the point
            this._addPoint(latlng[0], latlng[1]);
        },
        
        // Creates a graphic at the DD coordinate
        _onGraphicDD: function () {
            // Calculate the decimal degrees values
            var lat = Number(this.locationLatDD.value);
            if (this.locationLatDDHemi.value == "South") lat *= -1;
            
            var lon = Number(this.locationLonDD.value);
            if (this.locationLonDDHemi.value == "West") lon *= -1;
            
            // Add the point
            this._addPoint(lat, lon);
        },
        
        
        // Creates a graphic at the DMS coordinate
        _onGraphicDMS: function () {
            // Calculate the decimal degrees values
            var lat = Number(this.locationLatD.value) + (Number(this.locationLatM.value) / 60) + (Number(this.locationLatS.value) / 3600);
            if (this.locationLatDMSHemi.value == "South") lat *= -1;
            
            var lon = Number(this.locationLonD.value) + (Number(this.locationLonM.value) / 60) + (Number(this.locationLonS.value) / 3600);
            if (this.locationLonDMSHemi.value == "West") lon *= -1;
            
            // Add the point
            this._addPoint(lat, lon);
        }, 
        
        
        
        // Add the point to the map
        _addPoint: function (lat, lon) {
            // Text symbol
            // var symbol = new TextSymbol(this.locationMGRS.value).setColor(
                // new Color([0,0,0,1])).setAlign(Font.ALIGN_START).setAngle(0).setDecoration("none").setFont(
                // new Font("12pt").setWeight(Font.WEIGHT_NORMAL).setStyle(Font.STYLE_NORMAL).setFamily("Arial"));
            
            // Marker symbol
            symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0,1]), 1), new Color([0,0,0,1]));
                    
            // Add to the map's graphics layer
            this.map.graphics.add(new Graphic(new Point(lon, lat, new SpatialReference({wkid: 4326})), symbol));
        },
        
        
        // Clears all graphics
        _onClearGraphic: function () {
            this.map.graphics.clear();
        }
        
    });

});