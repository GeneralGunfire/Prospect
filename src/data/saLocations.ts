export interface LocationData {
  [province: string]: {
    [city: string]: string[];
  };
}

export const SA_LOCATIONS: LocationData = {
  Gauteng: {
    Johannesburg: [
      'Sandton', 'Randburg', 'Roodepoort', 'Soweto', 'Midrand', 'Fourways',
      'Braamfontein', 'Maboneng', 'Melville', 'Northcliff', 'Parktown',
      'Rosebank', 'Auckland Park', 'Eldorado Park', 'Orange Farm', 'Diepsloot',
      'Alexandra', 'Wynberg', 'Lenasia', 'Ennerdale',
    ],
    Pretoria: [
      'Hatfield', 'Sunnyside', 'Brooklyn', 'Centurion', 'Menlyn', 'Arcadia',
      'Silverton', 'Gezina', 'Wonderboom', 'Mamelodi', 'Atteridgeville',
      'Garsfontein', 'Lynnwood', 'Faerie Glen', 'Montana', 'Pretoria North',
    ],
    Ekurhuleni: [
      'Germiston', 'Boksburg', 'Benoni', 'Brakpan', 'Springs', 'Alberton',
      'Kempton Park', 'Edenvale', 'Bedfordview', 'Tembisa', 'Daveyton',
      'Katlehong', 'Vosloorus', 'Thokoza',
    ],
    'West Rand': [
      'Krugersdorp', 'Randfontein', 'Westonaria', 'Carletonville',
      'Mogale City', 'Kagiso', 'Munsieville',
    ],
    Sedibeng: [
      'Vereeniging', 'Vanderbijlpark', 'Meyerton', 'Evaton', 'Sebokeng',
      'Sharpeville', 'Boipatong',
    ],
  },
  'Western Cape': {
    'Cape Town': [
      'City Bowl', 'Sea Point', 'Green Point', 'Camps Bay', 'Hout Bay',
      'Constantia', 'Claremont', 'Rondebosch', 'Observatory', 'Woodstock',
      'Salt River', 'Parow', 'Bellville', 'Goodwood', 'Mitchells Plain',
      'Khayelitsha', 'Gugulethu', 'Langa', 'Athlone', 'Wynberg',
      'Simonstown', 'Fish Hoek', 'Muizenberg', 'Strand', 'Somerset West',
      'Milnerton', 'Blouberg', 'Tableview', 'Durbanville',
    ],
    Stellenbosch: [
      'Stellenbosch Central', 'Franschhoek', 'Pniel', 'Kylemore', 'Cloetesville',
      'Idas Valley', 'Jamestown',
    ],
    George: [
      'George Central', 'Pacaltsdorp', 'Thembalethu', 'Wilderness', 'Heather Park',
      'Blanco', 'Lawaaikamp',
    ],
    Paarl: [
      'Paarl Central', 'Wellington', 'Dal Josaphat', 'Mbekweni', 'Klein Drakenstein',
    ],
    Knysna: [
      'Knysna Central', 'Sedgefield', 'Rheenendal', 'Nekkies', 'Concordia',
    ],
    'Mossel Bay': [
      'Mossel Bay Central', 'George Road', 'Hartenbos', 'Dana Bay', 'Great Brak River',
    ],
    Worcester: [
      'Worcester Central', 'Rawsonville', 'Touwsrivier', 'De Doorns', 'Hex River Valley',
    ],
  },
  'KwaZulu-Natal': {
    Durban: [
      'Berea', 'Musgrave', 'Glenwood', 'Umbilo', 'Bluff', 'Bayview',
      'Chatsworth', 'Phoenix', 'KwaMashu', 'Umlazi', 'Pinetown',
      'Westville', 'Hillcrest', 'Amanzimtoti', 'Umhlanga', 'La Lucia',
      'Ballito', 'Morningside', 'Overport', 'Sydenham',
    ],
    Pietermaritzburg: [
      'CBD', 'Northdale', 'Scottsville', 'Woodlands', 'Clarendon',
      'Hayfields', 'Edendale', 'Ashdown', 'Bisley', 'Raisethorpe',
    ],
    'Richards Bay': [
      'CBD', 'Alton', 'Arboretum', 'Empangeni', 'Esikhawini', 'Felixton',
    ],
    Newcastle: [
      'CBD', 'Madadeni', 'Osizweni', 'Lennoxton', 'Amajuba',
    ],
    Ladysmith: [
      'CBD', 'Steadville', 'Ezakheni', 'Danskraal', 'Platrand',
    ],
    'Port Shepstone': [
      'CBD', 'Margate', 'Shelly Beach', 'Ramsgate', 'Uvongo',
    ],
  },
  'Eastern Cape': {
    Gqeberha: [
      'Central', 'Newton Park', 'Summerstrand', 'Mill Park', 'Walmer',
      'Kabega Park', 'Uitenhage', 'Despatch', 'New Brighton', 'Motherwell',
      'Zwide', 'Gelvandale', 'Parsonsvlei', 'Charlo',
    ],
    'East London': [
      'CBD', 'Quigney', 'Vincent', 'Greenfields', 'Beacon Bay',
      'Nahoon', 'Berea', 'King William\'s Town', 'Mdantsane', 'Zwelitsha',
    ],
    Mthatha: [
      'CBD', 'Ncambedlana', 'Ngangelizwe', 'Fortgale', 'Southernwood',
    ],
    Queenstown: [
      'CBD', 'Komani', 'Mlungisi', 'Ezibeleni', 'Whittlesea',
    ],
    'Port Alfred': [
      'CBD', 'Nemato', 'Kenton-on-Sea', 'Bathurst',
    ],
    Grahamstown: [
      'CBD', 'Joza', 'Fingo Village', 'Extension 9', 'Raisethorpe',
    ],
  },
  Limpopo: {
    Polokwane: [
      'CBD', 'Seshego', 'Bendor', 'Fauna Park', 'Ivy Park', 'Ladanna',
      'Superbia', 'Thornhill', 'Flora Park', 'Welgelegen',
    ],
    Tzaneen: [
      'CBD', 'Nkowankowa', 'Letsitele', 'Haenertsburg',
    ],
    Lephalale: [
      'CBD', 'Marapong', 'Steenbokpan',
    ],
    'Louis Trichardt': [
      'CBD', 'Makhado', 'Dzanani',
    ],
    'Bela-Bela': [
      'CBD', 'Pienaarsrivier', 'Radium',
    ],
    Mokopane: [
      'CBD', 'Mahwelereng', 'Rebone',
    ],
  },
  Mpumalanga: {
    Mbombela: [
      'CBD', 'Riverside Park', 'Tekwane', 'Kabokweni', 'White River',
      'Hazyview', 'Kanyamazane',
    ],
    eMalahleni: [
      'CBD', 'Witbank', 'KwaGuqa', 'Phola', 'Brooklands',
    ],
    Middelburg: [
      'CBD', 'Mhluzi', 'Nasaret', 'Aerorand',
    ],
    Secunda: [
      'CBD', 'Evander', 'Trichardt',
    ],
    Standerton: [
      'CBD', 'Sakhile', 'Morgenzon',
    ],
  },
  'North West': {
    Rustenburg: [
      'CBD', 'Boitekong', 'Tlhabane', 'Waterfall East', 'Cashan',
      'Meriting', 'Phokeng',
    ],
    Mahikeng: [
      'CBD', 'Mmabatho', 'Unit 3', 'Unit 9', 'Montshiwa',
    ],
    Klerksdorp: [
      'CBD', 'Jouberton', 'Alabama', 'Flamwood', 'Freemanville',
    ],
    Potchefstroom: [
      'CBD', 'Ikageng', 'Promosa', 'Mohadin', 'Bult',
    ],
    Brits: [
      'CBD', 'Oukasie', 'Letlhabile', 'Mooinooi',
    ],
  },
  'Free State': {
    Bloemfontein: [
      'CBD', 'Westdene', 'Universitas', 'Langenhoven Park', 'Brandwag',
      'Bain\'s Vlei', 'Botshabelo', 'Thaba Nchu', 'Mangaung', 'Rocklands',
      'Batho', 'Fichardtpark',
    ],
    Welkom: [
      'CBD', 'Thabong', 'Bronville', 'Riebeeckstad', 'Virginia',
    ],
    Kroonstad: [
      'CBD', 'Maokeng', 'Brentpark',
    ],
    Phuthaditjhaba: [
      'CBD', 'Tseki', 'Makwane',
    ],
    Sasolburg: [
      'CBD', 'Zamdela', 'Vaalpark', 'Vanderbijlpark',
    ],
  },
  'Northern Cape': {
    Kimberley: [
      'CBD', 'Galeshewe', 'Roodepan', 'Platfontein', 'Beaconsfield',
      'Ritchie', 'Belgravia',
    ],
    Upington: [
      'CBD', 'Paballelo', 'Louisvale',
    ],
    Springbok: [
      'CBD', 'Carolusberg', 'Nababeep',
    ],
    'De Aar': [
      'CBD', 'Nonzwakazi',
    ],
    Kuruman: [
      'CBD', 'Wrenchville', 'Mothibistad',
    ],
  },
};

export const SA_PROVINCES = Object.keys(SA_LOCATIONS);

export function getCities(province: string): string[] {
  return Object.keys(SA_LOCATIONS[province] ?? {});
}

export function getSuburbs(province: string, city: string): string[] {
  return SA_LOCATIONS[province]?.[city] ?? [];
}
