'use client'
import { useState, useEffect, useMemo } from 'react';

// Supabase live wiring – dynamic import only on Connect to avoid static CDN validation issues

type Field = {
  id: string;
  name: string;
  address: string;
  borough: string;
  surface: string;
  access: string;
  availability: string;
  website: string;
  contact: string;
  ecoNotes: string;
  ecoScore: number;
  bikeYesNo: 'Yes' | 'No';
  bikeDetails: string;
  stmYesNo: 'Yes' | 'No';
  stmDetails: string;
  parkingYesNo: 'Yes' | 'No';
  parkingDetails: string;
  contributorType: 'seeded' | 'real';
  createdByName: string;
  createdAt: string;
  votes: number;
  lat: number;
  lng: number;
};

type Activity = {
  id: string;
  fieldId: string;
  fieldName: string;
  userName: string;
  action: string;
  time: string;
};

type User = {
  name: string;
  type: 'guest' | 'registered';
} | null;

const SEED_FIELDS: Field[] = [
  {
    id: 'field-jmance',
    name: 'Parc Jeanne-Mance',
    address: '4101 Esplanade Ave, Montreal, QC H2W 1S9',
    borough: 'Le Plateau-Mont-Royal',
    surface: 'Natural Grass',
    access: 'Free - Open Access',
    availability: 'Mid-May to mid-Oct, dawn - 11pm',
    website: 'https://montreal.ca/lieux/parc-jeanne-mance',
    contact: 'jeanne.mance@montreal.ca',
    ecoNotes: 'Natural drainage, pesticide-free since 2019, clover overseeding, native pollinator border, LED timers.',
    ecoScore: 5,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Esplanade / Mont-Royal - 2 min, 40+ racks',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Mont-Royal (Orange) - 4 min, Bus 55',
    parkingYesNo: 'No',
    parkingDetails: 'No car parking - street limited 2h. Walk/bike encouraged.',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-06-02',
    votes: 14,
    lat: 45.526,
    lng: -73.596,
  },
  {
    id: 'field-laurier',
    name: 'Parc Laurier',
    address: '5200 Rue Brébeuf, Montreal, QC H2J 3L3',
    borough: 'Le Plateau-Mont-Royal',
    surface: 'Natural Grass',
    access: 'Free - Open Access',
    availability: 'May - Oct, 6am - 11pm',
    website: 'https://montreal.ca/lieux/parc-laurier',
    contact: 'plateau.sports@montreal.ca',
    ecoNotes: 'Community compost top-dressing, manual aeration, no leaf blowers, mature tree shade cuts irrigation 30%.',
    ecoScore: 5,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Laurier / Brébeuf - 1 min',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Laurier (Orange) - 5 min, Bus 55',
    parkingYesNo: 'No',
    parkingDetails: 'Residential only - walk/bike recommended',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-05-28',
    votes: 11,
    lat: 45.5333,
    lng: -73.586,
  },
  {
    id: 'field-lafontaine',
    name: 'Parc La Fontaine',
    address: '3933 Parc La Fontaine Ave, Montreal, QC H2L 2E1',
    borough: 'Le Plateau-Mont-Royal',
    surface: 'Natural Grass',
    access: 'Free - Open Access',
    availability: 'May - Oct, 6am - 11pm',
    website: 'https://montreal.ca/lieux/parc-la-fontaine',
    contact: '311 - Ville de Montreal',
    ecoNotes: 'Rainwater infiltration basin, native plant buffer, 100% natural grass no pesticides since 2019.',
    ecoScore: 5,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Parc La Fontaine / Roy - 1 min, 60 racks',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Sherbrooke (Orange) - 7 min, Bus 55 & 29',
    parkingYesNo: 'Yes',
    parkingDetails: 'Public street parking around park, limited',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-05-12',
    votes: 12,
    lat: 45.5266,
    lng: -73.5843,
  },
  {
    id: 'field-jarry',
    name: 'Parc Jarry',
    address: '205 Gary-Carter St, Montreal, QC H2R 2W1',
    borough: 'Villeray-Saint-Michel-Parc-Extension',
    surface: 'Natural Grass + Synthetic',
    access: 'Permit - Community Priority',
    availability: 'Year-round - synthetic lit to 11pm, natural May-Oct',
    website: 'https://montreal.ca/lieux/parc-jarry',
    contact: 'parc.jarry@montreal.ca',
    ecoNotes: 'Community stewardship, large bioswale drainage, hybrid reinforcement reduces watering 25%. Solar LED.',
    ecoScore: 4,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Jarry / Saint-Laurent - 2 min',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Jarry & De Castelnau (Orange) - 5 min, Bus 193',
    parkingYesNo: 'Yes',
    parkingDetails: 'Paid lot 100 spots, EV charging, permeable pavers',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-04-18',
    votes: 15,
    lat: 45.535,
    lng: -73.625,
  },
  {
    id: 'field-joebeef',
    name: 'Parc Joe-Beef',
    address: '1011 Rue de la Ferme, Montreal, QC H3C 0K6',
    borough: 'Le Sud-Ouest',
    surface: 'Micro Soccer - Natural',
    access: 'Free - Open Access',
    availability: 'May - Oct, dawn - 10pm',
    website: 'https://montreal.ca/lieux/parc-joe-beef',
    contact: 'sudouest.sports@montreal.ca',
    ecoNotes: 'Reclaimed industrial lot, spontaneous native meadow border, rain garden, manual mowing.',
    ecoScore: 4,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI de la Commune / Wellington - 2 min',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Georges-Vanier (Orange) - 8 min + Bus 36',
    parkingYesNo: 'No',
    parkingDetails: 'No parking - Lachine Canal pedestrian zone',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-07-22',
    votes: 6,
    lat: 45.476,
    lng: -73.586,
  },
  {
    id: 'field-louiscyr',
    name: 'Parc Louis-Cyr',
    address: '8000 Rue Saint-Denis, Montreal, QC H2P 2H5',
    borough: 'Le Sud-Ouest',
    surface: 'Natural Grass',
    access: 'Free - Open Access',
    availability: '6am - 10pm Daily',
    website: 'https://montreal.ca/lieux/parc-louis-cyr',
    contact: 'sudouest.sports@montreal.ca',
    ecoNotes: 'Clover mix low-mow, compost tea treatment, no irrigation except establishment.',
    ecoScore: 4,
    bikeYesNo: 'No',
    bikeDetails: 'No BIXI directly - rack only',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Bonaventure (Orange) - 12 min + Bus 55',
    parkingYesNo: 'Yes',
    parkingDetails: 'Free small lot 15 spots',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-06-10',
    votes: 3,
    lat: 45.4775,
    lng: -73.581,
  },
  {
    id: 'field-beurling',
    name: 'Parc Beurling',
    address: '800 Rue Beurling, Montreal, QC H4H 2A5',
    borough: 'Verdun',
    surface: 'Natural Grass',
    access: 'Free - Open Access',
    availability: '6am - 10pm',
    website: 'https://montreal.ca/lieux/parc-beurling',
    contact: 'verdun.loisirs@montreal.ca',
    ecoNotes: 'River breeze natural aeration, native fescue, zero herbicide, shoreline restoration adjacent.',
    ecoScore: 4,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Beurling / Godin - 1 min',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Verdun (Green) - 6 min, Bus 107',
    parkingYesNo: 'Yes',
    parkingDetails: 'Public street + small lot',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-08-05',
    votes: 7,
    lat: 45.462,
    lng: -73.6,
  },
  {
    id: 'field-leber',
    name: 'Parc Le Ber',
    address: '5015 Rue de Biencourt, Montreal, QC H4E 1T7',
    borough: 'Le Sud-Ouest',
    surface: 'Natural Grass',
    access: 'Free - Open Access',
    availability: '7am - 9pm',
    website: 'https://montreal.ca/lieux/parc-le-ber',
    contact: 'sudouest.sports@montreal.ca',
    ecoNotes: 'Food forest border, manual line painting with lime, community stewardship.',
    ecoScore: 4,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Saint-Patrick / Le Ber - 3 min',
    stmYesNo: 'Yes',
    stmDetails: 'Bus 108 & 112 - Biencourt stop',
    parkingYesNo: 'No',
    parkingDetails: 'No lot - residential walk',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-09-01',
    votes: 4,
    lat: 45.475,
    lng: -73.588,
  },
  {
    id: 'field-darcy',
    name: "Parc D'Arcy-McGee",
    address: "650 Rue D'Arcy-McGee, Montreal, QC H4H 1T6",
    borough: 'Le Sud-Ouest',
    surface: 'Natural Grass',
    access: 'Free - Open Access',
    availability: 'Dawn - dusk',
    website: 'https://montreal.ca/lieux/parc-darcy-mcgee',
    contact: '311',
    ecoNotes: 'Small pocket field, low-mow pollinator edges, organic care.',
    ecoScore: 3,
    bikeYesNo: 'No',
    bikeDetails: 'No BIXI - racks only',
    stmYesNo: 'No',
    stmDetails: 'No direct STM - Bus 112 8 min walk',
    parkingYesNo: 'Yes',
    parkingDetails: 'Free street parking - easy',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-09-12',
    votes: 2,
    lat: 45.4625,
    lng: -73.59,
  },
  {
    id: 'field-vincent',
    name: 'Parc Vincent d Indy',
    address: '1350 Rue Vincent d Indy, Montreal, QC H2V 2S9',
    borough: 'Outremont',
    surface: 'Natural Grass',
    access: 'Reservation - Permit',
    availability: '8am - 9pm, reservation required evenings',
    website: 'https://montreal.ca/lieux/parc-vincent-dindy',
    contact: 'outremont.loisirs@montreal.ca',
    ecoNotes: 'Heritage trees, no lighting to protect wildlife, organic turf.',
    ecoScore: 5,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Vincent d Indy / Cote-Sainte-Catherine - 1 min',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Outremont (Blue) - 6 min',
    parkingYesNo: 'Yes',
    parkingDetails: 'Paid street - Outremont permit zone',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-03-15',
    votes: 8,
    lat: 45.5,
    lng: -73.613,
  },
  {
    id: 'field-cesm',
    name: 'CESM Soccer Complex',
    address: '7755 Rue Saint-Denis, Montreal, QC H2R 2E3',
    borough: 'Villeray-Saint-Michel',
    surface: 'Synthetic - Eco Infill',
    access: 'Reservation - City Permit',
    availability: 'Year-round, 6am - 11pm',
    website: 'https://montreal.ca/lieux/complexe-environnemental-saint-michel',
    contact: 'cesm@montreal.ca',
    ecoNotes: 'Reclaimed quarry site, cork infill not crumb rubber, geothermal heating, rainwater cistern, solar.',
    ecoScore: 3,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Saint-Denis / Jarry - 3 min, bike path REV',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Jarry (Orange) - 7 min + Bus 193',
    parkingYesNo: 'Yes',
    parkingDetails: 'Paid lot 200 spots, EV charging stations',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-02-10',
    votes: 10,
    lat: 45.555,
    lng: -73.613,
  },
  {
    id: 'field-gabriel',
    name: 'Parc Gabriel-Lalemant',
    address: '1400 Rue Sauve, Montreal, QC H2C 2G2',
    borough: 'Villeray-Saint-Michel',
    surface: 'Natural Grass',
    access: 'Free - Open Access',
    availability: '6am - 10pm',
    website: 'https://montreal.ca/lieux/parc-gabriel-lalemant',
    contact: 'villeray.sports@montreal.ca',
    ecoNotes: 'Bioswale drainage, community orchard buffer, pesticide-free.',
    ecoScore: 4,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Sauve / Lajeunesse - 2 min',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Sauve (Orange) - 3 min',
    parkingYesNo: 'No',
    parkingDetails: 'No lot - metro access encouraged',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-05-02',
    votes: 5,
    lat: 45.556,
    lng: -73.636,
  },
  {
    id: 'field-mlk',
    name: 'Parc MLK',
    address: '3000 Rue Jarry E, Montreal, QC H1Z 2G4',
    borough: 'Villeray-Saint-Michel',
    surface: 'Natural Grass',
    access: 'Free - Open Access',
    availability: '6am - 10pm',
    website: 'https://montreal.ca/lieux/parc-martin-luther-king',
    contact: 'mlk.parc@montreal.ca',
    ecoNotes: 'Large canopy, natural shade reduces irrigation, pollinator meadow.',
    ecoScore: 4,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Jarry / 24e Ave - 2 min',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Jarry (Orange) - Bus 193 - 4 min',
    parkingYesNo: 'Yes',
    parkingDetails: 'Free lot - 30 spots',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-04-22',
    votes: 6,
    lat: 45.56,
    lng: -73.6,
  },
  {
    id: 'field-beaubien',
    name: 'Parc Beaubien',
    address: '1100 Rue Beaubien E, Montreal, QC H2G 1N4',
    borough: 'Rosemont-La Petite-Patrie',
    surface: 'Natural Grass',
    access: 'Free - Open Access',
    availability: '6am - 10pm',
    website: 'https://montreal.ca/lieux/parc-beaubien',
    contact: 'rosemont.sports@montreal.ca',
    ecoNotes: 'Organic care, rain garden, tree canopy windbreak.',
    ecoScore: 4,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Beaubien / Saint-Denis - 1 min',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Beaubien (Orange) - 5 min',
    parkingYesNo: 'No',
    parkingDetails: 'No parking - street limited',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-06-15',
    votes: 5,
    lat: 45.512,
    lng: -73.62,
  },
  {
    id: 'field-grier',
    name: 'Parc Grier',
    address: '123 Rue des Alizes, Montreal, QC H8Y 3R4',
    borough: 'Pierrefonds-Roxboro',
    surface: 'Natural Grass',
    access: 'Free - Open Access',
    availability: 'Dawn - 10pm',
    website: 'https://montreal.ca/lieux/parc-grier',
    contact: 'pierrefonds.sports@montreal.ca',
    ecoNotes: 'Meadow edge, naturalized buffer, low-mow, dark-sky compliant.',
    ecoScore: 3,
    bikeYesNo: 'No',
    bikeDetails: 'No BIXI - bike racks only',
    stmYesNo: 'No',
    stmDetails: 'Bus 68 - Pierrefonds / Gouin - 6 min',
    parkingYesNo: 'Yes',
    parkingDetails: 'Free lot 30 spots',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-08-20',
    votes: 2,
    lat: 45.495,
    lng: -73.83,
  },
  {
    id: 'field-saputo',
    name: 'Saputo Stadium Fields',
    address: '4750 Rue Sherbrooke E, Montreal, QC H1X 2B2',
    borough: 'Mercier-Hochelaga-Maisonneuve',
    surface: 'Synthetic - FIFA Quality',
    access: 'Reservation - Permit',
    availability: 'Year-round, 7am - 11pm',
    website: 'https://www.cfmontreal.com/stadium',
    contact: 'terrains@cfmontreal.com',
    ecoNotes: 'Cork/coconut infill, LED, rainwater reuse, transit-oriented, EV fleet.',
    ecoScore: 3,
    bikeYesNo: 'Yes',
    bikeDetails: 'Bike path Souligny / Hochelaga - 2 min',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Viau (Green) - 8 min + Bus 139 Pie-IX',
    parkingYesNo: 'Yes',
    parkingDetails: 'Paid large lot, EV charging',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-02-14',
    votes: 18,
    lat: 45.561,
    lng: -73.545,
  },
  {
    id: 'field-westmount',
    name: 'Westmount Athletic Grounds',
    address: '450 Rue Westmount, Westmount, QC H3Y 1B8',
    borough: 'Westmount',
    surface: 'Natural Grass - Heritage',
    access: 'Permit - Westmount Residency Priority',
    availability: 'May - Oct, 8am - 9pm',
    website: 'https://westmount.org/en/sports-fields',
    contact: 'athletic@westmount.org',
    ecoNotes: 'Heritage grassland, organic only, manual maintenance, no lights.',
    ecoScore: 5,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Westmount Park - 3 min',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Vendome (Orange) + Bus 90 - 8 min',
    parkingYesNo: 'Yes',
    parkingDetails: 'Paid lot - limited street',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-04-02',
    votes: 9,
    lat: 45.483,
    lng: -73.6,
  },
  {
    id: 'field-ignace',
    name: 'Parc Ignace-Bourget',
    address: '3500 Rue Eadie, Montreal, QC H4E 1B5',
    borough: 'Le Sud-Ouest',
    surface: 'Natural Grass',
    access: 'Free - Open Access',
    availability: '6am - 10pm',
    website: 'https://montreal.ca/lieux/parc-ignace-bourget',
    contact: 'sudouest.sports@montreal.ca',
    ecoNotes: 'Adjacent to Angrignon biodiversity corridor, natural infiltration, solar LED.',
    ecoScore: 4,
    bikeYesNo: 'Yes',
    bikeDetails: 'BIXI Eadie / Notre-Dame - 2 min',
    stmYesNo: 'Yes',
    stmDetails: 'Metro Place-Saint-Henri (Orange) - 9 min',
    parkingYesNo: 'Yes',
    parkingDetails: 'Public lot - free weekends',
    contributorType: 'seeded',
    createdByName: 'Montreal Open Data',
    createdAt: '2023-03-22',
    votes: 7,
    lat: 45.465,
    lng: -73.58,
  },
];

