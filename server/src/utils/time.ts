export function convertToMinutes(
    value: number,
    unit: string
): number {

    switch (unit) {
        case "MINUTE": return value;
        case "HOUR": return value * 60;
        case "DAY": return value * 60 * 24;
        case "WEEK": return value * 60 * 24 * 7;
        case "MONTH": return value * 60 * 24 * 30;
        case "YEAR": return value * 60 * 24 * 365;
        default: return value;
    }
}