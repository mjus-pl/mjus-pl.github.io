'use strict';

const PESEL = {
    /**
     * Generate PESEL
     * @param year {string} full year (from 1800-2299) -> 2002, 1942, 1890
     * @param month {string}
     * @param day {string}
     * @param counter {string} 4 digit counter
     * @returns {string}
     */
    generate: function (year, month, day, counter) {
        if (parseInt(year) < 1800 && parseInt(year) > 2299) {
            throw 'Year is not valid 4 digit number!';
        }
        if (parseInt(month) < 1 && parseInt(month) > 12) {
            throw 'Month is not valid number!';
        }
        if (parseInt(day) < 1 && parseInt(day) > 31) {
            throw 'Day is not valid number!';
        }
        if (parseInt(counter) < 1 && parseInt(counter) > 9999) {
            throw 'Counter is not valid number!';
        }
        if (!PESEL.isValidDate(year, month, day)) {
            throw 'Not valid date!';
        }
        let monthToPESEL = (year, month) => (((100 + ((parseInt(year.substring(0, 2)) - 19) * 20)) % 100) + parseInt(month)).toString();
        let start = ""
            + year.substring(2, 4)
            + monthToPESEL(year, month).padStart(2, "0")
            + day.padStart(2, "0")
            + counter.padStart(4, "0")
        let checksumNumber = PESEL.checksum(start);
        return start + checksumNumber;
    },
    /**
     * Generate random PESEL
     * @param fromYear {string} full year (from 1800-2299) -> 2002, 1942, 1890
     * @param toYear {string} full year (from 1800-2299) -> 2002, 1942, 1890
     * @returns {string}
     */
    random: function (fromYear, toYear) {
        let randomize = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        fromYear = ((fromYear !== 'undefined' && fromYear >= 1800 && fromYear <= 2299) ? fromYear : 1800);
        toYear = (toYear !== 'undefined' && toYear >= 1800 && toYear <= 2299 && toYear >= fromYear) ? toYear : (((new Date).getFullYear() < fromYear) ? 2299 : (new Date).getFullYear());
        let year = (randomize(parseInt(fromYear), parseInt(toYear))).toString();
        let month = (randomize(0, 11)).toString();
        let day = ((new Date(year, month, 0)).getDate()).toString();

        return PESEL.generate(year, month, day, (randomize(0, 9999)).toString());
    },
    /**
     * Check if date is valid (leap year check)
     * @param fullYear {string}
     * @param month {string}
     * @param day {string}
     * @returns {boolean}
     */
    isValidDate: function (fullYear, month, day) {
        let isLeapYear = (!(parseInt(fullYear) % 4) && (parseInt(fullYear) % 100 || !(parseInt(fullYear) % 400)));
        let longMonths = [1, 3, 5, 7, 8, 10, 12];
        if (parseInt(month) === 2) {
            return isLeapYear ? parseInt(day) <= 29 : parseInt(day) <= 28;
        }
        return (longMonths.indexOf(parseInt(month)) !== -1) ? parseInt(day) <= 31 : parseInt(day) <= 30;
    },
    /**
     * Check if PESEL is valid (without checksum check)
     * @param fullPESEL {string}
     * @returns {boolean}
     */
    isValid: function (fullPESEL) {
        if (typeof fullPESEL !== 'string') {
            throw 'PESEL is not string!';
        }
        if (parseInt(fullPESEL) < 1000000 && parseInt(fullPESEL) > 99923199999) {
            throw 'PESEL is not valid number!';
        }
        if (!/^[0-9]{11}$/.test(fullPESEL.trim())) {
            throw 'PESEL is not valid';
        }
        let [year, month, day] = PESEL.getDate(fullPESEL);
        if (!PESEL.isValidDate(year, month, day)) {
            throw 'Not valid date!';
        }
        return true;
    },
    /**
     * Check PESEL's checksum
     * @param fullPESEL {string}
     * @returns {boolean}
     */
    isValidChecksum: function (fullPESEL) {
        return (PESEL.checksum(fullPESEL) === fullPESEL.toString().substring(10, 11));
    },
    /**
     * Calculate checksum from PESEL (can be 10-digit instead 11-digit)
     * @param fullPESEL {string}
     * @returns {string}
     */
    checksum: function (fullPESEL) {
        let weights = [9, 7, 3, 1, 9, 7, 3, 1, 9, 7];
        let sum = weights.reduce((acc, weight, index) => (acc + (weight * fullPESEL[index])), 0);
       // let weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
       // sum = 10 - (sum % 10);
       // return (sum == 10 ? 0 : sum).toString;
        return (sum % 10).toString();
    },
    /**
     * Get date [year, month, day] from PESEL
     * @param fullPESEL {string}
     * @returns {[string, string, string]}
     */
    getDate: function (fullPESEL) {
        let year = fullPESEL.toString().substring(0, 2);
        let month = fullPESEL.toString().substring(2, 4);
        let day = fullPESEL.toString().substring(4, 6).padStart(2, '0');
        year = (1800 + (100 * (Math.ceil(parseInt(month) / 20) % 5)) + parseInt(year)).toString();
        month = (month % 20).toString().padStart(2, '0');
        return [year, month, day];
    },
    /**
     * Get gender/sex (there are only two)
     * @param fullPESEL {string}
     * @returns {string} M/F
     */
    getGender: function (fullPESEL) {
        return (fullPESEL.toString().substring(9, 10) % 2) ? 'M' : 'F';
    },
    /**
     * Count combinations of possible PESEL number
     * @param fromDate      {[year: string, month: string, day: string]}
     * @param toDate        {[year: string, month: string, day: string]}
     * @param genderKnown   {boolean}
     * @returns {number}
     */
    combinationCount: function(fromDate, toDate, genderKnown) {
        let dateFrom = new Date(parseInt(fromDate[0]), (parseInt(fromDate[1]) - 1), parseInt(fromDate[2]));
        let dateTo = new Date(parseInt(toDate[0]), (parseInt(toDate[1]) - 1), parseInt(toDate[2]));
        return (1 + Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24))) // date difference in days
                * 1000 // ordinal number
                * (genderKnown ? 5 : 10); // if gender is known
    },
    /**
     * Create tests
     * @param fullPESEL {string}
     */
    test: function (fullPESEL) {
        console.log('------------------------------');
        console.log('Tests for PESEL: ' + fullPESEL);
        console.log('Is valid: ' + PESEL.isValid(fullPESEL));
        console.log('Is valid checksum: ' + PESEL.isValidChecksum(fullPESEL));
        console.log('Checksum: ' + PESEL.checksum(fullPESEL));
        console.log('Get date: ' + PESEL.getDate(fullPESEL));
        console.log('Gender: ' + PESEL.getGender(fullPESEL));
        console.log('------------------------------');
        let [year, month, day] = PESEL.getDate(fullPESEL);
        console.log('Is valid date: ' + PESEL.isValidDate(year, month, day));
        console.log(
            'Random PESEL: ' +
            PESEL.random(
                (parseInt(year) - 1).toString(),
                (parseInt(year) + 1).toString()
            )
        );
        console.log('Generate PESEL: ' + PESEL.generate(year, month, day, '0001'));
        console.log('------------------------------');
    }
};

