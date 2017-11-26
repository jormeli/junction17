export const nameToPos = (name) => {
    switch (name.toLowerCase()) {
        case 'entrance':
            return {
                top: 420,
                left: 250,
            }
        case 'crowd':
            return {
                top: 430,
                left: 930,
            }
        default:
            return {
                top: 0,
                left: 0,
            }
    }
}

export const locationsParse = (locations) => {
    const res = [];
    for (var location in locations) {
        if (Object.prototype.hasOwnProperty.call(locations, location)) {
            res.push({
                name: location,
                sightings: locations[location],
                position: nameToPos(location),
            });
        }
    }
    return res;
}

export const rangeConverter = (oldValue, oldMin, oldMax, newMin, newMax) => {
    const oldRange = (oldMax - oldMin)
    const newRange = (newMax - newMin)
    return (((oldValue - oldMin) * newRange) / oldRange) + newMin;
}

export const sightingsToScale = (oldValue, oldMin, oldMax) => rangeConverter(oldValue, oldMin, oldMax, 0.8, 2);
export const sightingsToBlur = (oldValue, oldMin, oldMax) => rangeConverter(oldValue, oldMin, oldMax, 0, 2) + 'px';
export const sightingsToBrightness = (oldValue, oldMin, oldMax) => rangeConverter(oldValue, oldMin, oldMax, 100, 180) + '%';
