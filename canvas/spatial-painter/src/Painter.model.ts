export interface Result {
  datas:     Data[];
  min:       number;
  max:       number;
  paramName: string;
}

export interface Data {
  lng:   number;
  lat:   number;
  value: number;
}


interface Render {
  mapID: string;
  constructor(option: any);
  render: (data: Result) => void;
  clear(): void;
}
