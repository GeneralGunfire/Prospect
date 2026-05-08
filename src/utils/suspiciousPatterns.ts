export const SPAM_KEYWORDS = [
  'test', 'testing', 'asdf', 'qwerty', 'xxx', 'aaa', 'bbb', 'ccc',
  'hello', 'hi there', 'lol', 'haha', 'blah', 'foo', 'bar', 'baz',
  'fake', 'dummy', 'sample', 'placeholder', '123', 'abc', 'xyz',
  'nothing', 'n/a', 'na', 'none', '...', '???', '!!!',
];

export const POTHOLE_KEYWORDS = [
  'pothole', 'hole', 'crack', 'damage', 'broken', 'road', 'surface',
  'dangerous', 'deep', 'large', 'small', 'vehicle', 'car', 'tyre',
  'water', 'flooding', 'tar', 'asphalt', 'pavement', 'sink', 'collapse',
  'hazard', 'accident', 'bump', 'rough', 'patch', 'repair', 'fix',
];

export const GIBBERISH_PATTERN = /^[^a-zA-Z]*$|(.)\1{4,}|[^a-zA-Z\s]{5,}/;

export const ALL_CAPS_PATTERN = /^[A-Z\s\d!?.,:;'"-]+$/;

// Province → valid cities (sanity check subset)
export const PROVINCE_CITY_MAP: Record<string, string[]> = {
  'Gauteng': ['Johannesburg', 'Pretoria', 'Ekurhuleni', 'Centurion', 'Soweto', 'Midrand', 'Sandton', 'Randburg', 'Roodepoort'],
  'Western Cape': ['Cape Town', 'Stellenbosch', 'George', 'Paarl', 'Worcester', 'Knysna', 'Mossel Bay'],
  'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Richards Bay', 'Newcastle', 'Ladysmith', 'Umhlanga'],
  'Eastern Cape': ['Gqeberha', 'Port Elizabeth', 'East London', 'Mthatha', 'Uitenhage', 'Queenstown'],
  'Free State': ['Bloemfontein', 'Welkom', 'Phuthaditjhaba', 'Sasolburg', 'Kroonstad'],
  'Limpopo': ['Polokwane', 'Tzaneen', 'Mokopane', 'Lephalale', 'Bela-Bela'],
  'Mpumalanga': ['Mbombela', 'Secunda', 'Witbank', 'Middelburg', 'Barberton'],
  'Northern Cape': ['Kimberley', 'Upington', 'Springbok', 'De Aar', 'Kuruman'],
  'North West': ['Rustenburg', 'Mahikeng', 'Klerksdorp', 'Potchefstroom', 'Brits'],
};
