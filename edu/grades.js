// 读取CSV文件并生成表格
function loadGradesFromCSV() {
    fetch('grades.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            const headers = rows[0].split(',');
            const gradesData = rows.slice(1).map(row => row.split(','));
            generateTable(headers, gradesData);
        })
        .catch(error => console.error('Error loading the CSV file:', error));
}

// 生成表格
function generateTable(headers, gradesData) {
    const table = document.getElementById("gradesTable");
    
    // 创建表头
    let headerRow = "<tr>";
    headers.forEach((header, index) => {
        if (index === 0) {
            headerRow += `<th class="semester" title="${header}">${header}</th>`;
        } else if (index === headers.length - 1) {
            headerRow += `<th class="rank" title="${header}">${header}</th>`;
        } else {
            headerRow += `<th title="${header}">${header}</th>`;
        }
    });
    headerRow += "</tr>";
    table.innerHTML = headerRow;

    // 创建数据行
    gradesData.forEach(row => {
        let dataRow = "<tr>";
        row.forEach((cell, index) => {
            if (index === 0) {
                dataRow += `<td class="semester" title="${cell}">${cell}</td>`;
            } else if (cell.trim() === '') {
                dataRow += '<td class="no-data" title="无">无</td>';
            } else if (index === row.length - 1) {
                dataRow += `<td class="rank" title="${cell}">${cell}</td>`;
            } else {
                dataRow += `<td title="${cell}">${cell}</td>`;
            }
        });
        dataRow += "</tr>";
        table.innerHTML += dataRow;
    });
}

// 页面加载时读取CSV并生成表格
window.onload = loadGradesFromCSV;
