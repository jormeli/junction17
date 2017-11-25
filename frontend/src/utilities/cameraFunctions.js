export const nameToPos = (name) => {
    switch (name.toLowerCase()) {
        case 'test':
            return {
                top: 408,
                left: 313,
            }
        default:
            return {
                top: 0,
                left: 0,
            }
    }
}
