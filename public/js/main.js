// @ts-nocheck

const MONTHS =[
    'January', 'Febuary', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function createCalanderSkeleton(months){
    let container = document.createElement('div');
    container.classList.add("container");
    container.innerHTML += `<div class="row" id="calanderContainer"></div>`;
    document.body.appendChild(container);
    months.forEach((month)=>{
        container.innerHTML += `
            <div class="col-md-6">
                    <table class="table table-bordered" id="${month}">
                        <thead>
                            <tr>
                                <th colspan='7'>${month}</th>
                            </tr>
                            <tr>
                                <th>Sun</th>
                                <th>Mon</th>
                                <th>Tue</th>
                                <th>Wed</th>
                                <th>Thu</th>
                                <th>Fri</th>
                                <th>Sat</th>
                            </tr>
                        </thead>
                    </table>
            </div>`
    })
}

function insertDateToArray(positionInRow, day, successfulDay) {
    let date = new Date(day).getDate();
    let month = new Date(day).getMonth();
    let currentDate = new Date().getDate();
    let currentMonth = new Date().getMonth();
    let dataToInsert = "";

    if (positionInRow === 0){ dataToInsert += "<tr>"};

    if(month == currentMonth && date == currentDate){
        console.log(date, currentDate, day)
        dataToInsert += `<td><button type="button" class="btn btn-outline-success" style="display:block;width:100%" id="submitButton" value="${day}">${date}</button></td>`;
    }else if(date && successfulDay){
        dataToInsert += `<td class="table-success">${date}</td>`;
    }else if(date){
        dataToInsert += `<td>${date}</td>`;
    }else{
        dataToInsert += "<td></td>";
    }
    if (positionInRow === 6){ dataToInsert += "</tr>"};
    return dataToInsert;
}

function generateCalendar(monthsDataArray){

    MONTHS.forEach((month, index)=>{
        let currentTable = document.getElementById(month);
        currentTable.innerHTML += monthsDataArray[index];
    })
}

async function main(){

    let calendarData = await fetch("http://localhost:8080/calendar").then((result)=>{ return result.json() });
    let successfulDays = await fetch("http://localhost:8080/successfulDays").then((result)=>{ return result.json() });
    if (successfulDays == null){ successfulDays = [] }
    createCalanderSkeleton(MONTHS);

    let previousMonth = 0;
    let monthsDataArray = new Array(12).fill('');
    let positionInRow = 0;
    let month = 0;

    calendarData.forEach((day)=>{
        let currentMonth = new Date(day).getMonth();
        let dayOfWeek = new Date(day).getDay();
        let successfulDay = false;

        if(successfulDays.includes(day)){ successfulDay = true; };

        if(previousMonth < currentMonth){
            while(positionInRow < 7 ){
                monthsDataArray[month] += insertDateToArray(positionInRow);
                positionInRow++;
            }
            positionInRow = 0;
            month += 1;            
        }

        while(dayOfWeek != positionInRow){
            monthsDataArray[month] += insertDateToArray(positionInRow);
            positionInRow++;
        }

        monthsDataArray[month] += insertDateToArray(positionInRow, day, successfulDay);

        previousMonth = currentMonth;
        if (positionInRow == 6){ positionInRow = 0; }
        else{ positionInRow++; }
    })
    generateCalendar(monthsDataArray);

    let submitButton = document.getElementById('submitButton');

    submitButton.addEventListener('click', ()=>{
        let data = submitButton.value;
        console.log(data)
        submitButton.disabled = true;
        fetch('http://localhost:8080/successfulDays',{
                                                    method: "POST",
                                                    headers:{ 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({data})
                                                })
            .then((res)=>{
                if(res.status !== 200){
                    submitButton.disabled = false;
                }
            })
    })
};

main();