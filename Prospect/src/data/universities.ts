export interface University {
  id: string;
  name: string;
  location: string;
  minAPS: number;
  website: string;
  type: 'University' | 'TVET' | 'Private';
}

export const universities: University[] = [
  { id: 'uct', name: 'University of Cape Town', location: 'Western Cape', minAPS: 30, website: 'https://www.uct.ac.za', type: 'University' },
  { id: 'wits', name: 'University of the Witwatersrand', location: 'Gauteng', minAPS: 30, website: 'https://www.wits.ac.za', type: 'University' },
  { id: 'up', name: 'University of Pretoria', location: 'Gauteng', minAPS: 28, website: 'https://www.up.ac.za', type: 'University' },
  { id: 'sun', name: 'Stellenbosch University', location: 'Western Cape', minAPS: 28, website: 'https://www.sun.ac.za', type: 'University' },
  { id: 'uj', name: 'University of Johannesburg', location: 'Gauteng', minAPS: 24, website: 'https://www.uj.ac.za', type: 'University' },
  { id: 'ukzn', name: 'University of KwaZulu-Natal', location: 'KwaZulu-Natal', minAPS: 26, website: 'https://www.ukzn.ac.za', type: 'University' },
  { id: 'nwu', name: 'North-West University', location: 'North West', minAPS: 24, website: 'https://www.nwu.ac.za', type: 'University' },
  { id: 'ufs', name: 'University of the Free State', location: 'Free State', minAPS: 24, website: 'https://www.ufs.ac.za', type: 'University' },
  { id: 'ru', name: 'Rhodes University', location: 'Eastern Cape', minAPS: 26, website: 'https://www.ru.ac.za', type: 'University' },
  { id: 'nmmu', name: 'Nelson Mandela University', location: 'Eastern Cape', minAPS: 22, website: 'https://www.mandela.ac.za', type: 'University' },
  { id: 'cput', name: 'Cape Peninsula University of Technology', location: 'Western Cape', minAPS: 20, website: 'https://www.cput.ac.za', type: 'University' },
  { id: 'tut', name: 'Tshwane University of Technology', location: 'Gauteng', minAPS: 20, website: 'https://www.tut.ac.za', type: 'University' },
  { id: 'dut', name: 'Durban University of Technology', location: 'KwaZulu-Natal', minAPS: 20, website: 'https://www.dut.ac.za', type: 'University' },
];
