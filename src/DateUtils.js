export const getMapInitialDate = () => {
    return stringToDate("2020-02-15");
}

export const incrementDateBy = (date, i) => {
    date.setDate(date.getDate() + i);
    return date;
}

export const incrementDate = (d) => {
    d.setDate(d.getDate() + 1);
}

export const getNumDatesBetween = (a, b) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((a - b) / oneDay));
}

export const dateToString = (d) => {
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000 ))
            .toISOString()
            .split("T")[0];
}

export const stringToDate = (str) => {
    return new Date(str);
}

export const parseDateFull = (date) => {
    var month = '';
    switch (date.getMonth()) {
        case 0:
            month = 'January';
            break;
        case 1:
            month = 'February';
            break;
        case 2:
            month = 'March';
            break;
        case 3:
            month = 'April';
            break;
        case 4:
            month = 'May';
            break;
        case 5:
            month = 'June';
            break;
        case 6:
            month = 'July';
            break;
        case 7:
            month = 'August';
            break;
        case 8:
            month = 'September';
            break;
        case 9:
            month = 'October';
            break;
        case 10:
            month = 'November';
            break;
        case 11:
            month = 'December';
            break;
        default:
            break;
    }
    return `${date.getDate()} ${month}`;
}

export const parseDateShort = (date) => {
    var month = '';
    switch (date.getMonth()) {
        case 0:
            month = 'Jan';
            break;
        case 1:
            month = 'Feb';
            break;
        case 2:
            month = 'Mar';
            break;
        case 3:
            month = 'Apr';
            break;
        case 4:
            month = 'May';
            break;
        case 5:
            month = 'Jun';
            break;
        case 6:
            month = 'Jul';
            break;
        case 7:
            month = 'Aug';
            break;
        case 8:
            month = 'Sep';
            break;
        case 9:
            month = 'Oct';
            break;
        case 10:
            month = 'Nov';
            break;
        case 11:
            month = 'Dec';
            break;
        default:
            break;
    }
    return `${date.getDate()} ${month}`;
}