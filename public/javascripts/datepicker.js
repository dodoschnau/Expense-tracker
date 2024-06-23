// public/js/new-expense.js
$(document).ready(function () {
  $('#datepicker').datepicker({
    format: 'yyyy/mm/dd',
    autoclose: true,
    todayHighlight: true
  });

  // 自動格式化輸入日期
  $('#datepicker input').on('input', function () {
    let value = $(this).val();
    value = value.replace(/[^0-9]/g, '');
    if (value.length > 4) {
      value = value.substring(0, 4) + '/' + value.substring(4);
    }
    if (value.length > 7) {
      value = value.substring(0, 7) + '/' + value.substring(7);
    }
    $(this).val(value);
  });
});
