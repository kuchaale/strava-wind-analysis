
class Vector {
  constructor(latitude, longitude, speed) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.speed = speed;

    this.unitLatitude = Vector.getUnitValue(latitude, longitude);
    this.unitLongitude = Vector.getUnitValue(longitude, latitude);
  }

  static getUnitValue(primary, secondary) {
    return primary / (Math.sqrt(Math.pow(primary, 2) + (Math.pow(secondary, 2)))); // eslint-disable-line
  }

  static resultantSpeed(speed) {
    return 31 - ((0.004 * Math.pow(speed, 2)) - ((0.616 * speed) - 30.137)); // eslint-disable-line
  }

  static getDistance(vectorA, vectorB) {
    return Math.sqrt(Math.pow(vectorA.unitLatitude - vectorB.unitLatitude, 2) // eslint-disable-line
    + Math.pow(vectorA.unitLatitude - vectorB.unitLatitude, 2)); // eslint-disable-line
  }

  static getLatitudeFromBearing(bearing) {
    return Math.cos((2 * Math.PI) - ((bearing * Math.PI) / 180) - (Math.PI / 2));
  }

  static getLongitudeFromBearing(bearing) {
    return Math.sin((2 * Math.PI) - ((bearing * Math.PI) / 180) - (Math.PI / 2));
  }
}

exports.Vector = Vector;
