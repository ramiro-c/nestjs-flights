export interface IWeather {
  id: number;
  weatherStateName: WeatherStateName;
  weatherStateAbbr: WeatherStateAbbr;
  windDirectionCompass: WindDirectionCompass;
  created: Date;
  applicableDate: Date;
  minTemp: number | null;
  maxTemp: number | null;
  theTemp: number | null;
  windSpeed: number;
  windDirection: number;
  airPressure: number | null;
  humidity: number | null;
  visibility: number | null;
  predictability: number;
}

export enum WeatherStateAbbr {
  C = 'c',
  Hc = 'hc',
  Lc = 'lc',
  Lr = 'lr',
  S = 's',
}

export enum WeatherStateName {
  Clear = 'Clear',
  HeavyCloud = 'Heavy Cloud',
  LightCloud = 'Light Cloud',
  LightRain = 'Light Rain',
  Showers = 'Showers',
}

export enum WindDirectionCompass {
  False = 'False',
  N = 'N',
  Nne = 'NNE',
  Nw = 'NW',
  Wsw = 'WSW',
}
