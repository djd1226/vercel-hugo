// 从后端 API 读取成绩数据并生成表格
function loadGrades() {
    // 1. 修改 fetch 的目标为 api.php
    fetch('api.php')
        // 2. 使用 .json() 方法直接将响应解析为 JavaScript 对象数组
        .then(response => {
            if (!response.ok) {
                // 如果服务器返回错误状态码 (如 500)，则抛出错误
                throw new Error('服务器响应错误: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // 3. 检查返回的数据是否包含错误信息 (我们自己在PHP中定义的)
            if (data.error) {
                 throw new Error(data.error);
            }
            // 如果数据为空，也进行处理
            if (data.length === 0) {
                document.getElementById("gradesTable").innerHTML = '<tr><td>没有成绩数据可显示。</td></tr>';
                return;
            }
            // 4. 直接将解析好的 JSON 数据传递给生成表格的函数
            generateTable(data);
        })
        .catch(error => {
            console.error('加载成绩数据失败:', error);
            // 在页面上显示错误信息，对用户更友好
            document.getElementById("gradesTable").innerHTML = `<tr><td>数据加载失败: ${error.message}</td></tr>`;
        });
}

// 根据 JSON 数据生成表格
function generateTable(gradesData) {
    const table = document.getElementById("gradesTable");
    table.innerHTML = ""; // 清空旧内容

    // 从第一条数据中获取表头 (keys)
    const headers = Object.keys(gradesData[0]);

    // 创建表头
    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    headers.forEach((header, index) => {
        let th = document.createElement("th");
        th.textContent = header;
        th.title = header;

        if (index === 0) {
            th.className = "semester";
        } else if (index === headers.length - 1) {
            th.className = "rank";
        }
        headerRow.appendChild(th);
    });

    // 创建数据行
    let tbody = table.createTBody();
    gradesData.forEach(rowData => {
        let dataRow = tbody.insertRow();
        headers.forEach((header, index) => {
            let cell = dataRow.insertCell();
            let cellValue = rowData[header]; // 通过列名获取单元格数据
            
            cell.title = cellValue;
            
            if (index === 0) {
                cell.className = "semester";
                cell.textContent = cellValue;
            } else if (cellValue === null || cellValue.trim() === '') {
                cell.className = 'no-data';
                cell.textContent = '无';
            } else if (index === headers.length - 1) {
                cell.className = "rank";
                cell.textContent = cellValue;
            } else {
                cell.textContent = cellValue;
            }
        });
    });
}

// 页面加载时执行
window.onload = loadGrades;
