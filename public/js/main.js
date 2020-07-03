
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

function insertDateToArray(positionInRow, date, successfulDay) {
    let dataToInsert = "";
    if (positionInRow === 0){ dataToInsert += "<tr>"};
    if(date && successfulDay){
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
    const MONTHS =[
        'January', 'Febuary', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    MONTHS.forEach((month, index)=>{
        let currentTable = document.getElementById(month);
        currentTable.innerHTML += monthsDataArray[index];
    })
}

async function main(){
    const MONTHS =[
        'January', 'Febuary', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    let calendarData = await fetch("http://localhost:8080/calendar").then((result)=>{ return result.json() });
    let successfulDays = await fetch("http://localhost:8080/successfulDays").then((result)=>{ return result.json() });
    createCalanderSkeleton(MONTHS);

    let previousMonth = 0;
    let monthsDataArray = new Array(12).fill('');
    let positionInRow = 0;
    let month = 0;

    calendarData.forEach((day)=>{
        let date = new Date(day).getDate();
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

        monthsDataArray[month] += insertDateToArray(positionInRow, date, successfulDay);

        previousMonth = currentMonth;
        if (positionInRow == 6){ positionInRow = 0; }
        else{ positionInRow++; }
    })
    generateCalendar(monthsDataArray);
};

main();