<?php
// 声明我们将返回 JSON 类型的数据，并设置字符集为 UTF-8
header('Content-Type: application/json; charset=utf-8');

$csvFile = 'grades.csv';
$response = []; // 用于存放最终数据的数组

// 检查 CSV 文件是否存在且可读
if (!file_exists($csvFile) || !is_readable($csvFile)) {
    // 如果文件不存在或不可读，返回一个包含错误信息的 JSON
    http_response_code(500); // 设置 HTTP 状态码为 500 (服务器错误)
    echo json_encode(['error' => 'CSV文件不存在或无法读取。']);
    exit; // 终止脚本
}

// 使用 fopen 和 fgetcsv 读取文件，这是处理 CSV 的标准方法
if (($handle = fopen($csvFile, 'r')) !== FALSE) {
    // 读取第一行作为表头 (keys)
    $headers = fgetcsv($handle);
    if ($headers === false) {
        http_response_code(500);
        echo json_encode(['error' => '无法读取CSV表头。']);
        exit;
    }

    // 循环读取文件的剩余行
    while (($data = fgetcsv($handle)) !== FALSE) {
        // 将表头和当前行数据合并为一个关联数组 (key-value pairs)
        // 这使得在 JS 中可以通过列名访问数据，如 row.语文
        $response[] = array_combine($headers, $data);
    }
    fclose($handle);
}

// 将 PHP 数组编码为 JSON 字符串并输出
// JSON_UNESCAPED_UNICODE 选项可以确保中文字符在 JSON 中正常显示，而不是被编码
echo json_encode($response, JSON_UNESCAPED_UNICODE);

?>
