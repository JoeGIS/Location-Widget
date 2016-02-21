# Location-Widget

## Features
An ArcGIS for JavaScript API widget for finding map locations in different coordinate notations.

[View it live](http://joerogan.ca/maps/joegis/)

### Supported Notations
- Military grid reference system (MGRS)
- Latitude / Longitude in decimal degrees (Lat/Lon DD)
- Latitude / Longitude in degrees/minutes/seconds (Lat/Lon DMS)

### Known Issues
- MGRS polar regions (outside latitude -80, +84) are not supported

### Future Changes
- Add map click event that fills all fields.
- Remove constructor options for default field values.
- Add option to toggle which coordinate notation tabs are created.
- Clear button clears only graphics added by this widget.
- Add more coordinate notations (DDS, UTM, what3words, etc)

## Quickstart

```javascript
var location = new Location({
    map: mainMap,
    defaultMGRS: "18T VR 45339 30260",
    defaultDD: {lat: "45.42372", latHemi: "North", lon: "75.69870", lonHemi: "West"},
    defaultDMS: {latD: "45", latM: "25", latS: "25.4", latHemi: "North", lonD: "75", lonM: "41", lonS: "55.3", lonHemi: "West"}
    }, "LocationDiv");
location.startup();
```

## Requirements
* Notepad or HTML editor
* A little background with JavaScript
* Experience with the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) would help.

## Setup
Set your dojo config to load the module.

```javascript
var package_path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
var dojoConfig = {
    // The locationPath logic below may look confusing but all its doing is
    // enabling us to load the api from a CDN and load local modules from the correct location.
    packages: [{
        name: "application",
        location: package_path + '/js'
    }]
};
```

## Require module
Include the module for the LayerList.

```javascript
require(["application/Location", ... ], function(Location, ... ){ ... });
```

## Constructor
Location(options, srcNode);

### Options (Object)
|property|required|type|value|description|
|---|---|---|---|---|
|theme||string|locationWidget|CSS Class for uniquely styling the widget.|
|map|x|Map|null|ArcGIS JS Map|
|defaultMGRS||string|||
|defaultDD||object|||
|defaultDMS||object|||

## Methods
### startup
startup(): Start the widget.

## Issues
Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing
Anyone and everyone is welcome to contribute.

## Licensing
The MIT License (MIT)

Copyright (c) 2016 Joseph Rogan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

