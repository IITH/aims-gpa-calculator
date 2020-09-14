// ==UserScript==
// @name        GPA meter
// @namespace   http://192.168.0.103:9090
// @description A user script to show GPA on aims page
// @include     http://192.168.0.103:9090/aims/courseReg/myCrsHistoryPage?*
// @version     1
// @grant       none
// ==/UserScript==

var exclude_list = [
  'Minor Core',
  'Honors Core',
  'Honours project',
  'Honours coursework',
  'FCC',
  'Additional'
];

const BASIC_SC = 'Basic Sciences';
const BASIC_ES = 'Basic Engineering\nSkills';
const DEPTT_CORE = 'Departmental Core Theory';
const DEPTT_ELEC = 'Departmental Elective';
const FREE_ELEC = 'Free Elective';
const TYPE_LA = 'Liberal Arts Elective';
const TYPE_CA = 'Creative Arts';
const TYPE_DMC = 'Double Major Core'
const TYPE_DME = 'Double Major Elective'


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
 	basic_sc = 0;
	basic_es = 0;
 	felec = 0;
 	dep_el = 0;
 	dep_core = 0;
    	laca = 0;
    	dme = 0;
    	dmc = 0;

     
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

 		type = $(this).children(".col5").html().trim().slice(6);
 		
 		
 		grade = grade_values[grade];
 		credits = Number(credits);
 		if(type==BASIC_SC) basic_sc+=credits;
		else if(type==BASIC_ES) basic_es+=credits;
 		else if(type==DEPTT_ELEC) dep_el+=credits;
 		else if(type== DEPTT_CORE) dep_core+=credits;
 		else if(type== FREE_ELEC) felec+=credits;
        	else if(type== TYPE_LA || type == TYPE_CA) laca+=credits;
        	else if(type== TYPE_DMC ) dmc+=credits;
        	else if(type== TYPE_DME ) dme+=credits;
 		total_grades += credits * grade;
 		total_credits += credits;
 	});
	felec++;
	dme++;
	laca++;
 	console.log(total_grades, total_credits);
 	console.log('Basic-sc: ');
 	console.log(basic_sc);
	
	console.log('Basic-Engineering-Skills: ');
	console.log(basic_es);
	
 	console.log('Deptt Elective: ');
 	console.log(dep_el);

 	console.log('Dept Core theory: ');
 	console.log(dep_core);

 	console.log('Free Elec: ');
 	console.log(felec);

	console.log('LA CA: ');
    	console.log(laca);
    
    	console.log('Double major elective: ');
    	console.log(dme);
    
    	console.log('Double major core: ');
    	console.log(dmc);
    


 	var gpa = (total_grades / total_credits).toFixed(2);
 	$('#gpa_button').val('Show Gpa');
	$('#courseHistoryUI .clear').after('<ul id="gpa_bar" class="subCnt"><li class="hierarchyLi dataLi hierarchyHdr changeHdrCls"><span class="col"> TOTAL GPA </span></li> \
		<li class="hierarchyLi dataLi"><span class="col1 col">&nbsp;</span><span class="col2 col">Total GPA of graded courses</span><span class="col3 col">&nbsp;</span><span class="col4 col">&nbsp;</span><span class="col5 col">&nbsp;</span><span class="col6 col">&nbsp;</span><span class="col7 col">&nbsp;</span><span class="col4 col">' + gpa + '</span></li> \
		<li class="hierarchyLi dataLi"><span class="col1 col">&nbsp;</span><span class="col2 col">Deptt Core Theory</span><span class="col3 col">&nbsp;</span><span class="col4 col">&nbsp;</span><span class="col5 col">&nbsp;</span><span class="col6 col">&nbsp;</span><span class="col7 col">&nbsp;</span><span class="col4 col">' + dep_core + '</span></li> \
		<li class="hierarchyLi dataLi"><span class="col1 col">&nbsp;</span><span class="col2 col">Deptt Elective</span><span class="col3 col">&nbsp;</span><span class="col4 col">&nbsp;</span><span class="col5 col">&nbsp;</span><span class="col6 col">&nbsp;</span><span class="col7 col">&nbsp;</span><span class="col4 col">' + dep_el + '</span></li> \
		<li class="hierarchyLi dataLi"><span class="col1 col">&nbsp;</span><span class="col2 col">Free Elective</span><span class="col3 col">&nbsp;</span><span class="col4 col">&nbsp;</span><span class="col5 col">&nbsp;</span><span class="col6 col">&nbsp;</span><span class="col7 col">&nbsp;</span><span class="col4 col">' + felec + '</span></li> \
		<li class="hierarchyLi dataLi"><span class="col1 col">&nbsp;</span><span class="col2 col">LA/CA</span><span class="col3 col">&nbsp;</span><span class="col4 col">&nbsp;</span><span class="col5 col">&nbsp;</span><span class="col6 col">&nbsp;</span><span class="col7 col">&nbsp;</span><span class="col4 col">' + laca + '</span></li> \
        	<li class="hierarchyLi dataLi"><span class="col1 col">&nbsp;</span><span class="col2 col">Basic Sciences</span><span class="col3 col">&nbsp;</span><span class="col4 col">&nbsp;</span><span class="col5 col">&nbsp;</span><span class="col6 col">&nbsp;</span><span class="col7 col">&nbsp;</span><span class="col4 col">' + basic_sc + '</span></li> \
        	<li class="hierarchyLi dataLi"><span class="col1 col">&nbsp;</span><span class="col2 col">Basic Engineering Skills</span><span class="col3 col">&nbsp;</span><span class="col4 col">&nbsp;</span><span class="col5 col">&nbsp;</span><span class="col6 col">&nbsp;</span><span class="col7 col">&nbsp;</span><span class="col4 col">' + basic_es + '</span></li> \
		<li class="hierarchyLi dataLi"><span class="col1 col">&nbsp;</span><span class="col2 col">Double Major Core</span><span class="col3 col">&nbsp;</span><span class="col4 col">&nbsp;</span><span class="col5 col">&nbsp;</span><span class="col6 col">&nbsp;</span><span class="col7 col">&nbsp;</span><span class="col4 col">' + dmc + '</span></li> \
        	<li class="hierarchyLi dataLi"><span class="col1 col">&nbsp;</span><span class="col2 col">Double Major elective</span><span class="col3 col">&nbsp;</span><span class="col4 col">&nbsp;</span><span class="col5 col">&nbsp;</span><span class="col6 col">&nbsp;</span><span class="col7 col">&nbsp;</span><span class="col4 col">' + dme + '</span></li> \
		</ul>');
}
if (!(typeof unsafeWindow === 'undefined')) {
  unsafeWindow.show_total_gpa = show_total_gpa;
  unsafeWindow.exclude_list = exclude_list;
  unsafeWindow.add_checkbox = add_checkbox;
  unsafeWindow.grade_values = grade_values;
}
$('#studentCourseSearch').before('<input id="gpa_button" class="btn" value="Show Gpa" style="width:75px; margin-right:10px; opacity:1;" type="button" onclick="show_total_gpa();"></input>');
