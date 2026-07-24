// 'use client';
// import React, { useEffect, useRef, useState } from 'react';
// import maplibregl from 'maplibre-gl'; // or 'mapbox-gl' depending on your import package
// import 'maplibre-gl/dist/maplibre-gl.css';
// import type { Field } from '@/lib/types';

// interface MapProps {
//   fields: Field[];
//   selectedId: string | null;
//   onSelectField: (field: Field) => void;
// }

// export default function MapboxMap({ fields, selectedId, onSelectField }: MapProps) {
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const mapRef = useRef<maplibregl.Map | null>(null);
//   const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});
  
//   // Style Tracking State
//   const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');

//   // Map Style Config URL Strings (Using standard Mapbox style references)
//   const styles = {
//     streets: 'mapbox://styles/mapbox/streets-v12', // Clean, vector map for transit/navigation
//     satellite: 'mapbox://styles/mapbox/satellite-hybrid-v12' // Photographic satellite view with street names overlaid
//   };

//   // 1. Initialize Map Instance
//   useEffect(() => {
//     if (!mapContainer.current || mapRef.current) return;

//     const map = new maplibregl.Map({
//       container: mapContainer.current,
//       style: styles[mapStyle],
//       center: [-73.61, 45.52], // Montreal Centered coordinate string
//       zoom: 11,
//       maxZoom: 18,
//       minZoom: 9,
//     });

//     // Clean modern navigation placement (Zoom + Orientation indicators)
//     map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
//     mapRef.current = map;

//     return () => {
//       map.remove();
//       mapRef.current = null;
//     };
//   }, []);

//   // 2. Dynamic Style Switcher Listener
//   useEffect(() => {
//     if (!mapRef.current) return;
//     mapRef.current.setStyle(styles[mapStyle]);
//   }, [mapStyle]);

//   // 3. Dynamic Marker Injection & Clustering Simulation
//   useEffect(() => {
//     const map = mapRef.current;
//     if (!map) return;

//     // Clean out stale markers across updates
//     Object.values(markersRef.current).forEach(marker => marker.remove());
//     markersRef.current = {};

//     fields.forEach((field) => {
//       if (!field.lat || !field.lng) return;

//       // Create a premium custom eco-themed HTML marker pin
//       const el = document.createElement('div');
//       const isSelected = field.id === selectedId;
      
//       el.className = `w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md border cursor-pointer transition-all duration-300 transform hover:scale-110 ${
//         isSelected 
//           ? 'bg-emerald-600 text-white border-white scale-125 ring-4 ring-emerald-500/30 z-50' 
//           : 'bg-white text-[#166534] border-emerald-600 hover:bg-emerald-50 z-10'
//       }`;
//       el.innerText = field.ecoScore ? `${field.ecoScore}🌱` : '⚽';

//       // Attach selection navigation handlers
//       el.addEventListener('click', () => {
//         onSelectField(field);
//         map.easeTo({ center: [field.lng, field.lat], zoom: 14.5, duration: 1200 });
//       });

//       const marker = new maplibregl.Marker({ element: el })
//         .setLngLat([field.lng, field.lat])
//         .addTo(map);

//       markersRef.current[field.id] = marker;
//     });
//   }, [fields, selectedId]);

//   // 4. Focus Camera Pan listener when list cards click-trigger selection
//   useEffect(() => {
//     if (!mapRef.current || !selectedId) return;
//     const activeField = fields.find(f => f.id === selectedId);
//     if (activeField && activeField.lat && activeField.lng) {
//       mapRef.current.easeTo({
//         center: [activeField.lng, activeField.lat],
//         zoom: 15,
//         essential: true,
//         duration: 1000
//       });
//     }
//   }, [selectedId, fields]);

//   return (
//     <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-zinc-200/80 shadow-inner group">
//       {/* The Core Canvas Element */}
//       <div ref={mapContainer} className="w-full h-full bg-zinc-50" />

//       {/* Floating Style Toggle Pod Controller Layout (Glassmorphism design) */}
//       <div className="absolute bottom-4 left-4 z-20 flex gap-1 p-1 bg-white/80 backdrop-blur-md rounded-xl border border-zinc-200/60 shadow-lg shadow-zinc-900/5">
//         <button
//           type="button"
//           onClick={() => setMapStyle('streets')}
//           className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition ${
//             mapStyle === 'streets'
//               ? 'bg-[#166534] text-white shadow-sm'
//               : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/50'
//           }`}
//         >
//           🗺️ Standard Map
//         </button>
//         <button
//           type="button"
//           onClick={() => setMapStyle('satellite')}
//           className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition ${
//             mapStyle === 'satellite'
//               ? 'bg-[#166534] text-white shadow-sm'
//               : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/50'
//           }`}
//         >
//           🛰️ Satellite View
//         </button>
//       </div>

//       {/* Quick Indicator Badge for Data Freshness */}
//       <div className="absolute top-4 left-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2.5 py-1 rounded-md bg-zinc-900/70 backdrop-blur text-[10px] text-white font-medium uppercase tracking-wider">
//         Montreal Infiltration Grid
//       </div>
//     </div>
//   );
// }
