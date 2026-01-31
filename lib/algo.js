/*
ISC License

Copyright (c) 2026 The Authors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

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
