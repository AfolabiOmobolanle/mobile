const deg2rad = (value: number) => {
  return (value * Math.PI) / 180;
};

interface LocatonType {
  lat: number;
  lon: number;
}
// export const calculateDistanceBetweenLocation = (
//   location1: LocatonType,
//   location2: LocatonType
// ) => {
//   const { lat: lat1, lon: lon1 } = location1;
//   const { lat: lat2, lon: lon2 } = location2;

//   const R = 6371; // Radius of the earth in km
//   const dLat = deg2rad(lat2 - lat1); // deg2rad below
//   const dLon = deg2rad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) *
//       Math.cos(deg2rad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const d = R * c; // Distance in km

//   return d;
// };

export const calculateDistanceBetweenLocation = (
  location1: LocatonType,
  location2: LocatonType,
  unit = 'K'
) => {
  const { lat: lat1, lon: lon1 } = location1;
  const { lat: lat2, lon: lon2 } = location2;

  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var radlon1 = (Math.PI * lon1) / 180;
  var radlon2 = (Math.PI * lon2) / 180;
  var theta = lon1 - lon2;
  var radtheta = (Math.PI * theta) / 180;
  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == 'K') {
    dist = dist * 1.609344;
  }
  if (unit == 'N') {
    dist = dist * 0.8684;
  }
  return dist;
};
