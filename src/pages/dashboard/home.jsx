// src/pages/Home.jsx
import React, { useState, useRef, useEffect } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  MapIcon
} from "@heroicons/react/24/outline"

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

const defaultIcons = [
  { name: "Home", component: HomeIcon },
  { name: "People", component: UsersIcon },
  { name: "Office", component: BuildingOfficeIcon },
  { name: "Map", component: MapIcon }
]

export function Home() {
  const [points, setPoints] = useState([])
  const [center, setCenter] = useState([20.5937, 78.9629])
  const [searchMarker, setSearchMarker] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [contextPos, setContextPos] = useState(null)
  const [formData, setFormData] = useState({
    icon: "",
    name: "",
    date: "",
    time: "",
    description: ""
  })
  const [editingId, setEditingId] = useState(null)
  const containerRef = useRef(null)

  function FlyToLocation({ position }) {
    const map = useMap()
    useEffect(() => {
      if (position) map.flyTo(position, 13, { duration: 1.2 })
    }, [position, map])
    return null
  }

  function ContextListener() {
    useMapEvent("contextmenu", (e) => {
      e.originalEvent.preventDefault()
      const rect = containerRef.current.getBoundingClientRect()
      const { clientX, clientY } = e.originalEvent
      setEditingId(null)
      setFormData({
        icon: "",
        name: "",
        date: "",
        time: "",
        description: ""
      })
      setContextPos({
        latlng: e.latlng,
        x: clientX - rect.left,
        y: clientY - rect.top
      })
    })
    return null
  }

  const onMarkerContext = (e, pt) => {
    e.originalEvent.preventDefault()
    e.originalEvent.stopPropagation()
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const { clientX, clientY } = e.originalEvent
    setEditingId(pt.id)
    setFormData({
      icon: pt.icon,
      name: pt.name,
      date: pt.date,
      time: pt.time,
      description: pt.description
    })
    setContextPos({
      latlng: e.latlng,
      x: clientX - rect.left,
      y: clientY - rect.top
    })
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(fd => ({ ...fd, [name]: value }))
  }

  const selectIcon = name => {
    setFormData(fd => ({ ...fd, icon: name }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!contextPos) return
    const { latlng } = contextPos

    if (editingId) {
      setPoints(ps =>
        ps.map(p =>
          p.id === editingId
            ? { ...p, ...formData, lat: latlng.lat, lng: latlng.lng }
            : p
        )
      )
    } else {
      setPoints(ps => [
        ...ps,
        { id: Date.now(), lat: latlng.lat, lng: latlng.lng, ...formData }
      ])
    }

    setEditingId(null)
    setFormData({ icon: "", name: "", date: "", time: "", description: "" })
    setContextPos(null)
  }

  const handleDelete = () => {
    if (!editingId) return
    setPoints(ps => ps.filter(p => p.id !== editingId))
    setEditingId(null)
    setContextPos(null)
  }

  const handleSearchSubmit = async e => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${MAPBOX_TOKEN}`
      )
      const data = await res.json()
      if (data.features.length) {
        const [lng, lat] = data.features[0].center
        setCenter([lat, lng])
        setSearchMarker({ id: "search", lat, lng, name: data.features[0].place_name })
      } else {
        alert("No results")
      }
    } catch {
      alert("Geocoding failed")
    }
  }

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCenter([latitude, longitude])
        setUserLocation({ lat: latitude, lng: longitude })
      },
      () => console.warn("Location failed")
    )
  }, [])

  const locateMe = () => {
    if (!navigator.geolocation) return alert("No geolocation support")
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCenter([latitude, longitude])
        setUserLocation({ lat: latitude, lng: longitude })
      },
      () => alert("Could not detect location")
    )
  }

  return (
    <div className="mt-1 p-4 relative">
      {/* <button
        onClick={locateMe}
        className="absolute top-4 right-4 bg-white p-2 rounded shadow z-20"
      >
        Locate Me
      </button> */}

      <form onSubmit={handleSearchSubmit} className="mb-4 flex space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search…"
          className="flex-grow px-3 py-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Go
        </button>
      </form>

      <div
        ref={containerRef}
        className="relative h-[600px] w-full rounded-lg shadow-lg overflow-hidden"
      >
        <MapContainer center={center} zoom={13} className="w-full h-full z-0">
          <FlyToLocation position={center}/>
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
            tileSize={512}
            zoomOffset={-1}
            attribution="© Mapbox © OpenStreetMap"
          />
          <ContextListener/>

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {points.map(pt => (
            <Marker
              key={pt.id}
              position={[pt.lat, pt.lng]}
              eventHandlers={{
                contextmenu: e => onMarkerContext(e, pt)
              }}
            >
              <Popup>
                {pt.icon && React.createElement(
                  (defaultIcons.find(i => i.name === pt.icon) || {}).component,
                  { className: 'h-5 w-5 inline-block mr-1' }
                )}
                <strong>{pt.name}</strong><br/>
                {pt.date} {pt.time}<br/>
                {pt.description}
              </Popup>
            </Marker>
          ))}

          {searchMarker && (
            <Marker position={[searchMarker.lat, searchMarker.lng]}>
              <Popup><strong>{searchMarker.name}</strong></Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Right-click form */}
        {contextPos && (
          <form
            onSubmit={handleSubmit}
            className="absolute bg-white p-4 rounded shadow-lg z-10"
            style={{ top: contextPos.y + 5, left: contextPos.x + 5, width: 260 }}
          >
            <h4 className="font-semibold mb-2">
              {editingId ? "Edit Keypoint" : "Add Keypoint"}
            </h4>

            <div className="flex space-x-2 mb-2">
              {defaultIcons.map(({ name, component: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => selectIcon(name)}
                  className={`p-1 border rounded ${
                    formData.icon === name ? "border-blue-500" : "border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5 text-gray-700" />
                </button>
              ))}
            </div>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full mb-2 px-2 py-1 border rounded"
              required
            />
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full mb-2 px-2 py-1 border rounded"
              required
            />
            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full mb-2 px-2 py-1 border rounded"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows={2}
              className="w-full mb-2 px-2 py-1 border rounded"
              required
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setContextPos(null)
                  setEditingId(null)
                }}
                className="px-3 py-1 text-sm rounded border"
              >
                Cancel
              </button>

              <div className="space-x-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-3 py-1 text-sm rounded border-red-500 border text-red-500"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Home
