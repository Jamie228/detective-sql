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

function showResults(wrapper, results, statement) {

    wrapper.innerHTML = "";

    let header = document.createElement('h2');
    header.className = "center";
    header.innerText = "Results";
    wrapper.appendChild(header);

    let query = document.createElement('p');
    query.style.fontWeight = "bold";
    query.className = "center";
    query.innerText = "Your Query: " + statement;
    wrapper.appendChild(query);


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
    if (results[0].values.length > 15) {
        for (let index = 0; index < 15; index++) {
            const element = results[0].values[index];
            let tr = document.createElement('tr');
            //console.log(element);
            element.forEach(i => {
                console.log(i);
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