/**
 *
 * @param password {string}
 * @param useCommon {boolean}
 * @param blacklist {array}
 * @returns {chars_lowercase_count: {number}, chars_lowercase_length: {number}, chars_uppercase_count: {number}, chars_uppercase_length: {number}, chars_numbers_count: {number}, chars_numbers_length: {number}, chars_symbols_count: {number}, chars_symbols_length: {number}, chars_total: {number}, chars_used: {number}, password: {string}, password_length: {number}, calc_entropy: {number}, calc_entropy_pow: {number}, calc_variations: {number}, calc_strength: {number}, calc_complexity: {number}, penalize_construction: {number}, penalize_blacklisted: {number}, penalize_length: {number}, penalize_repeats: {number}}}
 */
const passwordStrength = function(password, useCommon, blacklist) {

    if (typeof password === 'undefined' || password === "") {
        return {};
    }
    blacklist = (typeof blacklist === "undefined") ? [] : blacklist;
    useCommon = (typeof useCommon !== "undefined" && useCommon);

    /**
     * Charsets definition
     * @type {[{expression: RegExp, name: string, length: number},{expression: RegExp, name: string, length: number},{expression: RegExp, name: string, length: number},{expression: RegExp, name: string, length: (number)}]}
     */
    const charsets = [{
        name: 'lowercase',
        expression: /[a-z]/,
        count: /[a-z]/g,
        length: 26
    }, {
        name: 'uppercase',
        expression: /[A-Z]/,
        count: /[A-Z]/g,
        length: 26
    }, {
        name: 'numbers',
        expression: /[0-9]/,
        count: /[0-9]/g,
        length: 10
    }, {
        name: 'symbols',
        expression: (useCommon ? /[!@#$%^&*\-_|]/ : /[^a-zA-Z0-9]/), //  !@#$%^&*_-|   OR  !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
        count: (useCommon ? /[!@#$%^&*\-_|]/g : /[^a-zA-Z0-9]/g), //  !@#$%^&*_-|   OR  !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
        length: (useCommon ? 11 : 33)
    }]

    /**
     * Get length of password
     * @param {string}password
     */
    const calcLength = (password) => password.length;
    /**
     * Count chars from charset in password
     * @param {string} password
     * @param {object} charset
     * @returns {number}
     */
    //const countCharsFromCharset = (password, charset) => (password.match(charset.count) || []).length;
    const countCharsFromCharset = (password, charset) => (password.match(charset.count) || []).length;
    /**
     * Count used charsets and get their length
     * @param {string} password
     * @returns {number}
     */
    const countCharsetLength = (password) => charsets.reduce((length, charset) => length + (charset.expression.test(password) ? charset.length : 0), 0);

    /**
     * Count length of all charsets
     * @returns {number}
     */
    const countCharsetLengthTotal = () => charsets.reduce((length, charset) => length + charset.length, 0);
    /**
     * Count usage of chars in every charset and respective length of this charset
     * @param {string} password
     * @returns {{[p: string]: {count: number, length: number}}}
     */
    const countCharsArray = (password) => Object.fromEntries(Object.entries(charsets).map(([k, v]) => ['chars_'+v.name, {'count': countCharsFromCharset(password, v), 'length': v.length}]));

    /**
     * Create single level object with chars count and length
     * @param charsArray {object}
     * @returns {object}
     */
    const countCharsFlatten = (charsArray) =>
    Object.keys(charsArray).reduce((obj, charset) => Object.assign(obj, (obj[charset+'_count']=charsArray[charset]['count']), (obj[charset+'_length']=charsArray[charset]['length'])), {});
    
    /**
     * Calc possible char variations of used password
     * @param {string} password
     * @returns {number}
     */
    const calcVariations = (password) => Math.pow(countCharsetLength(password), calcLength(password));
    /**
     * Calc strength of password (percentage of used charsets weight to all possible charsets weight)
     * @param {string} password
     * @returns {number}
     */
    const calcStrength = (password) => Number(((countCharsetLength(password) / countCharsetLengthTotal()) * 100).toFixed(2));

    /**
     * Calculate password's entropy per charset
     * http://resources.infosecinstitute.com/password-security-complexity-vs-length/
     * http://omnicalculator.com/other/password-entropy
     * @param {number} charset used charset length
     * @param {number} length
     * @returns {number}
     */
    const calcEntropyPerCharset = (charset, length) => Math.round(length * Math.log(charset) / Math.LN2);
    /**
     * Calculate password's entropy
     * @param {string} password
     * @returns {number}
     */
    const calcEntropy = (password) => calcEntropyPerCharset(countCharsetLength(password), calcLength(password));


    /**
     * Calculate complexity of password - charset count * charset length
     * @param charsArray {object}
     * @returns {number}
     */
    const calcComplexity = (charsArray) => Object.keys(charsArray).reduce((complexity, charset) => complexity + charsArray[charset].count * charsArray[charset].length, 0);

    /**
     *  Penalize passwords with:
     *  - only letters followed by 1 to 3 digits
     *  - beginning with single uppercase followed by lowercase
     *  - only letters followed by a single special character
     * @param password {string}
     * @returns {number}
     */
    const penalizeConstruction = (password) => (password.match(/^[a-zA-Z]+[0-9]{1,3}$/) || password.match(/^[A-Z][a-z]+$/) || password.match(/^[a-zA-Z]+[^a-zA-Z0-9]$/)) ? 1 : 0
    /**
     * Decrease entropy when password contains repeated characters (3 or more)
     * @param password {string}
     * @returns {number}
     */
    const penalizeRepeats = (password) => {
        let repeated = 0;
        for (let i = 0; i < password.length - 2; i++) {
            if (password.charAt(i) === password.charAt(i + 1) && password.charAt(i) === password.charAt(i + 2)) {
                repeated += 1;
            }
        }
        return repeated;
    }
    /**
     * Penalize blacklisted passwords
     * @param password {string}
     * @returns {number}
     */
    const penalizeBlacklisted = (password) => (blacklist.includes(password) ? 1 : 0)
    /**
     * Penalize min length of password (less than 8 chars)
     * @param password {string}
     * @returns {number}
     */
    const penalizeLength = (password) => (password.length < 8) ? 1 : 0
    /**
     * All password's calculated data
     * @param password
     * @returns {chars_lowercase_count: {number}, chars_lowercase_length: {number}, chars_uppercase_count: {number}, chars_uppercase_length: {number}, chars_numbers_count: {number}, chars_numbers_length: {number}, chars_symbols_count: {number}, chars_symbols_length: {number}, chars_total: {number}, chars_used: {number}, password: {string}, password_length: {number}, calc_entropy: {number}, calc_entropy_pow: {number}, calc_variations: {number}, calc_strength: {number}, calc_complexity: {number}, penalize_construction: {number}, penalize_blacklisted: {number}, penalize_length: {number}, penalize_repeats: {number}}
     */
    const calculated = (password) => Object.assign(
        countCharsFlatten(countCharsArray(password)), {
            'chars_total'    : countCharsetLengthTotal(),
            'chars_used'     : countCharsetLength(password),
            'password'       : password,
            'password_length': calcLength(password),
            'calc_entropy'   : calcEntropy(password),
            'calc_entropy_pow': Math.pow(2, calcEntropy(password)),
            'calc_variations': calcVariations(password),
            'calc_strength'  : calcStrength(password),
            'calc_complexity': calcComplexity(countCharsArray(password)),
            'penalize_construction' : penalizeConstruction(password),
            'penalize_blacklisted'  : penalizeBlacklisted(password),
            'penalize_length'       : penalizeLength(password),
            'penalize_repeats'      : penalizeRepeats(password)
        }
    );
    return calculated(password);
};


const passwordEntropy = function(lower, upper, digit, special) {
    function check(me) {
        return parseInt(((typeof me) === 'undefined') ? 0 : me);
    }
    lower = check(lower);
    upper = check(upper);
    digit = check(digit);
    special = check(special);
    
    let poolSize = (lower>0 ? 26 : 0) + (upper>0 ? 26 : 0) + (digit>0 ? 10 : 0) + (special>0 ? 26 : 0);
    let length = lower + upper + digit + special;
    return (poolSize === 0) ? 0 : Math.round(length * Math.log(poolSize) / Math.LN2);
}

/**
 * Create array of PESEL numbers
 * @param fromDate  {Date}
 * @param toDate    {Date}
 * @param gender    {string}
 * @returns {[[year: string, month: string, day: string, counter_with_gender_number: string]]}
 * @constructor
 */
const PESELArrayGenerator = function(fromDate, toDate, gender) {

    /**
     * Gender numbers array
     * @type {{F: string[], M: string[]}}
     */
    let genderNumbersArray = {
        'F': ['0', '2', '4', '6', '8'],
        'M': ['1', '3', '5', '7', '9']
    };
    fromDate = (fromDate !== "undefined" && fromDate.getFullYear() >= 1800 && fromDate.getFullYear() <= 2299) ? fromDate : new Date();
    toDate = (toDate !== "undefined" && toDate.getFullYear() >= 1800 && toDate.getFullYear() <= 2299 && toDate >= fromDate) ? toDate : new Date();
    gender = ((typeof gender === "string") && (gender.toUpperCase() === 'M' || gender.toUpperCase() === 'F')) ? gender.toUpperCase() : 'A';

    /**
     * Get days array
     * @param from {Date}
     * @param to {Date}
     * @returns {[year, month, day][]}
     */
    const getDaysArray = (from, to) => {let arr=[]; for (let day=from; day<=to; day.setDate(day.getDate()+1)){ let dateObj = new Date(day); arr.push([dateObj.getFullYear().toString(), (dateObj.getMonth() + 1).toString(), dateObj.getDate().toString()]);} return arr;}
    /**
     * Get counter array (000-999)
     * @returns {string[]}
     */
    const getCounterArray = () => Array.from({length: 1000}, (_, index) => index.toString().padStart(3, '0'));

    /**
     * return gender array (from gender param)
     * @returns {string[]}
     */
    const getGenderArray = () => gender === 'A' ? [].concat(genderNumbersArray['F'], genderNumbersArray['M']).sort() : genderNumbersArray[gender.toUpperCase()];
    /**
     * Generate PESEL list
     * @param from {Date}
     * @param to {Date}
     * @returns {(year: string, month: string, day: string, counter_with_gender_number: string)[][][][]}
     */
    const generate = (from, to) => getDaysArray(from, to).map(
        (day) => getCounterArray().map(
            (counter) => getGenderArray().map(
                (gender) => [day[0], day[1], day[2], counter+gender]
            )
        )
    );
    return generate(fromDate, toDate).flat(2);
}