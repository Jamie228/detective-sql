var database;
function getDatabase(dbName) {

    filename = "sql-wasm.wasm";
    config = {
        locateFile: filename => `libs/${filename}`
    };

    initSqlJs(config).then(function (SQL) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', './db/' + dbName, true);
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var uInt8Array = new Uint8Array(xhr.response);
                var db = new SQL.Database(uInt8Array);
                console.log(db);
                database = db;
            }
        }
        xhr.send();
    });
}

function Exercise(name, rrv, rrc, next) {
    this.name = name;
    this.rrv = rrv;
    this.rrc = rrc;
    this.next = next;
}

function showResults(wrapper, results, statement) {

    wrapper.innerHTML = "";
    let result_count = results[0].values.length;

    let header = document.createElement('h2');
    header.className = "center";
    header.innerText = "Results";
    wrapper.appendChild(header);

    let query = document.createElement('p');
    query.style.fontWeight = "bold";
    query.className = "center";
    query.innerText = "Your Query: " + statement;
    wrapper.appendChild(query);

    let count_info = document.createElement('h4');
    count_info.className = "center";
    count_info.innerText = "Your query returned " + result_count + " result(s)";
    if(result_count > 15) {
        count_info.innerText += ", but only 15 are shown below.";
    }
    count_info.style.fontStyle = 'italic';
    wrapper.appendChild(count_info);

    let query_feedback = document.createElement('div');
    query_feedback.id = "feedback";
    wrapper.appendChild(query_feedback);

    getFeedback(results);

    let table_wrapper = document.createElement('table');
    table_wrapper.className = "results";
    let thead = document.createElement('thead');
    let thr = document.createElement('tr');

    results[0].columns.forEach(header => {
        let th = document.createElement('th');
        th.innerText = header;
        thr.appendChild(th);
    });

    thead.appendChild(thr);
    table_wrapper.appendChild(thead);

    let tbody = document.createElement('tbody');
    if (result_count > 15) {
        for (let index = 0; index < 15; index++) {
            const element = results[0].values[index];
            let tr = document.createElement('tr');
            //console.log(element);
            element.forEach(i => {
                if(i == exercise.rrv) {
                    var fb = document.getElementById('feedback');
                    fb.className = "center success";
                    let p = document.createElement('p');
                    p.innerText = "Great job! ";
                    var a = document.createElement('a');
                    a.href = exercise.next;
                    a.innerText = "Proceed";
                    p.appendChild(a);
                    fb.appendChild(p);
                }
                let td = document.createElement('td');
                td.innerText = i;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        }
    } else {
        results[0].values.forEach(element => {
            let tr = document.createElement('tr');
            element.forEach(i => {
                if(i == exercise.rrv) {
                    var fb = document.getElementById('feedback');
                    fb.className = "center success";
                    let p = document.createElement('p');
                    p.innerText = "Great job! ";
                    var a = document.createElement('a');
                    a.href = exercise.next;
                    a.innerText = "Proceed";
                    p.appendChild(a);
                    fb.appendChild(p);
                }
                let td = document.createElement('td');
                td.innerText = i;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    table_wrapper.appendChild(tbody);
    wrapper.appendChild(table_wrapper);

    wrapper.scrollIntoView({behavior: 'smooth'});

}

function Component(text) {
    var re_comparison = />|<|=/g
    this.text = text;
    this.safe = true;
    if (text === "SELECT" || text === "FROM" || text === "WHERE" || text === "DELETE") {
        this.type = "keyword";
        if (text === "DELETE" || text === "DROP" || text === "TRUNCATE") {
            this.safe = false;
        }
    } else if (re_comparison.test(text)) {
        this.type = "comparison";
    } else if (text === table_name) {
        this.type = "table_name";
    } else if (table_columns.includes(text)) {
        this.type = "column";
    } else if (text === "*") {
        this.type = "wildcard";
    } else if (text === ";") {
        this.type = "delimiter";
    } else if (!isNaN(text)) {
        this.type = "integer";
    } else {
        this.type = "unknown";
        this.safe = false;
    }
}

function buttonPressed(text) {
    var c = new Component(text);
    expression.push(c);
    // console.log(expression);
    // console.log(c.text);
    displayText();
}

function backspace() {
    expression.pop();
    displayText();
}

function displayText() {
    statement = "";
    for (let index = 0; index < expression.length; index++) {
        const element = expression[index];

        console.log(index + " " + expression.length);

        if (index + 1 < expression.length && expression[index + 1].text === ";") {
            statement += element.text;
        } else if (index + 1 < expression.length && element.type == "column" && expression[index + 1].type == "column") {
            statement += element.text + ", ";
        } else if (index != expression.length - 1) {
            statement += element.text + ' ';
        } else {
            console.log("Done");
            statement += element.text;
        }
    }
    query_box.value = statement;
}

function addNum(id) {
    const num_input = document.getElementById(id);
    if (num_input.value !== "") {
        buttonPressed(num_input.value);
    }
    num_input.value = "";
}

function reloadDB(db_name) {
    getDatabase(db_name);
}

function getFeedback(results) {
    console.log(results);
    let query_feedback = document.getElementById('feedback');

    if(exercise.name == 'cctv') {
        if (!results[0].columns.includes(exercise.rrc)) {
            query_feedback.className = "center negative";
            let p = document.createElement('p');
            p.innerText = "It doesn't look like you're returning the right column(s) for this exercise.";
            query_feedback.appendChild(p);
        } else if (results[0].values.length > 15) {
            query_feedback.className = "center negative";
            let p = document.createElement('p');
            p.innerText = "It looks like you're returning too much data - you might not be able to see the data you want";
            query_feedback.appendChild(p);
        }
    } else if (exercise.name == "costume") {
        if (!results[0].columns.includes(exercise.rrc)) {
            query_feedback.className = "center negative";
            let p = document.createElement('p');
            p.innerText = "It doesn't look like you're returning the right column(s) for this exercise.";
            query_feedback.appendChild(p);
        }
    }
}