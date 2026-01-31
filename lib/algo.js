

function get_wage(c) {
    const wages = "0123456789XABCDEFGHIJKLMNOPRSTUWYZ";
    return wages.indexOf(c);
}

function calculateNr(court, old) {
    let filling = "";
    for (let i = 0; i < 8 - old.length; i++) filling += "0";

    const full_number = court + filling + old;
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];

    let sum = 0;
    for (let i = 0; i < 12; i++) sum += get_wage(full_number[i]) * weights[i];

    return sum % 10;
}

module.exports = { calculateNr };
