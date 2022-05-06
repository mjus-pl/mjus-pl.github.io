const page = function() {
    function onLoad() {
        let submits = document.querySelectorAll('input[type="submit"]');
        Array.prototype.forEach.call(submits, function(el){
            let action = el.getAttribute('id');
            el.addEventListener('click', function(event){
                event.preventDefault();
                switch (action) {
                    case 'genPeselParam': genPeselParam(); break;
                    case 'genPeselRandom': genPeselRandom(); break;
                    case 'PeselInfo': PeselInfo(); break;
                    case 'PeselControl': PeselControl(); break;
                    case 'PeselCombination': PeselCombination(); break;
                    case 'genPeselList': genPeselList(); break;
                    case 'PassCheck': PassCheck(); break;
                    case 'PassEntropy': PassEntropy(); break;
                }
            }, false);
        });
    }
    // Helper functions
    function input(selector) {
        return document.querySelector('#'+selector).value;
    }
    function checkbox(selector) {
        return document.querySelector('#'+selector).checked;
    }
    function dateExpl(date) {
        let dateObj = new Date(date);
        return [dateObj.getFullYear().toString(), (dateObj.getMonth() + 1).toString(), dateObj.getDate().toString()];
    }
    function sendToConsole(text){
        document.querySelector('textarea').value += text + "\n";
    }
    function sendLineToConsole(){
        document.querySelector('textarea').value += '========================================' + "\n";
    }

    function genPeselParam(){
        let date = dateExpl(input('sf1-date'));
        let counter = input('sf1-text');
        sendLineToConsole()
        sendToConsole('Wygenerowany numer PESEL');
        try {
            sendToConsole(PESEL.generate(date[0], date[1], date[2], counter));
        } catch (error) {
            sendToConsole('BŁĄD: ' + error);
        }
    }
    function genPeselRandom(){
        let from = input('sf1-dateFrom');
        let to = input('sf1-dateTo');
        sendLineToConsole()
        sendToConsole('Wygenerowany losowy numer PESEL');
        try {
            sendToConsole(PESEL.random(from, to));
        } catch (error) {
            sendToConsole('BŁĄD: ' + error);
        }
    }
    function PeselInfo(){
        let pese = input('sf2-pesel');
        sendLineToConsole()
        sendToConsole('Walidacja numeru PESEL');
        try {
            sendToConsole('Czy poprawny: ' + PESEL.isValid(pese));
            sendToConsole('Czy suma kontrolna poprawna: ' + PESEL.isValidChecksum(pese));
            sendToConsole('Data urodzenia: ' + PESEL.getDate(pese));
            sendToConsole('Płeć: ' + PESEL.getGender(pese));
        } catch (error) {
            sendToConsole('BŁĄD: ' + error);
        }
    }
    function PeselControl(){
        let pese = input('sf2-pesel10');
        sendLineToConsole();
        try {
            sendToConsole('Suma kontrolna: ' + PESEL.checksum(pese));
        } catch (error) {
            sendToConsole('BŁĄD: ' + error);
        }
    }
    function PeselCombination(){
        let gender = checkbox('sf3-gender');
        let from = dateExpl(input('sf3-dateFrom'));
        let to = dateExpl(input('sf3-dateTo'));
        sendLineToConsole();
        try {
            sendToConsole('Liczba kombinacji: ' + PESEL.combinationCount(from, to, gender));
        } catch (error) {
            sendToConsole('BŁĄD: ' + error);
        }
    }
    function PassCheck(){
        let pass = input('sf5-haslo');
        pass = passwordStrength(pass, false);
        sendLineToConsole();
        sendToConsole('hasło:                        ' + pass['password']);
        sendToConsole('długość hasła:                ' + pass['password_length']);
        sendToConsole('ilość małych liter:           ' + pass['chars_lowercase_count']);
        sendToConsole('ilość dużych liter:           ' + pass['chars_uppercase_count']);
        sendToConsole('ilość cyfr:                   ' + pass['chars_numbers_count']);
        sendToConsole('ilość znaków specjalnych:     ' + pass['chars_symbols_count']);
        sendToConsole('pula znaków do wykorzystania: ' + pass['chars_total']);
        sendToConsole('wykorzystana pula:            ' + pass['chars_used']);
        sendToConsole('złożoność hasła:              ' + pass['calc_complexity']);
        sendToConsole('entropia hasła:               ' + pass['calc_entropy']);
        sendToConsole('możliwe kombinacje:           ' + pass['calc_variations']);
        sendToConsole('za krótkie:                   ' + (pass['penalize_length'] === 0 ? 'NIE' : 'TAK'));
        sendToConsole('powtórzone znaki:             ' + (pass['penalize_repeats'] === 0 ? 'NIE' : 'TAK'));
    }
    function PassEntropy(){
        let lower = input('sf6-lower');
        let upper = input('sf6-upper');
        let digit = input('sf6-digit');
        let special = input('sf6-special');
        sendLineToConsole();
        sendToConsole('Entropia: ' + passwordEntropy(lower, upper, digit, special));
    }

    function genPeselList(){
        let year = input('sf4-date');
        let prefix = input('sf4-prefix');
        let suffix = input('sf4-suffix');
        let gender = input('sf4-gender');
        let month = input('sf4-month');
        let list = PESELArrayGenerator(new Date(year, month, 1), new Date(year, month, 31), gender);
        let fullList = () => list.map((val) => prefix + PESEL.generate(val[0], val[1], val[2], val[3]) + suffix);
        sendLineToConsole();
        sendToConsole("Wygenerowane numery PESEL dla: " + year + '.' + (month+1));
        sendToConsole(fullList().join("\n"));
    }
    // ------------------------------------------------------------------------------------------
    onLoad();
}

if (document.readyState !== 'loading') {
    page();
} else {
    document.addEventListener('DOMContentLoaded', page());
}