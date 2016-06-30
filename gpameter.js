// ==UserScript==
// @name        GPA meter
// @namespace   http://192.168.0.103:9090
// @description A user script to show GPA on aims page
// @include     http://192.168.0.103:9090/aims/courseReg/myCrsHistoryPage?*
// @version     1
// @grant       none
// ==/UserScript==
var exclude_list = [
  'Honours project',
  'Honours coursework',
  'FCC',
  'Additional Course'
];
var grade_values = {
  'A+': 10,
  'A': 10,
  'A-': 9,
  'B': 8,
  'B-': 7,
  'C': 6,
  'C-': 5,
  'D': 4,
  'FR': 0,
  'FS': 0
};
console.log(studentId);
show_total_gpa = function () {
  $('#gpa_button').val('Calculating');
  $('#gpa_bar').remove();
  $.ajax('http://192.168.0.103:9090/aims/courseReg/loadMyCoursesHistroy?studentId=' + studentId + '&courseCd=&courseName=&orderBy=1&degreeIds=&acadPeriodIds=&regTypeIds=&gradeIds=&resultIds=&isGradeIds=').done(function (json) {
    total_grades = 0;
    total_credits = 0;
    for (i in json) {
      entry = json[i];
      type = entry['courseElectiveTypeDesc'];
      if (exclude_list.indexOf(type) > - 1) {
        console.log('Skipping : ' + entry['courseName']);
        continue;
      }
      grade = entry['gradeDesc'];
      if (grade == '') {
        continue;
      }
      grade = grade_values[grade];
      credits = Number(entry['credits']);
      total_grades += credits * grade;
      total_credits += credits;
    }
    console.log(total_grades, total_credits);
    $('#gpa_button').val('Show Gpa');
    $('#courseHistoryUI .clear').after('<ul id="gpa_bar" class="subCnt"><li class="hierarchyLi dataLi hierarchyHdr changeHdrCls"><span class="col"> TOTAL GPA </span></li><li class="hierarchyLi dataLi"><span class="col1 col">&nbsp;</span><span class="col2 col">Total GPA of graded courses</span><span class="col3 col">&nbsp;</span><span class="col4 col">&nbsp;</span><span class="col5 col">&nbsp;</span><span class="col6 col">&nbsp;</span><span class="col7 col">&nbsp;</span><span class="col4 col">' + Math.floor(total_grades * 100 / total_credits) / 100 + '</span></li></ul>');
  });
}
if (!(typeof unsafeWindow === 'undefined')) {
  unsafeWindow.show_total_gpa = show_total_gpa;
  unsafeWindow.exclude_list = exclude_list;
  unsafeWindow.grade_values = grade_values;
}
$('#studentCourseSearch').before('<input id="gpa_button" class="btn" value="Show Gpa" style="width:75px;margib-right:10px; opacity:1;" type="button" onclick="show_total_gpa();"></input>');