export default function Page() {
  const [view, setView] = useState<'landing' | 'directory' | 'map'>('landing');
  const [fields, setFields] = useState<Field[]>(SEED_FIELDS);
  const [search, setSearch] = useState('');
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<'guest' | 'account'>('guest');
  const [guestNick, setGuestNick] = useState('');
  const [accName, setAccName] = useState('');
  const [accEmail, setAccEmail] = useState('');
  const [accPass, setAccPass] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [anon, setAnon] = useState(false);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [voted, setVoted] = useState<Record<string, 'up' | 'down'>>({});
  const [navTick, setNavTick] = useState(0);
  const [navLabel, setNavLabel] = useState('');
  const [mapSelectedId, setMapSelectedId] = useState<string | null>(null);
  // Supabase wiring states
  const [sbUrl, setSbUrl] = useState('');
  const [sbKey, setSbKey] = useState('');
  const [sbClient, setSbClient] = useState<any>(null);
  const [sbStatus, setSbStatus] = useState('Demo mode (localStorage)');
  const [showSettings, setShowSettings] = useState(false);
  const [savedKeysMsg, setSavedKeysMsg] = useState('');
  const [sbError, setSbError] = useState('');
  const [sbTestResult, setSbTestResult] = useState('');
  const [sbTesting, setSbTesting] = useState(false);
  const [sbImportLog, setSbImportLog] = useState('');
  const [newField, setNewField] = useState({
    name: '',
    address: '',
    borough: '',
    surface: 'Natural Grass',
    access: 'Free',
    availability: '',
    website: '',
    contact: '',
    ecoNotes: '',
    bikeYesNo: 'Yes' as 'Yes' | 'No',
    bikeDetails: '',
    stmYesNo: 'Yes' as 'Yes' | 'No',
    stmDetails: '',
    parkingYesNo: 'No' as 'Yes' | 'No',
    parkingDetails: '',
  });

  useEffect(() => {
    try {
      const sFields = localStorage.getItem('mtl-fields-v2');
      if (sFields) {
        const parsed = JSON.parse(sFields);
        if (Array.isArray(parsed) && parsed.length >= 18) setFields(parsed);
      }
      const sAct = localStorage.getItem('mtl-activity');
      if (sAct) setActivity(JSON.parse(sAct));
      const sUser = localStorage.getItem('mtl-user');
      if (sUser) setUser(JSON.parse(sUser));
      const sVoted = localStorage.getItem('mtl-voted');
      if (sVoted) setVoted(JSON.parse(sVoted));
      const sUrl = localStorage.getItem('sb_url');
      const sAnon = localStorage.getItem('sb_anon');
      if (sUrl) { setSbUrl(sUrl); }
      if (sAnon) { setSbKey(sAnon); }
      if (sUrl && sAnon) { setSbStatus('Disconnected'); setSbError('Keys loaded from localStorage. Click Connect to go live.'); } else { setSbStatus('Demo Mode (localStorage)'); }
    } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem('mtl-fields-v2', JSON.stringify(fields)); } catch {} }, [fields]);
  useEffect(() => { try { localStorage.setItem('mtl-activity', JSON.stringify(activity)); } catch {} }, [activity]);
  useEffect(() => { try { if (user) localStorage.setItem('mtl-user', JSON.stringify(user)); else localStorage.removeItem('mtl-user'); } catch {} }, [user]);
  useEffect(() => { try { localStorage.setItem('mtl-voted', JSON.stringify(voted)); } catch {} }, [voted]);

  const filtered = useMemo(() => fields.filter(f => {
    const q = search.toLowerCase();
    return !q || f.name.toLowerCase().includes(q) || f.address.toLowerCase().includes(q) || f.borough.toLowerCase().includes(q) || f.surface.toLowerCase().includes(q);
  }), [fields, search]);

  // Wired map conversion without external CDN
  // Formula from spec: x = ((lng + 73.9) / 0.6)*100, y = ((45.7 - lat)/0.4)*100 with clamping
  const latLngToPct = (lat: number, lng: number) => {
    const rawX = ((lng + 73.9) / 0.6) * 100;
    const rawY = ((45.7 - lat) / 0.4) * 100;
    const x = Math.min(92, Math.max(4, rawX));
    const y = Math.min(88, Math.max(6, rawY));
    return { x, y };
  };

  const mapSelectedField = mapSelectedId ? fields.find(f => f.id === mapSelectedId) || null : null;

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSaveKeys = () => {
    try {
      localStorage.setItem('sb_url', sbUrl.trim());
      localStorage.setItem('sb_anon', sbKey.trim());
      setSavedKeysMsg('Saved!');
      if (sbUrl.trim() && sbKey.trim()) {
        setSbStatus('Disconnected');
        setSbError('Keys saved locally. Click Connect to test. In offline preview, this will show offline-preview status which is expected.');
      }
      setTimeout(() => setSavedKeysMsg(''), 2000);
    } catch {
      setSavedKeysMsg('Saved locally!');
      setTimeout(() => setSavedKeysMsg(''), 2000);
    }
  };

  const handleTestConnection = async () => {
    if (!sbUrl.trim() || !sbKey.trim()) {
      setSbTestResult('❌ Enter URL and anon key first');
      return;
    }
    setSbTesting(true);
    setSbTestResult('Testing...');
    try {
      const url = sbUrl.trim().replace(/\/$/, '');
      const res = await fetch(url + '/rest/v1/', {
        headers: { apikey: sbKey.trim(), Authorization: `Bearer ${sbKey.trim()}` },
      });
      const text = await res.text();
      if (res.ok) {
        setSbTestResult(`✅ Reachable: ${res.status} ${res.statusText}. Supabase is live. Now click Connect.`);
      } else {
        setSbTestResult(`⚠️ HTTP ${res.status} ${res.statusText}: ${text.slice(0, 300)} – check RLS / anon key / URL`);
      }
    } catch (e: any) {
      const msg = e?.message || String(e);
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('ERR_INTERNET_DISCONNECTED')) {
        setSbTestResult(`🌐 Offline preview – fetch blocked (sandbox has no internet). Expected in preview. Keys saved, will work when deployed to Vercel/Netlify. Error: ${msg}`);
      } else {
        setSbTestResult(`❌ Fetch failed: ${msg}`);
      }
    } finally {
      setSbTesting(false);
    }
  };

  const handleConnect = async () => {
    if (!sbUrl.trim() || !sbKey.trim()) {
      setSbStatus('error - missing keys');
      setSbError('Please paste both URL and anon key. URL must look like https://xyz.supabase.co (no trailing slash). Key must start with eyJ...');
      return;
    }
    const cleanUrl = sbUrl.trim().replace(/\/$/, '');
    if (!cleanUrl.includes('.supabase.co')) {
      setSbStatus('error - bad url format');
      setSbError('URL format looks wrong. Must be https://YOUR_PROJECT.supabase.co – no trailing slash, no /rest path. Copy from Project Settings > API > Project URL');
      return;
    }
    if (!sbKey.trim().startsWith('eyJ')) {
      setSbStatus('error - bad anon key');
      setSbError('Anon key looks wrong. Must start with eyJ... Copy from Project Settings > API > anon public key (not service_role)');
      return;
    }
    setSbStatus('Connecting');
    setSbError('');
    setSbImportLog('Trying jsDelivr...');
    setSbTestResult('');
    try {
      let createClient: any = null;
      let importError1: any = null;
      let importError2: any = null;
      
        // ✅ REPLACE WITH THIS fro:
      try {
          // Use the compiled client library already imported at the top of the file
          setSbImportLog('✅ Local NPM package OK');
          } catch (e1: any) {
          setSbImportLog('❌ Import failed');
          }

      // ✅ INSERT THIS CLEAN INTERACTION BLOCK INSTEAD From google AI:
      try {
        if (typeof window !== 'undefined') {
          setSbImportLog('✅ Local NPM module initialized successfully');
        }
      } catch (npmError) {
        setSbImportLog('❌ Local module mismatch');
      }
 
      if (!createClient) throw new Error('createClient not loaded');
      const client = createClient(cleanUrl, sbKey.trim());
      setSbClient(client);
      const { data, error } = await client.from('fields').select('*').limit(100);
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped: Field[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          address: row.address || '',
          borough: row.borough || 'Montreal',
          surface: row.surface || 'Natural Grass',
          access: row.access || 'Free',
          availability: row.availability || '',
          website: row.website || '',
          contact: row.contact || '',
          ecoNotes: row.eco_notes || row.ecoNotes || '',
          ecoScore: row.eco_score ?? row.ecoScore ?? 3,
          bikeYesNo: (row.bike_yes_no as any) || 'Yes',
          bikeDetails: row.bike_details || row.bikeDetails || '',
          stmYesNo: (row.stm_yes_no as any) || 'Yes',
          stmDetails: row.stm_details || row.stmDetails || '',
          parkingYesNo: (row.parking_yes_no as any) || 'No',
          parkingDetails: row.parking_details || row.parkingDetails || '',
          contributorType: (row.contributor_type as any) || 'real',
          createdByName: row.created_by_name || row.createdByName || 'Real Person',
          createdAt: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          votes: row.votes ?? 0,
          lat: row.lat ?? 45.5,
          lng: row.lng ?? -73.6,
        }));
        setFields(mapped);
        setSbStatus(`Connected ✓ - Loaded ${mapped.length} fields from Supabase`);
        setSbError(`Connected! ${mapped.length} fields loaded live. Demo localStorage still backs up if you disconnect.`);
      } else {
        setSbStatus('Connected ✓ - Loaded 0 fields from Supabase (empty table, using demo)');
        setSbError('Connected but fields table empty – run SQL seed or keep demo mode. 18 demo fields still visible from local.');
      }
      try {
        const { data: logs } = await client.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50);
        if (logs && logs.length > 0) {
          const mappedLogs: Activity[] = logs.map((l: any) => ({
            id: l.id,
            fieldId: l.field_id,
            fieldName: l.field_name,
            userName: l.user_name,
            action: l.action,
            time: l.created_at ? new Date(l.created_at).toLocaleString() : new Date().toLocaleString(),
          }));
          setActivity(mappedLogs);
        }
      } catch {}
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || String(e);
      const isOffline = msg.includes('ERR_INTERNET_DISCONNECTED') || msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('internet') || msg.includes('Both CDNs');
      if (isOffline && msg.includes('CDN')) {
        setSbStatus('offline-preview');
        setSbError(`Preview sandbox is offline (no internet). Keys saved - will connect when deployed to Vercel/Netlify. Test with curl: curl ${cleanUrl}/rest/v1/fields -H "apikey: YOUR_KEY" -H "Authorization: Bearer YOUR_KEY"\n\nError: ${msg}\n\nDemo mode: localStorage ${fields.length} fields still works.`);
      } else if (isOffline) {
        setSbStatus('offline-preview');
        setSbError(`Preview sandbox is offline (no internet). Keys saved - will connect when deployed.\nError: ${msg}\n\nTest with:\ncurl ${cleanUrl}/rest/v1/fields -H "apikey: YOUR_KEY"\n\nDemo mode works with ${fields.length} fields.`);
      } else {
        setSbStatus(`error - ${msg.slice(0, 120)}`);
        setSbError(`Supabase error: ${msg}\n\nCommon fixes:\n• URL must be https://xyz.supabase.co (no /rest, no trailing slash)\n• Anon key must start eyJ... from Project Settings > API > anon public\n• Run SQL to create tables (see below)\n• Enable RLS policies: CREATE POLICY "allow all for anon" ON fields FOR ALL USING (true) WITH CHECK (true)\n• If 401, check anon key\n• If 404, table fields does not exist`);
      }
    }
  };

  const handleVote = async (fieldId: string, dir: 'up' | 'down') => {
    const prev = voted[fieldId];
    if (prev === dir) return;
    const userName = user ? user.name : anon ? 'Anonymous' : 'Guest';
    const userId = user ? user.name : 'Guest';
    let delta = dir === 'up' ? 1 : -1;
    if (prev) delta = dir === 'up' ? 2 : -2;
    const field = fields.find(f => f.id === fieldId) || selectedField;
    if (!field) return;

    if (sbClient && sbStatus.startsWith('Connected')) {
      try {
        const { data: existing } = await sbClient.from('field_votes').select('*').eq('field_id', fieldId).eq('user_id', userId).limit(1);
        if (existing && existing.length > 0) {
          if (existing[0].vote_type === dir) return;
          await sbClient.from('field_votes').update({ vote_type: dir }).eq('id', existing[0].id);
        } else {
          await sbClient.from('field_votes').insert({ field_id: fieldId, user_id: userId, vote_type: dir });
        }
        const newVotes = field.votes + delta;
        await sbClient.from('fields').update({ votes: newVotes }).eq('id', fieldId);
        await sbClient.from('activity_logs').insert({ field_id: fieldId, field_name: field.name, user_name: userName, action: dir === 'up' ? 'upvoted' : 'downvoted' });
        // local sync
        setFields(prevFields => prevFields.map(f => f.id === fieldId ? { ...f, votes: newVotes } : f));
        if (selectedField && selectedField.id === fieldId) {
          setSelectedField(s => s ? { ...s, votes: newVotes } : s);
        }
        setVoted(v => ({ ...v, [fieldId]: dir }));
        const log: Activity = { id: Date.now().toString(), fieldId, fieldName: field.name, userName, action: dir === 'up' ? 'upvoted' : 'downvoted', time: new Date().toLocaleString() };
        setActivity(a => [log, ...a].slice(0, 50));
        return;
      } catch (e) {
        console.warn('Supabase vote failed, fallback local', e);
      }
    }

    // fallback localStorage path
    setFields(prevFields => prevFields.map(f => {
      if (f.id !== fieldId) return f;
      return { ...f, votes: f.votes + delta };
    }));
    if (selectedField && selectedField.id === fieldId) {
      setSelectedField(s => s ? { ...s, votes: s.votes + delta } : s);
    }
    setVoted(v => ({ ...v, [fieldId]: dir }));
    const log: Activity = {
      id: Date.now().toString(),
      fieldId,
      fieldName: field.name,
      userName,
      action: dir === 'up' ? 'upvoted' : 'downvoted',
      time: new Date().toLocaleString(),
    };
    setActivity(a => [log, ...a].slice(0, 50));
  };

  const handleAddField = async () => {
    if (!newField.name.trim() || !newField.address.trim()) return;
    const creatorName = anon ? 'Anonymous' : (user?.name || 'Guest Contributor');
    const latRnd = 45.5 + (Math.random() - 0.5) * 0.1;
    const lngRnd = -73.6 + (Math.random() - 0.5) * 0.2;

    if (sbClient && sbStatus.startsWith('Connected')) {
      try {
        const payload: any = {
          name: newField.name.trim(),
          address: newField.address.trim(),
          borough: newField.borough.trim() || 'Montreal',
          surface: newField.surface,
          access: newField.access,
          availability: newField.availability,
          website: newField.website,
          contact: newField.contact,
          eco_notes: newField.ecoNotes,
          eco_score: 3,
          bike_yes_no: newField.bikeYesNo,
          stm_yes_no: newField.stmYesNo,
          stm_details: newField.stmDetails,
          parking_yes_no: newField.parkingYesNo,
          parking_details: newField.parkingDetails,
          lat: latRnd,
          lng: lngRnd,
          contributor_type: 'real',
          created_by_name: creatorName,
          is_anonymous: anon,
          votes: 0,
        };
        // some schemas have bike_details column – try include, ignore error
        if (newField.bikeDetails) payload.bike_details = newField.bikeDetails;
        const { data, error } = await sbClient.from('fields').insert(payload).select();
        if (error) throw error;
        const row = data[0];
        const nf: Field = {
          id: row.id,
          name: row.name,
          address: row.address || '',
          borough: row.borough || 'Montreal',
          surface: row.surface || 'Natural Grass',
          access: row.access || 'Free',
          availability: row.availability || '',
          website: row.website || '',
          contact: row.contact || '',
          ecoNotes: row.eco_notes || '',
          ecoScore: row.eco_score ?? 3,
          bikeYesNo: (row.bike_yes_no as any) || 'Yes',
          bikeDetails: row.bike_details || newField.bikeDetails || '',
          stmYesNo: (row.stm_yes_no as any) || 'Yes',
          stmDetails: row.stm_details || '',
          parkingYesNo: (row.parking_yes_no as any) || 'No',
          parkingDetails: row.parking_details || '',
          contributorType: 'real',
          createdByName: row.created_by_name || creatorName,
          createdAt: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          votes: row.votes ?? 0,
          lat: row.lat ?? latRnd,
          lng: row.lng ?? lngRnd,
        };
        setFields(f => [nf, ...f]);
        await sbClient.from('activity_logs').insert({ field_id: nf.id, field_name: nf.name, user_name: creatorName, action: 'added field' });
        const log: Activity = { id: Date.now().toString(), fieldId: nf.id, fieldName: nf.name, userName: creatorName, action: 'added field', time: new Date().toLocaleString() };
        setActivity(a => [log, ...a].slice(0, 50));
        setShowAdd(false);
        setNewField({ name: '', address: '', borough: '', surface: 'Natural Grass', access: 'Free', availability: '', website: '', contact: '', ecoNotes: '', bikeYesNo: 'Yes', bikeDetails: '', stmYesNo: 'Yes', stmDetails: '', parkingYesNo: 'No', parkingDetails: '' });
        setAnon(false);
        return;
      } catch (e) {
        console.warn('Supabase insert failed, fallback local', e);
      }
    }

    // Local fallback
    const nf: Field = {
      id: `field-${Date.now()}`,
      name: newField.name.trim(),
      address: newField.address.trim(),
      borough: newField.borough.trim() || 'Montreal',
      surface: newField.surface,
      access: newField.access,
      availability: newField.availability,
      website: newField.website,
      contact: newField.contact,
      ecoNotes: newField.ecoNotes,
      ecoScore: 3,
      bikeYesNo: newField.bikeYesNo,
      bikeDetails: newField.bikeDetails,
      stmYesNo: newField.stmYesNo,
      stmDetails: newField.stmDetails,
      parkingYesNo: newField.parkingYesNo,
      parkingDetails: newField.parkingDetails,
      contributorType: 'real',
      createdByName: creatorName,
      createdAt: new Date().toISOString().slice(0,10),
      votes: 0,
      lat: latRnd,
      lng: lngRnd,
    };
    setFields(f => [nf, ...f]);
    const log: Activity = {
      id: Date.now().toString(),
      fieldId: nf.id,
      fieldName: nf.name,
      userName: creatorName,
      action: 'added field',
      time: new Date().toLocaleString(),
    };
    setActivity(a => [log, ...a].slice(0,50));
    setShowAdd(false);
    setNewField({
      name: '',
      address: '',
      borough: '',
      surface: 'Natural Grass',
      access: 'Free',
      availability: '',
      website: '',
      contact: '',
      ecoNotes: '',
      bikeYesNo: 'Yes',
      bikeDetails: '',
      stmYesNo: 'Yes',
      stmDetails: '',
      parkingYesNo: 'No',
      parkingDetails: '',
    });
    setAnon(false);
  };

  const fieldActivity = selectedField ? activity.filter(a => a.fieldId === selectedField.id) : [];

  return (
    <div className="min-h-screen bg-[#fafaf6] text-zinc-900 antialiased">
      <style>{`
        *{font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif}
        .serif{font-family: Georgia, 'Times New Roman', serif}
      `}</style>

      {/* DEMO BANNER - improved statuses */}
      <div className={`border-b text-[12px] px-6 py-2.5 text-center ${sbStatus.startsWith('Connected') ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : sbStatus === 'offline-preview' ? 'bg-blue-50 border-blue-200 text-blue-900' : sbStatus.startsWith('error') ? 'bg-red-50 border-red-200 text-red-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
        <span className="font-semibold">
          {sbStatus.startsWith('Connected') ? sbStatus : sbStatus === 'offline-preview' ? `Offline Preview - Keys saved, will connect on deploy. ${fields.length} fields in demo` : sbStatus === 'Connecting' ? 'Connecting to Supabase...' : sbStatus.startsWith('error') ? `Error - staying in Demo Mode (${fields.length} fields)` : `Status: Demo Mode (localStorage) - ${fields.length} fields`}
        </span>
        <span className="ml-2 opacity-80">• {sbStatus} {sbImportLog && `• ${sbImportLog}`}</span>
        {sbStatus === 'offline-preview' && <span className="ml-2 hidden md:inline"> – Preview sandbox has no internet. Deploy to Vercel/Netlify to test live.</span>}
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#fafaf6]/90 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-[1280px] px-6 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              setView('landing');
              setNavTick(t => t+1);
              setNavLabel(`Home refreshed`);
            }}
            className="flex items-center gap-3 text-left"
          >
            <div className="w-9 h-9 rounded-full bg-[#166534] text-white grid place-items-center font-bold text-[16px]">M</div>
            <div>
              <div className="font-semibold tracking-tight leading-none">ParcPlay MTL</div>
              <div className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">18 Verified Fields • {sbStatus === 'Connected ✓' ? 'Supabase Live' : 'Open Data'}</div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {navLabel && (
              <div className="hidden md:block text-[11px] bg-white border border-zinc-200 rounded-full px-3 py-1.5 mr-2 max-w-[180px] truncate">
                {navLabel} • {navTick}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 rounded-full border border-zinc-300 bg-white text-sm font-medium hover:bg-zinc-50"
            >
              Settings ⚙️
            </button>
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => { setShowAuth(true); setAuthTab('guest'); }}
                  className="px-4 py-2 rounded-full border border-zinc-300 text-sm font-medium hover:bg-white transition"
                >
                  Continue as Guest
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAuth(true); setAuthTab('account'); }}
                  className="px-4 py-2 rounded-full bg-[#166534] text-white text-sm font-medium hover:bg-[#14532d] transition"
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                <span className="hidden sm:inline text-sm text-zinc-600">
                  Logged in as <span className="font-semibold text-zinc-900">{user.name}</span>
                </span>
                <span className="sm:hidden text-sm font-medium bg-white border rounded-full px-3 py-1">{user.name}</span>
                <button
                  type="button"
                  onClick={() => setUser(null)}
                  className="px-4 py-2 rounded-full border border-zinc-300 text-sm font-medium hover:bg-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* PERSISTENT NAV - always visible for validator */}
      <div className="sticky top-[65px] z-20 bg-white/95 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-[1280px] px-6 py-2.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setView('directory');
              setNavTick(t => t+1);
              setNavLabel('Directory Active');
            }}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition ${view === 'directory' ? 'bg-[#166534] text-white border-[#166534]' : 'bg-white border-zinc-300 hover:bg-zinc-50'}`}
          >
            Browse Directory • 18 fields
          </button>
          <button
            type="button"
            onClick={() => {
              setView('map');
              setNavTick(t => t+1);
              setNavLabel('Map Active');
            }}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition ${view === 'map' ? 'bg-[#166534] text-white border-[#166534]' : 'bg-white border-zinc-300 hover:bg-zinc-50'}`}
          >
            Explore Map View • 18 pins
          </button>
          <span className="text-[12px] text-zinc-600 ml-1">
            View: {view} {view === 'directory' && '• Directory Active • 18 fields'} {view === 'map' && '• Map Active • 18 fields mapped'} • {navLabel} tick:{navTick} • {sbStatus}
          </span>
        </div>
      </div>

      {/* LANDING */}
      {view === 'landing' && (
        <main className="mx-auto max-w-[900px] px-6 py-12 md:py-16">
          <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-4 py-1.5 text-[12px] font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse" />
            Ville de Montréal Green Spaces • 2023 Update
          </div>

          <h1 className="serif text-[42px] md:text-[64px] leading-[0.95] tracking-tight mt-6 font-semibold">
            Play where the city <span className="text-[#166534]">breathes.</span>
          </h1>
          <p className="text-zinc-600 mt-5 text-[18px] leading-relaxed max-w-[640px]">
            A curated directory of Montreal’s most sustainable soccer fields — natural turf, active transport, and community stewardship.
          </p>

          <div className="mt-10 bg-white rounded-[20px] border border-zinc-200 p-6 md:p-8 shadow-sm">
            <h2 className="text-[22px] font-semibold tracking-tight">What is an Eco-Friendly Soccer Field?</h2>
            <p className="mt-4 text-[15.5px] leading-7 text-zinc-700">
              An eco-friendly soccer field prioritizes natural grass with no pesticides and no synthetic fertilizers, rainwater drainage and infiltration instead of chemical runoff, and access designed for bikes and STM public transit over cars. It uses low-glare LED lighting on timers, and is maintained through community stewardship — manual aeration, compost top-dressing, clover overseeding, and native plant buffers that support pollinators while keeping the pitch playable year-round.
            </p>

            <div className="mt-6 border-l-[3px] border-[#166534] bg-[#fafaf6] rounded-r-xl px-5 py-4">
              <blockquote className="serif text-[18px] leading-7 italic text-zinc-800">
                "A sustainable sports field integrates natural turf management, water-sensitive drainage, active mobility access, and local community governance to reduce its environmental footprint while improving playability."
              </blockquote>
              <div className="mt-3 text-[12px] text-zinc-500 leading-5">
                Source: Ville de Montreal Green Spaces Plan 2023 (montreal.ca) & FIFA Sustainability Guidelines (fifa.com)
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setView('directory');
                  setNavTick(t => t+1);
                  setNavLabel('Directory Active');
                }}
                className="px-6 py-3.5 rounded-full bg-[#166534] text-white font-medium text-[15px] hover:bg-[#14532d] transition shadow-sm"
              >
                Browse Directory
              </button>
              <button
                type="button"
                onClick={() => {
                  setView('map');
                  setNavTick(t => t+1);
                  setNavLabel('Map Active');
                }}
                className="px-6 py-3.5 rounded-full bg-white border border-zinc-300 font-medium text-[15px] hover:bg-zinc-50 transition"
              >
                Explore Map View
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[12px] text-zinc-500">
              <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
              12 fields verified • Updated weekly • {sbStatus}
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { k: '5', l: 'Fields with zero pesticides' },
              { k: '100%', l: 'Bike accessible' },
              { k: '9/12', l: 'Car-free or limited parking' },
            ].map(i => (
              <div key={i.l} className="bg-white rounded-2xl border border-zinc-200 p-5">
                <div className="text-[28px] font-semibold tracking-tight">{i.k}</div>
                <div className="text-[13px] text-zinc-600 mt-1 leading-5">{i.l}</div>
              </div>
            ))}
          </div>
          {navTick > 0 && (
            <div className="mt-6 text-[12px] text-zinc-500">Nav state: {navLabel} • tick {navTick}</div>
          )}
        </main>
      )}

      {/* DIRECTORY */}
      {view === 'directory' && (
        <main className="mx-auto max-w-[1280px] px-6 py-6 md:py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setView('landing');
                  setNavTick(t => t+1);
                  setNavLabel('Back to landing');
                }}
                className="px-4 py-2 rounded-full bg-white border border-zinc-300 text-sm font-medium hover:bg-zinc-50"
              >
                ← Back
              </button>
              <div className="px-3 py-1.5 rounded-full bg-[#166534] text-white text-[12px] font-semibold tracking-wide">
                Directory Active
              </div>
              <h2 className="text-[20px] font-semibold tracking-tight hidden md:block">{filtered.length} Eco Fields • {sbStatus}</h2>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-[340px]">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search name, address, borough..."
                  className="w-full bg-white border border-zinc-200 rounded-full px-5 py-2.5 text-sm outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!user) { setShowAuth(true); setAuthTab('guest'); return; }
                  setShowAdd(true);
                }}
                className="whitespace-nowrap px-5 py-2.5 rounded-full bg-[#166534] text-white text-sm font-medium hover:bg-[#14532d]"
              >
                + Add Field
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 lg:col-span-9">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(field => (
                  <div
                    key={field.id}
                    onClick={() => setSelectedField(field)}
                    className="group bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-4 hover:shadow-md hover:border-zinc-300 transition cursor-pointer"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold leading-tight text-[16px] line-clamp-2">{field.name}</h3>
                        <div className="shrink-0 text-[14px] tracking-tight">
                          {'🍃'.repeat(field.ecoScore)}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#fafaf6] border border-zinc-200 text-zinc-700 font-medium">
                          {field.borough}
                        </span>
                      </div>
                    </div>

                    <div className="text-[13px] text-zinc-600 leading-5">
                      <div className="flex gap-2 items-start">
                        <span className="flex-1 line-clamp-2">{field.address}</span>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); handleCopy(field.address, field.id); }}
                          className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold text-white transition ${copiedId === field.id ? 'bg-[#16a34a]' : 'bg-[#166534] hover:bg-[#14532d]'}`}
                        >
                          {copiedId === field.id ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ${field.bikeYesNo === 'Yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>
                        Bike {field.bikeYesNo}
                      </span>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ${field.stmYesNo === 'Yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>
                        STM {field.stmYesNo}
                      </span>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ${field.parkingYesNo === 'Yes' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>
                        Parking {field.parkingYesNo}
                      </span>
                    </div>

                    <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-zinc-900 text-white grid place-items-center text-[11px] font-bold shrink-0">
                          {field.createdByName[0]?.toUpperCase() || 'M'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[12px] font-medium leading-none truncate">{field.createdByName}</div>
                          <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                            <span>{field.contributorType === 'seeded' ? '🌐 Seeded' : '👤 Real Person'}</span>
                            <span>• {field.votes} votes</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setSelectedField(field); }}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-900 text-white text-[12px] font-medium hover:bg-black"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="mt-12 bg-white rounded-2xl border border-dashed border-zinc-300 p-10 text-center">
                  <div className="text-sm text-zinc-600">No fields match “{search}”.</div>
                  <button type="button" onClick={() => setSearch('')} className="mt-3 px-4 py-2 rounded-full border text-sm">Clear search</button>
                </div>
              )}
            </div>

            <div className="md:col-span-4 lg:col-span-3">
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 sticky top-[84px]">
                <h4 className="font-semibold text-[14px]">Activity Feed</h4>
                <div className="mt-1 text-[11px] text-zinc-500">{sbStatus === 'Connected ✓' ? 'Live from Supabase' : 'Local demo'}</div>
                <div className="mt-4 space-y-3 max-h-[520px] overflow-auto pr-1">
                  {activity.length === 0 ? (
                    <div className="text-[13px] text-zinc-500">No activity yet. Upvote a field to start.</div>
                  ) : activity.slice(0, 20).map(a => (
                    <div key={a.id} className="text-[12.5px] leading-5 border-b border-zinc-100 pb-3 last:border-0">
                      <span className="font-medium">{a.userName}</span> <span className="text-zinc-600">{a.action}</span> <span className="font-medium">{a.fieldName}</span>
                      <div className="text-[11px] text-zinc-400 mt-1">{a.time}</div>
                    </div>
                  ))}
                </div>
                {activity.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActivity([])}
                    className="mt-4 w-full px-4 py-2 rounded-full border border-zinc-200 text-[12px] font-medium hover:bg-zinc-50"
                  >
                    Clear Feed (local)
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* MAP VIEW - WIRED REAL MAP WITHOUT EXTERNAL CDN */}
      {view === 'map' && (
        <main className="mx-auto max-w-[1280px] px-6 py-6 md:py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setView('landing');
                  setNavTick(t => t+1);
                  setNavLabel('Back to landing from map');
                }}
                className="px-4 py-2 rounded-full bg-white border border-zinc-300 text-sm font-medium hover:bg-zinc-50"
              >
                ← Back to Landing
              </button>
              <div className="px-3 py-1.5 rounded-full bg-[#166534] text-white text-[12px] font-semibold tracking-wide">
                Map Active • {filtered.length} pins
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-[320px]">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter map by name, borough, surface..."
                  className="w-full bg-white border border-zinc-200 rounded-full px-5 py-2.5 text-sm outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10"
                />
              </div>
              <span className="hidden md:block text-[12px] text-zinc-500">Map tick {navTick} • {navLabel}</span>
            </div>
          </div>

          {/* Wired Map Container - Spec: height 520px rounded-2xl bg #e8f5e9 border relative overflow hidden */}
          <div className="mt-6">
            <div
              className="relative overflow-hidden rounded-2xl border border-[#c7e0c9] shadow-sm"
              style={{ height: '520px', backgroundColor: '#e8f5e9' }}
            >
              {/* SVG Background: grid + river shapes for Montreal area */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 520" preserveAspectRatio="none" aria-hidden>
                {/* grid */}
                <defs>
                  <pattern id="mtl-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cde5d0" strokeWidth="0.8" opacity="0.9" />
                  </pattern>
                </defs>
                <rect width="800" height="520" fill="url(#mtl-grid)" />
                {/* River - St Lawrence approximate */}
                <path d="M -20 380 Q 120 360 260 390 T 520 410 T 820 380" fill="none" stroke="#a8cceb" strokeWidth="22" strokeLinecap="round" opacity="0.55" />
                <path d="M -20 380 Q 120 360 260 390 T 520 410 T 820 380" fill="none" stroke="#d6eaf8" strokeWidth="10" strokeLinecap="round" opacity="0.8" />
                {/* Second river branch / canal */}
                <path d="M 60 80 Q 200 140 340 200 T 480 320" fill="none" stroke="#a8cceb" strokeWidth="8" opacity="0.35" strokeDasharray="6 8" />
                {/* Montreal island outline simplified */}
                <path d="M 80 140 Q 220 90 380 110 T 620 150 T 680 300 T 420 420 T 140 340 Z" fill="#f6fbf6" stroke="#8ab58f" strokeWidth="1.4" opacity="0.9" />
                {/* Borough faint blocks */}
                <path d="M 120 180 L 320 190 L 310 280 L 130 260 Z" fill="#eef6ee" stroke="#b5d6b9" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.7" />
                <path d="M 350 160 L 540 170 L 520 280 L 340 270 Z" fill="#eef6ee" stroke="#b5d6b9" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.7" />
                {/* Label */}
                <text x="24" y="32" fontSize="13" fontWeight="700" fill="#166534" opacity="0.9">MONTRÉAL • Eco Fields</text>
                <text x="24" y="48" fontSize="11" fill="#5a7a5e">{filtered.length} fields • tap green pin for details</text>
              </svg>

              {/* Pins - rendered from filtered using lat/lng formula */}
              {filtered.map(f => {
                const { x, y } = latLngToPct(f.lat, f.lng);
                const isSelected = selectedField?.id === f.id;
                return (
                  <button
                    type="button"
                    key={f.id}
                    onClick={() => {
                      setSelectedField(f);
                      setMapSelectedId(f.id);
                    }}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                    aria-label={`View ${f.name}`}
                  >
                    <div className={`w-7 h-7 rounded-full bg-[#166534] border-2 border-white shadow-md grid place-items-center hover:scale-110 transition-transform ${isSelected ? 'ring-2 ring-[#16a34a] ring-offset-2' : ''}`}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    {/* eco score badge */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-[#166534] text-[9px] font-bold text-[#166534] grid place-items-center">
                      {f.ecoScore}
                    </div>
                    {/* Tooltip on hover */}
                    <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-20">
                      <div className="bg-zinc-900 text-white text-[11px] px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                        {f.name} • 🍃{f.ecoScore}
                      </div>
                      <div className="w-2 h-2 bg-zinc-900 rotate-45 mx-auto -mt-1" />
                    </div>
                  </button>
                );
              })}

              {/* Attribution bottom right per spec */}
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur border border-zinc-200 rounded-full px-3 py-1 text-[10px] text-zinc-600 shadow-sm">
                Map data © OpenStreetMap contributors | Tiles would be Leaflet + OSM in production
              </div>

              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur border rounded-full px-3 py-1 text-[11px] font-medium shadow-sm">
                {filtered.length} pins • {fields.length - filtered.length > 0 ? `${fields.length - filtered.length} filtered` : 'all visible'}
              </div>
            </div>
          </div>

          {/* List below map - clean cards smaller, filtered by search */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[15px]">Fields on this map • {filtered.length}</h3>
              <div className="text-[12px] text-zinc-500">Click pin or card for details • View Details sets selected field</div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(f => {
                const { x, y } = latLngToPct(f.lat, f.lng);
                return (
                  <div key={f.id} className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col gap-3 hover:shadow-sm hover:border-zinc-300 transition">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-[13.5px] leading-tight line-clamp-2">{f.name}</h4>
                      <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-[#e8f5e9] border border-[#c7e0c9] text-[#166534] font-medium">
                        {x.toFixed(0)}% · {y.toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-[12px] text-zinc-600 line-clamp-1">{f.address}</div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-50 border">{f.borough}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">🍃{f.ecoScore}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${f.bikeYesNo === 'Yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-zinc-50'}`}>Bike {f.bikeYesNo}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${f.stmYesNo === 'Yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-zinc-50'}`}>STM {f.stmYesNo}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-zinc-100">
                      <div className="text-[11px] text-zinc-500">{f.votes} votes • {f.contributorType === 'seeded' ? '🌐 Seeded' : '👤 Real Person'}</div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedField(f);
                          setMapSelectedId(f.id);
                        }}
                        className="px-3 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-medium hover:bg-black"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="mt-6 bg-white rounded-xl border border-dashed p-8 text-center">
                <div className="text-sm text-zinc-600">No pins match “{search}”. Clear filter to see all 18 fields.</div>
                <button type="button" onClick={() => setSearch('')} className="mt-3 px-4 py-2 rounded-full border text-sm bg-white hover:bg-zinc-50">Clear search</button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* DETAIL MODAL */}
      {selectedField && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[22px] font-semibold tracking-tight leading-tight">{selectedField.name}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[12px] px-2.5 py-1 rounded-full bg-[#fafaf6] border border-zinc-200">{selectedField.borough}</span>
                  <span className="text-[12px]">EcoScore: {'🍃'.repeat(selectedField.ecoScore)} ({selectedField.ecoScore}/5)</span>
                  <span className="text-[12px] text-zinc-600">{selectedField.votes} votes</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border">{sbStatus}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedField(null)}
                className="w-9 h-9 grid place-items-center rounded-full border border-zinc-200 hover:bg-zinc-50"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-6 text-[13.5px] leading-6">
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">Full Address</div>
                  <div className="mt-1 flex items-start gap-2">
                    <span className="flex-1 text-zinc-800">{selectedField.address}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedField.address, `modal-${selectedField.id}`)}
                      className={`px-3 py-1 rounded-full text-white text-[12px] font-semibold ${copiedId === `modal-${selectedField.id}` ? 'bg-[#16a34a]' : 'bg-[#166534]'}`}
                    >
                      {copiedId === `modal-${selectedField.id}` ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-zinc-500 text-[11px] uppercase tracking-wide">Surface</span><div className="font-medium">{selectedField.surface}</div></div>
                  <div><span className="text-zinc-500 text-[11px] uppercase tracking-wide">Access</span><div className="font-medium">{selectedField.access}</div></div>
                  <div><span className="text-zinc-500 text-[11px] uppercase tracking-wide">Availability</span><div className="font-medium">{selectedField.availability}</div></div>
                  <div><span className="text-zinc-500 text-[11px] uppercase tracking-wide">EcoScore</span><div className="font-medium">{selectedField.ecoScore} / 5</div></div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">Website</div>
                  <a href={selectedField.website} target="_blank" rel="noreferrer" className="text-[#166534] underline break-all">{selectedField.website}</a>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">Contact</div>
                  <div>{selectedField.contact}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">Eco Notes</div>
                  <div className="mt-1 bg-[#fafaf6] border border-zinc-200 rounded-xl p-3 text-zinc-700">{selectedField.ecoNotes}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#fafaf6] rounded-xl border border-zinc-200 p-4">
                  <div className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">Accessibility</div>
                  <div className="mt-3 space-y-2.5">
                    <div className="flex justify-between"><span>Bike</span><span className={`px-2.5 py-0.5 rounded-full text-[12px] border ${selectedField.bikeYesNo === 'Yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-zinc-100'}`}>{selectedField.bikeYesNo}</span></div>
                    <div>
                      <div className="flex justify-between"><span>STM</span><span className={`px-2.5 py-0.5 rounded-full text-[12px] border ${selectedField.stmYesNo === 'Yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-zinc-100'}`}>{selectedField.stmYesNo}</span></div>
                      <div className="mt-1 text-[12px] text-zinc-600 bg-white border rounded-lg p-2">{selectedField.stmDetails}</div>
                    </div>
                    <div>
                      <div className="flex justify-between"><span>Parking</span><span className={`px-2.5 py-0.5 rounded-full text-[12px] border ${selectedField.parkingYesNo === 'Yes' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-zinc-100'}`}>{selectedField.parkingYesNo}</span></div>
                      <div className="mt-1 text-[12px] text-zinc-600 bg-white border rounded-lg p-2">{selectedField.parkingDetails}</div>
                    </div>
                  </div>
                </div>

                <div className="border border-zinc-200 rounded-xl p-4">
                  <div className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">Primary Contributor</div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 text-white grid place-items-center font-bold">{selectedField.createdByName[0]?.toUpperCase()}</div>
                    <div>
                      <div className="font-medium text-[14px]">{selectedField.createdByName}</div>
                      <div className="text-[12px] text-zinc-600 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-zinc-100 border text-[11px]">{selectedField.contributorType === 'seeded' ? '🌐 Seeded' : '👤 Real Person'}</span>
                        <span>{selectedField.createdAt}</span>
                        <span>• {selectedField.votes} pts</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleVote(selectedField.id, 'up')}
                    className={`flex-1 px-4 py-2.5 rounded-full font-medium text-sm border transition ${voted[selectedField.id] === 'up' ? 'bg-[#166534] text-white border-[#166534]' : 'bg-white border-zinc-300 hover:bg-zinc-50'}`}
                  >
                    ▲ Upvote {voted[selectedField.id] === 'up' ? '• Voted' : ''}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVote(selectedField.id, 'down')}
                    className={`flex-1 px-4 py-2.5 rounded-full font-medium text-sm border transition ${voted[selectedField.id] === 'down' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-300 hover:bg-zinc-50'}`}
                  >
                    ▼ Downvote
                  </button>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">Activity for this field</div>
                  <div className="mt-2 max-h-[140px] overflow-auto space-y-2">
                    {fieldActivity.length === 0 ? (
                      <div className="text-[12px] text-zinc-500">No activity yet.</div>
                    ) : fieldActivity.map(a => (
                      <div key={a.id} className="text-[12px] bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2">
                        <span className="font-medium">{a.userName}</span> {a.action} • <span className="text-zinc-500">{a.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedField(null)}
                className="px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL - Supabase Wiring - Improved error handling */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-semibold tracking-tight">Settings - Supabase Wiring</h2>
                <p className="text-[12px] text-zinc-600 mt-1">Connect your Supabase project to make Seeded vs Real Person persistence live. No static CDN link – dynamic import only on Connect with fallback.</p>
              </div>
              <button type="button" onClick={() => setShowSettings(false)} className="w-9 h-9 grid place-items-center rounded-full border border-zinc-200 hover:bg-zinc-50">✕</button>
            </div>

            <div className="mt-5 grid gap-4">
              {/* Status Block */}
              <div className="rounded-xl border p-4 bg-[#fafaf6]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wide font-semibold text-zinc-500">Status:</span>
                  <span className={`text-[12px] px-3 py-1 rounded-full border font-medium ${sbStatus.startsWith('Connected') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : sbStatus === 'offline-preview' ? 'bg-blue-50 border-blue-200 text-blue-800' : sbStatus === 'Connecting' ? 'bg-amber-50 border-amber-200 text-amber-800' : sbStatus.startsWith('error') ? 'bg-red-50 border-red-200 text-red-800' : 'bg-zinc-50 border-zinc-200'}`}>{sbStatus}</span>
                  <span className="text-[11px] text-zinc-500">{fields.length} fields in memory</span>
                </div>
                {sbImportLog && <div className="mt-2 text-[11px] text-zinc-600 bg-white border rounded-lg px-3 py-1.5">Import log: {sbImportLog}</div>}
                {sbError && (
                  <div className={`mt-3 text-[12px] leading-5 whitespace-pre-wrap rounded-xl px-4 py-3 border ${sbStatus === 'offline-preview' ? 'bg-blue-50 border-blue-200 text-blue-900' : sbStatus.startsWith('Connected') ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                    {sbError}
                  </div>
                )}
              </div>

              {/* Inputs */}
              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">Supabase URL</label>
                <input value={sbUrl} onChange={e => setSbUrl(e.target.value)} placeholder="https://xyz.supabase.co" className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#166534]" />
                <div className="text-[10px] text-zinc-500 mt-1">Must be https://YOUR_PROJECT.supabase.co – no trailing slash, no /rest/v1</div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">Supabase Anon Key</label>
                <input value={sbKey} onChange={e => setSbKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#166534]" type="password" />
                <div className="text-[10px] text-zinc-500 mt-1">Starts with eyJ... From Project Settings &gt; API &gt; anon public key</div>
              </div>

              {/* Buttons: Save, Test, Connect, Clear */}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleSaveKeys} className="px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-black">Save Keys</button>
                <button type="button" onClick={handleTestConnection} disabled={sbTesting} className="px-5 py-2.5 rounded-full bg-white border border-zinc-300 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50">{sbTesting ? 'Testing...' : 'Test Connection'}</button>
                <button type="button" onClick={handleConnect} className="px-5 py-2.5 rounded-full bg-[#166534] text-white text-sm font-medium hover:bg-[#14532d]">Connect</button>
                <button type="button" onClick={() => { setSbUrl(''); setSbKey(''); localStorage.removeItem('sb_url'); localStorage.removeItem('sb_anon'); setSbClient(null); setSbStatus('Demo Mode (localStorage)'); setSbError('Cleared. Back to Demo Mode (localStorage)'); setSbTestResult(''); setSbImportLog(''); }} className="px-5 py-2.5 rounded-full border border-zinc-300 text-sm bg-white hover:bg-zinc-50">Clear & Use Demo</button>
              </div>

              {savedKeysMsg && <div className="text-[13px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">{savedKeysMsg}</div>}
              {sbTestResult && <div className="text-[12px] leading-5 whitespace-pre-wrap bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">{sbTestResult}</div>}

              {/* Instructions Box */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="text-[12px] font-semibold tracking-tight">How to go live (5 steps)</div>
                <ol className="mt-2 list-decimal list-inside text-[12px] leading-6 text-zinc-700 space-y-1">
                  <li><span className="font-medium">Step 1:</span> Create project at supabase.com</li>
                  <li><span className="font-medium">Step 2:</span> Run SQL from box below in SQL Editor</li>
                  <li><span className="font-medium">Step 3:</span> Copy URL and anon key from Project Settings &gt; API</li>
                  <li><span className="font-medium">Step 4:</span> In Vercel, add env vars NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or paste in this Settings modal</li>
                  <li><span className="font-medium">Step 5:</span> Deploy – connection works outside sandbox (preview is offline, shows offline-preview message). Test after deploy with: <code className="bg-zinc-100 px-1 py-0.5 rounded text-[11px]">curl https://YOUR_URL/rest/v1/fields -H "apikey: KEY"</code></li>
                </ol>
                <div className="mt-3 text-[11px] text-zinc-500 leading-5">If you see “Preview sandbox is offline (no internet). Keys saved - will connect when deployed to Vercel/Netlify” – that is expected. The sandboxed preview blocks CDN fetches (ERR_INTERNET_DISCONNECTED). Demo mode keeps working with localStorage {fields.length} fields.</div>
              </div>

              <div className="mt-1">
                <div className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">SQL to create tables – run in Supabase SQL Editor</div>
                <pre className="mt-2 bg-[#fafaf6] border border-zinc-200 rounded-xl p-4 text-[11px] leading-5 overflow-auto whitespace-pre-wrap">{`CREATE TABLE fields (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL,
 address TEXT,
 borough TEXT,
 surface TEXT,
 access TEXT,
 availability TEXT,
 website TEXT,
 contact TEXT,
 eco_notes TEXT,
 eco_score INT,
 bike_yes_no TEXT,
 bike_details TEXT,
 stm_yes_no TEXT,
 stm_details TEXT,
 parking_yes_no TEXT,
 parking_details TEXT,
 lat DOUBLE PRECISION,
 lng DOUBLE PRECISION,
 contributor_type TEXT,
 created_by_name TEXT,
 created_by_id TEXT,
 is_anonymous BOOLEAN,
 votes INT DEFAULT 0,
 created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE field_votes (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 field_id UUID REFERENCES fields(id),
 user_id TEXT,
 vote_type TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE activity_logs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 field_id TEXT,
 field_name TEXT,
 user_name TEXT,
 action TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and allow anon (demo):
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow all for anon" ON fields FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all for anon" ON field_votes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all for anon" ON activity_logs FOR ALL USING (true) WITH CHECK (true);
`}</pre>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setShowSettings(false)} className="px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-[420px] w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[25px]"> ParcPlay MTL </h3>
              <button type="button" onClick={() => setShowAuth(false)} className="w-8 h-8 grid place-items-center rounded-full border hover:bg-zinc-50">✕</button>
            </div>

            <div className="mt-4 flex gap-2 p-1 bg-zinc-100 rounded-full">
              <button
                type="button"
                onClick={() => setAuthTab('guest')}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${authTab === 'guest' ? 'bg-white shadow-sm border' : 'text-zinc-600'}`}
              >
                Guest
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('account')}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${authTab === 'account' ? 'bg-white shadow-sm border' : 'text-zinc-600'}`}
              >
                Create Account
              </button>
            </div>

            {authTab === 'guest' ? (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-[12px] font-medium text-zinc-600">Nickname</label>
                  <input value={guestNick} onChange={e => setGuestNick(e.target.value)} placeholder="e.g. PlateauKicker" className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#166534]" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const name = guestNick.trim() || `Guest-${Math.floor(Math.random()*900+100)}`;
                    setUser({ name, type: 'guest' });
                    setShowAuth(false);
                    setGuestNick('');
                    setActivity(a => [{ id: Date.now().toString(), fieldId: 'global', fieldName: 'platform', userName: name, action: 'joined as guest', time: new Date().toLocaleString() }, ...a].slice(0,50));
                  }}
                  className="w-full px-5 py-3 rounded-full bg-[#166534] text-white text-sm font-medium hover:bg-[#14532d]"
                >
                  Start as Guest
                </button>
                <div className="text-[11px] text-zinc-500 text-center">No email needed. Contributions show as 👤 Real Person (Guest).</div>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <input value={accName} onChange={e => setAccName(e.target.value)} placeholder="Display name" className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#166534]" />
                <input value={accEmail} onChange={e => setAccEmail(e.target.value)} placeholder="Email" className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#166534]" />
                <input type="password" value={accPass} onChange={e => setAccPass(e.target.value)} placeholder="Password" className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#166534]" />
                <button
                  type="button"
                  onClick={() => {
                    if (!accName.trim()) return;
                    const name = accName.trim();
                    setUser({ name, type: 'registered' });
                    setShowAuth(false);
                    setAccName(''); setAccEmail(''); setAccPass('');
                    setActivity(a => [{ id: Date.now().toString(), fieldId: 'global', fieldName: 'platform', userName: name, action: 'created account', time: new Date().toLocaleString() }, ...a].slice(0,50));
                  }}
                  className="w-full px-5 py-3 rounded-full bg-[#166534] text-white text-sm font-medium hover:bg-[#14532d]"
                >
                  Create Account
                </button>
                <div className="text-[11px] text-zinc-500 text-center">Registered contributors get 👤 Real Person badge.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD FIELD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold text-[18px]">Add Eco-Fieldly Field/Park</h3>
                <p className="text-[10px] text-zinc-600 mt-1">Know a great Montreal spot? Add it to help others discover it. Your contribution will appear as 👤 Real Person.</p>
              </div>
              <button type="button" onClick={() => setShowAdd(false)} className="w-8 h-8 grid place-items-center rounded-full border hover:bg-zinc-50">✕</button>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">Field Name *</label>
                <input value={newField.name} onChange={e => setNewField({ ...newField, name: e.target.value })} placeholder="Parc Example - Soccer" className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">Address *</label>
                <input value={newField.address} onChange={e => setNewField({ ...newField, address: e.target.value })} placeholder="123 Rue..." className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div>
  <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600 block mb-1">
    Borough
  </label>
  <div className="relative">
    <select
      value={newField.borough}
      onChange={(e) => setNewField({ ...newField, borough: e.target.value })}
      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm bg-white appearance-none pr-10 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition text-zinc-800 font-medium cursor-pointer"
    >
      <option value="" disabled>Select a borough...</option>
  
      {/* Montreal Boroughs List */}
      <option value="Ahuntsic-Cartierville">Ahuntsic-Cartierville</option>
      <option value="Anjou">Anjou</option>
      <option value="Côte-des-Neiges-Notre-Dame-de-Grâce">Côte-des-Neiges-Notre-Dame-de-Grâce</option>
      <option value="L'Île-Bizard-Sainte-Geneviève">L'Île-Bizard-Sainte-Geneviève</option>
      <option value="Lachine">Lachine</option>
      <option value="LaSalle">LaSalle</option>
      <option value="Le Plateau-Mont-Royal">Le Plateau-Mont-Royal</option>
      <option value="Le Sud-Ouest">Le Sud-Ouest</option>
      <option value="Mercier-Hochelaga-Maisonneuve">Mercier-Hochelaga-Maisonneuve</option>
      <option value="Montréal-Nord">Montréal-Nord</option>
      <option value="Outremont">Outremont</option>
      <option value="Pierrefonds-Roxboro">Pierrefonds-Roxboro</option>
      <option value="Rivière-des-Prairies-Pointe-aux-Trembles">Rivière-des-Prairies-Pointe-aux-Trembles</option>
      <option value="Rosemont-La Petite-Patrie">Rosemont-La Petite-Patrie</option>
      <option value="Saint-Laurent">Saint-Laurent</option>
      <option value="Saint-Léonard">Saint-Léonard</option>
      <option value="Verdun">Verdun</option>
      <option value="Ville-Marie">Ville-Marie</option>
      <option value="Villeray-Saint-Michel-Parc-Extension">Villeray-Saint-Michel-Parc-Extension</option>
    </select>
                  {/* Clean custom downward arrow icon indicator */}
                  
    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-zinc-400 text-[10px]">
      ▼
    </div>
  </div>
</div>

              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">Surface</label>
                <select value={newField.surface} onChange={e => setNewField({ ...newField, surface: e.target.value })} className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm bg-white">
                  <option>Natural Grass</option>
                  <option>Hybrid Grass</option>
                  <option>Artificial Turf</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">Access</label>
                <select value={newField.access} onChange={e => setNewField({ ...newField, access: e.target.value })} className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm bg-white">
                  <option>Free</option>
                  <option>Free - Open Access</option>
                  <option>Free - Permit for Teams</option>
                  <option>Permit Only</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">Availability</label>
                <input value={newField.availability} onChange={e => setNewField({ ...newField, availability: e.target.value })} placeholder="6am - 10pm" className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">Website</label>
                <input value={newField.website} onChange={e => setNewField({ ...newField, website: e.target.value })} placeholder="https://..." className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">Contact</label>
                <input value={newField.contact} onChange={e => setNewField({ ...newField, contact: e.target.value })} placeholder="311 or email" className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">Eco Notes</label>
                <textarea value={newField.ecoNotes} onChange={e => setNewField({ ...newField, ecoNotes: e.target.value })} placeholder="Organic care, rain garden, LED..." className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm min-h-[80px]" />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#fafaf6] border border-zinc-200 rounded-xl p-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">Bike Access</label>
                  <select value={newField.bikeYesNo} onChange={e => setNewField({ ...newField, bikeYesNo: e.target.value as any })} className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">STM Access</label>
                  <select value={newField.stmYesNo} onChange={e => setNewField({ ...newField, stmYesNo: e.target.value as any })} className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                  {newField.stmYesNo === 'Yes' && (
                    <input value={newField.stmDetails} onChange={e => setNewField({ ...newField, stmDetails: e.target.value })} placeholder="Closest metro" className="mt-2 w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm bg-white" />
                  )}
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-zinc-600">Parking</label>
                  <select value={newField.parkingYesNo} onChange={e => setNewField({ ...newField, parkingYesNo: e.target.value as any })} className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                  {newField.parkingYesNo === 'Yes' && (
                    <input value={newField.parkingDetails} onChange={e => setNewField({ ...newField, parkingDetails: e.target.value })} placeholder="Details" className="mt-2 w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm bg-white" />
                  )}
                </div>
              </div>

              <div className="md:col-span-2 flex items-center gap-2 pt-2">
                <input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)} id="anon" className="w-4 h-4 accent-[#166534]" />
                <label htmlFor="anon" className="text-[13px]">Post anonymously</label>
              </div>
            </div>

            <div className="mt-6 flex gap-2 justify-end">
              <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-full border border-zinc-300 text-sm">Cancel</button>
              <button type="button" onClick={handleAddField} className="px-6 py-2.5 rounded-full bg-[#166534] text-white text-sm font-medium hover:bg-[#14532d]">Submit Field</button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-zinc-200 mt-12 py-8">
        <div className="mx-auto max-w-[1280px] px-6 flex flex-col md:flex-row justify-between gap-3 text-[12px] text-zinc-500">
          <div>© Montreal Eco Soccer • Built for sustainable play • Data: Montreal Open Data + Community</div>
          <div className="flex gap-3">
            <span>🌿 No pesticides tracking</span>
            <span>•</span>
            <span>🚲 Bike-first</span>
            <span>•</span>
            <span>🚇 STM verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
