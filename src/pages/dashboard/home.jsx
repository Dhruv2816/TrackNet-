// src/pages/Home.jsx
import React, { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})
const MAPBOX_TOKEN = "pk.eyJ1IjoiZGhydXYyODE2IiwiYSI6ImNtY3picHVubTBkbDkybXF0Zm1maWJ5dGcifQ.WVRy3JcC-H9ay_d04UYR4g" 
export function Home() {

  return (
    <div className="mt-12 p-4">
      <div className="h-[600px] w-full rounded-lg shadow-lg overflow-hidden">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          className="w-full h-full"
        >
          <TileLayer
            // Satellite + street labels style
            url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
            tileSize={512}
            zoomOffset={-1}
            attribution='© Mapbox © OpenStreetMap'
          />

          
        </MapContainer>
      </div>
    </div>
  )
}

export default Home
// const MAPBOX_TOKEN = "pk.eyJ1IjoiZGhydXYyODE2IiwiYSI6ImNtY3picHVubTBkbDkybXF0Zm1maWJ5dGcifQ.WVRy3JcC-H9ay_d04UYR4g"  