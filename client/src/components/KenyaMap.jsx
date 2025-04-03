import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Box } from "@mui/material";

// Fix missing default marker issue in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const KenyaMap = () => {
  const nairobiCoords = [-1.286389, 36.817223]; // Nairobi, Kenya

  return (
    <Box sx={{ mt: 4, borderRadius: 2, overflow: "hidden", height: "300px" }}>
      <MapContainer
        center={nairobiCoords}
        zoom={6}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={nairobiCoords} icon={defaultIcon}>
          <Popup>Nairobi - Capital of Kenya</Popup>
        </Marker>

        <Marker position={[-3.9382, 39.7425]} icon={defaultIcon}>
          <Popup>Mombasa - Coastal city in Kenya</Popup>
        </Marker>

        <Marker position={[-0.1022, 34.7617]} icon={defaultIcon}>
          <Popup>Kisumu - Port city on Lake Victoria</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default KenyaMap;
