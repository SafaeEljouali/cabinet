function generateCalendar() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const calendarDiv = document.querySelector('.calendar');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const monthYearHeader = document.createElement('th');
    monthYearHeader.setAttribute('colspan', '7');
    monthYearHeader.textContent = `${monthNames[month]} ${year}`;

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysHeader = document.createElement('tr');

    daysOfWeek.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        daysHeader.appendChild(th);
    });

    thead.appendChild(monthYearHeader);
    thead.appendChild(daysHeader);
    table.appendChild(thead);

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDayIndex) {
                const td = document.createElement('td');
                row.appendChild(td);
            } else if (date > daysInMonth) {
                break;
            } else {
                const td = document.createElement('td');
                td.textContent = date;
                row.appendChild(td);
                date++;
            }
        }
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    calendarDiv.appendChild(table);
}

generateCalendar();
