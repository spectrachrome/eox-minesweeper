const config = {
    "map": {
        "zoom": 3,
        "center": [
            1000000,
            6000000
        ],
        "layers": [
            {
                "type": "Tile",
                "id": "osm",
                "title": "Open Street Map",
                "visible": true,
                "opacity": 1.0,
                "source": {
                    "type": "OSM"
                }
            }
        ]
    }
}

export default config;