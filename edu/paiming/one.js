function loadTableData(subject) {
    $.getJSON(subject, function(data) {
        if (data.length > 0) {
            var headerRow1 = '<th rowspan="2">姓名</th>';
            var headerRow2 = '';
            var bodyRows = '';

            data.forEach((row, index) => {
                var bodyRow = '<tr>';
                bodyRow += `<td>${row.name}</td>`;
                Object.keys(row).forEach(key => {
                    if (key !== 'name') {
                        if (index === 0) {
                            headerRow1 += `<th colspan="2">${key}</th>`;
                            headerRow2 += `<th>分数</th><th>排名</th>`;
                        }
                        var rankClass = (key === '总分') ? 'total-rank-column' : 'rank-column';
                        bodyRow += `<td class="score-column clickable" data-name="${row.name}">${row[key].分数}</td><td class="${rankClass} clickable" data-name="${row.name}">${row[key].排名}</td>`;
                    }
                });
                bodyRow += '</tr>';
                bodyRows += bodyRow;
            });

            $('#header-row-1').html(headerRow1);
            $('#header-row-2').html(headerRow2);
            $('#table-body').html(bodyRows);

            // 移除之前的事件监听器
            $('.clickable').off('click');

            // 为所有可点击的单元格添加点击事件
            $('.clickable').on('click', function(e) {
                showTooltip(e, $(this).data('name'));
            });
        }
    });
}

function showTooltip(event, name) {
    if (!name) return;

    const tooltip = $('#tooltip');
    tooltip.text(name);
    
    // 计算 tooltip 的位置
    let left = event.pageX || (event.originalEvent.touches ? event.originalEvent.touches[0].pageX : 0);
    let top = event.pageY || (event.originalEvent.touches ? event.originalEvent.touches[0].pageY : 0);

    left += 10;
    top += 10;

    // 确保 tooltip 不会超出屏幕边界
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    const tooltipWidth = tooltip.outerWidth();
    const tooltipHeight = tooltip.outerHeight();

    if (left + tooltipWidth > windowWidth) {
        left = windowWidth - tooltipWidth;
    }
    if (top + tooltipHeight > windowHeight) {
        top = windowHeight - tooltipHeight;
    }

    tooltip.css({
        left: left,
        top: top,
        display: 'block'
    });

    // 点击其他地方时隐藏 tooltip
    $(document).one('click touchstart', function(e) {
        if (!$(e.target).hasClass('clickable')) {
            tooltip.hide();
        }
    });
}

$(document).ready(function() {
    loadTableData('./base/ma.json');

    $('.nav-link').on('click', function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        var subject = $(this).data('subject');
        loadTableData(subject);
    });

    // 添加全局触摸事件处理
    let startX, startScrollLeft;
    const tableResponsive = $('.table-responsive');

    $(document).on('touchstart', function(e) {
        startX = e.originalEvent.touches[0].pageX - tableResponsive.offset().left;
        startScrollLeft = tableResponsive.scrollLeft();
    });

    $(document).on('touchmove', function(e) {
        if (!startX) return;

        const x = e.originalEvent.touches[0].pageX - tableResponsive.offset().left;
        const walk = (x - startX) * 2; // 滚动速度
        tableResponsive.scrollLeft(startScrollLeft - walk);
    });

    $(document).on('touchend', function() {
        startX = null;
    });
});
