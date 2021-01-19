class User {
    name;
    money;
    constructor(name, money) {
        this.name = name;
        this.money = money > 0 ? +money : 0;
        this.mashine = '';
    }
    play(money) {
        this.money -= money;
        if (this.mashine.__proto__.constructor.name === 'GameMashine') {
            // потрібно вибрати автомат user.mashine;
            money <= this.money ? (this.money += this.mashine.game(money)) : alert('Вибачте у гравця не достатньо коштів');
        } else {
            alert('Виберіть автомат');
        }
    }
}

class Casino {
    gameMashines = [];
    #money = null;
    constructor(name) {
        this.name = name;
    }
    getMoney() {
        return this.gameMashines.reduce((acc, elem) => acc + elem.number, 0);
    }
    getMashineCount() {
        return this.gameMashines.length;
    }
    addMoney(number) {
        number > 0 ? (this.#money += number) : alert("Йди гуляй, від'ємних грошей не додаєм");
    }
}

class GameMashine {
    constructor(number) {
        this.number = number;
    }

    getMoney() {
        return this.number;
    }
    takeMoneyFromMashine(number) {
        this.number -= number;
    }
    giveMoneyForMashine(number) {
        this.number += number;
    }
    game(number) {
        if (number * 3 <= this.number) {
            this.giveMoneyForMashine(number);
            let random = Math.floor(Math.random() * (1000 - 100)) + 100;
            let arr = [random % 10]; //записуємо останню цифру
            random = parseInt((random /= 10)); //забираємо останню цифру
            let len = random.toString().length; //записуємо кількість ітерацій
            let k = 1;
            for (let i = 0; i < len; i++) {
                k = arr.includes(random % 10) ? ++k : k; //перевіряємо на повторення
                arr.push(random % 10); //записуємо наступну цифру
                random = parseInt(random / 10); //забираємо наступну цифру
            }
            if (k === 2) {
                number *= 2;
                this.takeMoneyFromMashine(number);
                return number;
            } else if (k === 3) {
                number *= 3;
                this.takeMoneyFromMashine(number);
                return number;
            } else return 0;
        } else {
            alert('У автоматі не достатньо коштів');
            return number;
        }
    }
    addMoney(number) {
        number > 0 ? (this.number += number) : alert("Йди гуляй, від'ємних грошей не додаєм");
    }
}
let gm = new GameMashine(999999);
let gamer = new User('tola', 555);

class SuperAdmin extends User {
    casinos = [];
    casinoForNewMashine = '';
    casinoForTribute = '';
    constructor(name, money) {
        super(name, money);
    }
    newCasino(nameCasino) {
        let casino = new Casino(`${nameCasino}`);
        this.casinos.push(casino);
        return casino;
    }
    newGameMashine(number) {
        if (number <= this.money && this.casinoForNewMashine.__proto__.constructor.name === 'Casino') {
            //також потрібно вибрати admin.casinoForNewMashine=... для додавання машини в казино
            let mashine = new GameMashine(+number);
            this.money -= number;
            this.casinoForNewMashine.gameMashines.push(mashine);
            return mashine;
        } else {
            alert('Вибачте не достатньо коштів або ви не вибрали казино куди ставити автомат');
        }
    }
    tribute(number) {
        if (this.casinoForTribute.__proto__.constructor.name === 'Casino') {
            //також потрібно вибрати admin.casinoForTribute=... для збирання грошей з машин в казино
            let sortArrMashine = [];
            let lastStep;
            for (let i = 0; i < this.casinoForTribute.gameMashines.length; i++) {
                sortArrMashine.push(this.casinoForTribute.gameMashines[i].number);
            }
            sortArrMashine.reverse();
            if (number < sortArrMashine.reduce((acc, elem) => acc + elem)) {
                sortArrMashine.forEach((element, index) => {
                    if (number >= element) {
                        this.money += element;
                        let temp = element;
                        element -= number;
                        number -= temp;
                    } else {
                        lastStep = index;
                    }
                });
                let temp = sortArrMashine[lastStep];
                sortArrMashine[lastStep] -= number;
                this.money += number;
            }
        } else {
            console.log('Потрібно вибрати казіно для збирання коштів');
        }
    }
    addMoneyForCasino(numberCas, casino) {
        if (casino.__proto__.constructor.name === 'Casino') {
            casino.addMoney(numberCas);
            this.money -= numberCas;
        } else {
            console.log('Ви не вибрали казино в третьому аргументі');
        }
    }
    addMoneyForMashine(numberMash, mashine) {
        if (mashine.__proto__.constructor.name === 'GameMashine') {
            mashine.addMoney(numberMash);
            this.money -= numberMash;
        } else {
            alert('Ви не вибрали');
        }
    }
    deleteMashine(casino, number) {
        if (casino.__proto__.constructor.name !== 'Casino') return;
        let dolar = casino.gameMashines.splice(number - 1, 1);
        casino.gameMashines.forEach((element) => {
            element += dolar / casino.gameMashines.length;
        });
    }
}
