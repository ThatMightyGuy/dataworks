/* Example db entries, replace with actual PHP code to fetch database */
let users = 
{
    "DOK-vat13-k6": {
        "owner": "Денисов Альберт Александрович",
        "password": "@R3=VtmqyJ9jL7^5",
        "address": "Докучаевск, ул. Ватутина, 13, кв.6",
        "phone": "0715728892",
        "mac": "7d:94:fd:d2:85:f8",
        "accountType": false,
        "plan": 2,
        "balance": 300,
        "billingHistory": [
            [300, "24.03.2022"],
            [300, "24.02.2022"],
            [300, "24.01.2022"],
            [300, "24.12.2021"],
            [300, "24.11.2021"],
            [300, "24.10.2021"],
            [300, "24.09.2021"],
            [300, "24.08.2021"],
            [300, "24.07.2021"],
            [300, "24.06.2021"]
        ]
    },
    "DOK-vat13-k8": {
        "owner": "Лобанов Дмитрий Николаевич",
        "password": "5uxL#PAeWsCNmb2G",
        "address": "Докучаевск, ул. Ватутина, 13, кв.8",
        "phone": "0713258439",
        "mac": "ad:bc:5c:dc:81:c8",
        "accountType": false,
        "plan": 1,
        "balance": 300,
        "billingHistory": [
            [300, "20.03.2022"],
            [300, "20.02.2022"],
            [300, "20.01.2022"],
            [300, "20.12.2021"],
            [300, "20.11.2021"],
            [300, "20.10.2021"],
            [300, "20.09.2021"],
            [300, "20.08.2021"],
            [300, "20.07.2021"],
            [300, "20.06.2021"]
        ]
    }
    ,
    "DON-chel174a-k402": {
        "owner": "Витцев Илья Сергеевич",
        "password": "$*5%#JE6ap*eG#kM",
        "address": "Донецк, ул. Челюскинцев, 174А, кв. 402",
        "phone": "0715066975",
        "mac": "8a:63:e8:f6:b7:6d",
        "accountType": false,
        "plan": 0,
        "balance": 300,
        "billingHistory": [
            [300, "06.03.2022"],
            [300, "06.02.2022"],
            [300, "06.01.2022"],
            [300, "06.12.2021"],
            [300, "06.11.2021"],
            [300, "06.10.2021"],
            [300, "06.09.2021"],
            [300, "06.08.2021"],
            [300, "06.07.2021"],
            [300, "06.06.2021"]
        ]
    }
}
var plans = [
    'Стандарт',
    'Оптимальный',
    'Максимальная скорость',
    'Стандарт',
    'Медиакомпания',
    'Датацентр'
]
function checkDb(login, pass)
{
    if (users[login] != undefined)
    {
        if (users[login].password == pass) // should not be plain text, should be hashed
        {
            return users[login];
        }
    }
    return null;
}
var user;
function start()
{
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const username = urlParams.get('login');
    const password = urlParams.get('pass');
    var elems = document.querySelectorAll(".data-insert");
    user = checkDb(username, password);
    if(user)
    {
        for(let elem of elems)
        {
            elem.innerHTML = elem.innerHTML.replace("{name}", user.owner.split(" ").slice(1).join(" "));
            elem.innerHTML = elem.innerHTML.replace("{fname}", user.owner);
            elem.innerHTML = elem.innerHTML.replace("{addr}", user.address);
            elem.innerHTML = elem.innerHTML.replace("{phone}", user.phone);
            elem.innerHTML = elem.innerHTML.replace("{acct}", user.accountType ? "Корпоративный" : "Пользователь");
            elem.innerHTML = elem.innerHTML.replace("{plan}", plans[user.accountType ? user.plan + 3 : user.plan]);
            elem.innerHTML = elem.innerHTML.replace("{mac}", user.mac);
            elem.innerHTML = elem.innerHTML.replace("{bal}", user.balance);
            elem.innerHTML = elem.innerHTML.replace("{login}", username);
        }
        fillTable();
    }
    else
    {
        location.replace("errors/401.html");
    }
}
function fillTable()
{
    var table = document.getElementById("billing-history");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = "Сумма";
    cell2.className = "td-accent";
    cell2.innerHTML = "Дата";
    for(let i = 0; i < user.billingHistory.length; i++)
    {
        row = table.insertRow(i + 1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell2.className = "td-accent";
        cell1.innerHTML = user.billingHistory[i][0];
        cell2.innerHTML = user.billingHistory[i][1];
    }
}

function queryUser(value)
{
    return user[value];
}
start();