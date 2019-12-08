// ==UserScript==
// @name        GPA meter
// @namespace   http://192.168.0.103:9090
// @description A user script to show GPA on aims page
// @include     http://192.168.0.103:9090/aims/courseReg/myCrsHistoryPage?*
// @version     1
// @grant       none
// ==/UserScript==

var exclude_list = [
  'Honours Core',
  'Honours project',
  'Honours coursework',
  'FCC',
  'Additional'
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
append_checkbox = function(parent, is_checked){
	parent.append("<input class=\"cgpa_cal_check\" type=\"checkbox\" "+(is_checked?"checked":"")+" />");
}
add_checkboxes = function(){
	var courses_checked = new Set();
	$(".cgpa_cal_check").remove();
	elems = $(".hierarchyLi.dataLi").not(".hierarchyHdr, .hierarchySubHdr");
	elems.each(function(i){
		var course_id = $(this).children(".col1").html().trim();
		if (courses_checked.has(course_id)){
			append_checkbox($(this).children(".col1"), false);
			return;
		}
		is_checked = true;
		type = $(this).children(".col5").html().trim().slice(6);
		grade = $(this).children(".col8").html().trim().slice(6);
		console.log(grade, grade.length);
		if (exclude_list.indexOf(type) > -1 || grade == "" || grade == "I")
			is_checked = false;
		if (is_checked)
			courses_checked.add(course_id);
		append_checkbox($(this).children(".col1"), is_checked);
	});
}

show_total_gpa = function(){
	$('#gpa_button').val('Calculating');
 	$('#gpa_bar').remove();
 	total_grades = 0;
 	total_credits = 0;
 	if ($(".cgpa_cal_check").length==0)
 		add_checkboxes();
 	elems = $(".hierarchyLi.dataLi").not(".hierarchyHdr, .hierarchySubHdr");
 	elems.each(function(i){
 		if ($(this).find(".cgpa_cal_check:checked").length == 0 )
 			return;
 		grade = $(this).children(".col8").html().trim().slice(6);
 		credits = $(this).children(".col3").html().trim().slice(6);
 		if (!(grade in grade_values))
 			return;
 		grade = grade_values[grade];
 		credits = Number(credits);
 		total_grades += credits * grade;
 		total_credits += credits;
 	});
 	console.log(total_grades, total_credits);
 	var gpa = (total_grades / total_credits).toFixed(2);
 	$('#gpa_button').val('Show Gpa');
	$('#courseHistoryUI .clear').after('<ul id="gpa_bar" class="subCnt"><li class="hierarchyLi dataLi hierarchyHdr changeHdrCls"><span class="col"> TOTAL GPA </span></li><li class="hierarchyLi dataLi"><span class="col1 col">&nbsp;</span><span class="col2 col">Total GPA of graded courses</span><span class="col3 col">&nbsp;</span><span class="col4 col">&nbsp;</span><span class="col5 col">&nbsp;</span><span class="col6 col">&nbsp;</span><span class="col7 col">&nbsp;</span><span class="col4 col">' + gpa + '</span></li></ul>');
}
if (!(typeof unsafeWindow === 'undefined')) {
  unsafeWindow.show_total_gpa = show_total_gpa;
  unsafeWindow.exclude_list = exclude_list;
  unsafeWindow.add_checkbox = add_checkbox;
  unsafeWindow.grade_values = grade_values;
}
$('#studentCourseSearch').before('<input id="gpa_button" class="btn" value="Show Gpa" style="width:75px; margin-right:10px; opacity:1;" type="button" onclick="show_total_gpa();"></input>');
