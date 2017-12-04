//Funcion para Tabs
var containerOverview = document.getElementById('container-overview');
var containesStudents = document.getElementById('container-students');
var list = document.getElementsByTagName('ul')[0].children;//visualiza el hover
var elementTab = document.getElementsByClassName('tab');
    
   function show(event){
    var tabSelection = event.target.dataset.tabSelection;
    if (tabSelection === 'overview') {
        containesStudents.classList.remove('block');
        containesStudents.classList.add('none');
        containerOverview.classList.remove('none');
        containerOverview.classList.add('block');
        list[1].classList.remove('hover');
        list[0].classList.add('hover');
    } else {
        containerOverview.classList.remove('block');
        containerOverview.classList.add('none');
        containesStudents.classList.remove('none');
        containesStudents.classList.add('block');
        containesStudents.classList.add('block');
        list[0].classList.remove('hover');
        list[1].classList.add('hover');
    };
};

//Funcion para eventos 

// guarda en un array las sedes
var sede = Object.keys(data); // ["AQP", "CDMX", "LIM", "SCL"]
// guarda en un array los objetos de cada sede es decir las generaciones
var generation = Object.values(data); // [{…}, {…}, {…}, {…}] tiene el valor de AQP, CDMX, LIM, SCL

var selectSede = document.getElementById('sede');
var selectGeneration = document.getElementById('generation');

var chooseSede = ''; // va a indicar cual es la sede para tomarlas en cuenta con el siguiente filtro
//var studentInfo = document.getElementById('students')

var Students = document.getElementById('student-currently');
var pStudentsDeserter = document.getElementById('dropout');
var promedio70General = document.getElementById('student-target');
var divMetas = document.getElementById('infoSkill');
var total = document.getElementById('total');
var divRatings = document.getElementById('student-satisfaction'); // creamos un div que contenga kos datos
var divProfes = document.getElementById('teacher-rating');
var divJedis = document.getElementById('jedi-master-rating');
var divNps = document.getElementById('cumulative-nps');
var pNpsFinal = document.getElementById('percentage');


function select() {   
    switch (true) {
        case event.target.value === 'lima':
        clearContent();
            chooseSede = 2; // chooseSede cambia a 2 porque es la posicion en el array sede que tiene lima
            break;
        case event.target.value === 'arequipa':
        clearContent();
            chooseSede = 0; // choose cambia a 0 por su posicion en el array sede
            break;
        case event.target.value === 'chile':
        clearContent();
            chooseSede = 3; // choose cambia a 3 por su posicion en el array sede
            break;
        case event.target.value === 'mexico':
        clearContent();
            chooseSede = 1;
            break;
    };
};

function generations() {     
    switch (true) {
        case event.target.value === '2016-2':
            var generation2016II = data[sede[chooseSede]]['2016-2']; // esta seleccionando el objeto que esta dentro de 2016II el cual incluye students y ratings como keys
            showGeneration(generation2016II);
            showMetas(generation2016II);
            showRatings(generation2016II);
            break;
        case event.target.value === '2017-1':
            var generation2017I = data[sede[chooseSede]]['2017-1'];
            showGeneration(generation2017I);
            showMetas(generation2017I);
            showRatings(generation2017I);
            break;
        case event.target.value === '2017-2':
            var generation2017II = data[sede[chooseSede]]['2017-2'];
            showGeneration(generation2017II);
            showMetas(generation2017II);
            showRatings(generation2017II);
            break;
    };
};

// funcion para mostrar mostrar matriculadas y desertadas

function showGeneration(obj) { // nos va a mostrar la cantidad de estudiantes activas
    var cantEstudents = obj['students'].length;
    var acumulStudentsActive = 0; // acumulara la cantidad de estudiantes activas
    for (var i = 0; i < cantEstudents; i++) { // recorre el array con las estudiantes
        if (obj['students'][i]['active'] === true) { // verifica si es true
            acumulStudentsActive++; // aumenta la variable en 1 cada que es true
        };
    };

    Students.textContent = 'ESTUDIANTES INSCRITAS: ' + cantEstudents + ' inscritas'; // agrega contenido al p
    
    pStudentsDeserter.textContent = 'ESTUDIANTES DESERTORAS:' + (cantEstudents - acumulStudentsActive) + ' desertoras'; // mueustra las desertoras
    
    // var pStudentsAactive = document.createElement('p');
    // pStudentsAactive.textContent = 'ESTUDIANTES ACTIVAS:' + acumulStudentsActive + ' activas'; // contenido del p que muestra las estudiantes activas
    // divStudents.appendChild(pStudentsAactive); // agrega el p al div
    // // console.log(acumulStudentsActive);
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Estudiantes');
        data.addColumn('number', 'cantidad');
        data.addRows([
            ['Activas', acumulStudentsActive],
            ['Desertoras', cantEstudents - acumulStudentsActive],
        ]);

        var options = {
            title: 'CANTIDAD DE ESTUDIANTES',
            'width': 320,
            'height': 220
        };

        var chart = new google.visualization.PieChart(document.getElementById('grafy-enrollment'));

        chart.draw(data, options);
    };
};

function showMetas(obj) {
    var tech = (1800 * 70) / 100;// calcula el 70% (1800) 1260
    var hse = (1200 * 70) / 100;// clacula el 70% (1200) 840
    var acumSprint1Tech = 0; // variables para guardar las alumnas que superan el 70%
    var acumSprint1Hse = 0;
    var acumSprint2Tech = 0;
    var acumSprint2Hse = 0;
    var acumSprint3Tech = 0;
    var acumSprint3Hse = 0;
    var acumSprint4Tech = 0;
    var acumSprint4Hse = 0;
    var cantEstudents = obj['students'].length;
    for (var j = 0; j < cantEstudents; j++) {// recorre el array con las estudiantes
        var sprintByStudents = obj['students'][j]['sprints']; // contiene un array con los sprint de cada estidiante
        for (var k = 0; k < sprintByStudents.length; k++) {// recorre el array con los sprint
            //console.log(obj['students'][j]['sprints'][k]);
            var scoreStudents = obj['students'][j]['sprints'][k]['score']; // ingresa al score para poder tomar los puntos
            switch (true) {
                case k === 0: // verifica que sea verdad (cuando k es cero se trata del primer sprint)
                    if (scoreStudents['tech'] > tech) { // compara el score tech de la alumna con el 70% deseado
                        acumSprint1Tech = acumSprint1Tech + 1; // acumula en la variable para contarlas
                    };
                    if (scoreStudents['hse'] > hse) { // compara el score hse de la alumna con el 70% deseado
                        acumSprint1Hse = acumSprint1Hse + 1; // las cuenta
                    };
                    break;
                case k === 1:
                    if (scoreStudents['tech'] > tech) {
                        acumSprint2Tech = acumSprint2Tech + 1;
                    };
                    if (scoreStudents['hse'] > hse) {
                        acumSprint2Hse = acumSprint2Hse + 1;
                    };
                    break;
                case k === 2:
                    if (scoreStudents['tech'] > tech) {
                        acumSprint3Tech = acumSprint3Tech + 1;
                    };
                    if (scoreStudents['hse'] > hse) {
                        acumSprint3Hse = acumSprint3Hse + 1;
                    };
                    break;
                case k === 3:
                    if (scoreStudents['tech'] > tech) {
                        acumSprint4Tech = acumSprint4Tech + 1;
                    };
                    if (scoreStudents['hse'] > hse) {
                        acumSprint4Hse = acumSprint4Hse + 1;
                    };
                    break;
            };
        };
    };
    var sprintsCant = obj['ratings'].length;
    var sumTech = (acumSprint1Tech + acumSprint2Tech + acumSprint3Tech + acumSprint4Tech) / sprintsCant; // promedia la cantidad de estudiantes que superan el 70% en tech
    var sumHse = (acumSprint1Hse + acumSprint2Hse + acumSprint3Hse + acumSprint4Hse) / sprintsCant; // promedia la cantidad de estudiantes que superan el 70% en hse
    var promGeneral = parseInt((sumTech + sumHse) / 2); // promedia tech y hase
    promedio70General.textContent = 'PROMEDIO DE ESTUDIANTES QUE SUPERARON LA META: ' + promGeneral + ' Estudiantes';
    total.textContent = parseInt((promGeneral * 100) / cantEstudents) + ' %';
   
    if (acumSprint1Tech !== 0 || acumSprint1Hse !== 0) { // comprueba que tenga ese sprint
        var ulSprint1Prom = document.createElement('ul');
        var liTech1 = document.createElement('li');
        var liHse1 = document.createElement('li');
        ulSprint1Prom.textContent = 'SPRINT 1:';
        liTech1.textContent = 'Superan el 70% en Técnico: ' + acumSprint1Tech + ' Estudiantes (' + parseInt((acumSprint1Tech * 100) / cantEstudents) + ' %)';
        liHse1.textContent = 'Superan el 70% en Hse: ' + acumSprint1Hse + ' Estudiantes (' + parseInt((acumSprint1Hse * 100) / cantEstudents) + ' %)';
        divMetas.appendChild(ulSprint1Prom);
        ulSprint1Prom.appendChild(liTech1);
        ulSprint1Prom.appendChild(liHse1);
    };
    if (acumSprint2Tech !== 0 || acumSprint2Hse !== 0) {
        var ulSprint2Prom = document.createElement('ul');
        var liTech2 = document.createElement('li');
        var liHse2 = document.createElement('li');
        ulSprint2Prom.textContent = 'SPRINT 2:';
        liTech2.textContent = 'Superan el 70% en Técnico: ' + acumSprint2Tech + ' Estudiantes (' + parseInt((acumSprint2Tech * 100) / cantEstudents) + ' %)';
        liHse2.textContent = 'Superan el 70% en Hse: ' + acumSprint2Hse + ' Estudiantes (' + parseInt((acumSprint2Hse * 100) / cantEstudents) + ' %)';
        divMetas.appendChild(ulSprint2Prom);
        ulSprint2Prom.appendChild(liTech2);
        ulSprint2Prom.appendChild(liHse2);
    };
    if (acumSprint3Tech !== 0 || acumSprint3Hse !== 0) {
        var ulSprint3Prom = document.createElement('ul');
        var liTech3 = document.createElement('li');
        var liHse3 = document.createElement('li');
        ulSprint3Prom.textContent = 'SPRINT 3:';
        liTech3.textContent = 'Superan el 70% en Técnico: ' + acumSprint3Tech + ' Estudiantes (' + parseInt((acumSprint3Tech * 100) / cantEstudents) + ' %)';
        liHse3.textContent = 'Superan el 70% en Hse: ' + acumSprint3Hse + ' Estudiantes (' + parseInt((acumSprint3Hse * 100) / cantEstudents) + ' %)';
        divMetas.appendChild(ulSprint3Prom);
        divMetas.appendChild(liTech3);
        divMetas.appendChild(liHse3);
    };
    if (acumSprint4Tech !== 0 || acumSprint4Hse !== 0) {
        var ulSprint4Prom = document.createElement('ul');
        var liTech4 = document.createElement('li');
        var liHse4 = document.createElement('li');
        ulSprint4Prom.textContent = 'SPRINT 4:';
        liTech4.textContent = 'Superan el 70% en Técnico: ' + acumSprint4Tech + ' Estudiantes (' + parseInt((acumSprint4Tech * 100) / cantEstudents) + ' %)';
        liHse4.textContent = 'Superan el 70% en Hse: ' + acumSprint4Hse + ' Estudiantes (' + parseInt((acumSprint4Hse * 100) / cantEstudents) + ' %)';
        divMetas.appendChild(ulSprint4Prom);
        divMetas.appendChild(liTech4);
        divMetas.appendChild(liHse4);
    };

    

    google.charts.load('current', { 'packages': ['bar'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['SPRINT', 'Tech', 'Hse'],
            ['1', acumSprint1Tech, acumSprint1Hse],
            ['2', acumSprint2Tech, acumSprint2Hse],
            ['3', acumSprint3Tech, acumSprint3Hse],
            ['4', acumSprint4Tech, acumSprint4Hse]
        ]);

        var options = {
            width: 1000,
            chart: {
                title: 'ESTUDIANTES QUE SUPERAN EL 70%',
                subtitle: 'Cantidad de estudiantes con mas de 70% en Tech y Hse',
            },
            bars: 'horizontal' // Required for Material Bar Charts.
        };

        var chart = new google.charts.Bar(document.getElementById('promedio70'));

        chart.draw(data, google.charts.Bar.convertOptions(options));
    };

    // function drawChart() {
    //     var data = new google.visualization.DataTable();
    //     data.addColumn('string', 'Estudiantes');
    //     data.addColumn('number', 'cantidad');
    //     data.addRows([
    //         ['Superaron', parseInt((promGeneral * 100) / cantEstudents)],
    //         ['no superaron', 100 - parseInt((promGeneral * 100) / cantEstudents)],
    //     ]);

    //     var options = {
    //         title: '% DE ESTUDIANES QUE SUPERARON EL 70%',
    //         'width': 320,
    //         'height': 220
    //     };

    //     var chart = new google.visualization.PieChart(document.getElementById('grafy-achivement'));

    //     chart.draw(data, options);

    // };
};

function showRatings(obj) {
    var sumNps = 0;
    for (var j = 0; j < obj['ratings'].length; j++) { // recorre el array ratings
        // console.log(obj['ratings'][j]['student']); // me da un objeto que contiene los keys de cumple o no
        var ulStudentsPoints = document.createElement('ul');
        var liStudentsSup = document.createElement('li');
        ulStudentsPoints.textContent = 'SPRINT ' + (j + 1) + ':';
        liStudentsSup.textContent = (obj['ratings'][j]['student']['supera'] + obj['ratings'][j]['student']['cumple']) + '%';
        ulStudentsPoints.appendChild(liStudentsSup);
        divRatings.appendChild(ulStudentsPoints);
    };
    for (var j = 0; j < obj['ratings'].length; j++) { 
        // Creamos un li para almacenar el promedio de la puntuacion de los profesores
        var ulTeacherPoints = document.createElement('ul');        
        var liTeacherPoints = document.createElement('li');
        ulTeacherPoints.textContent = 'SPRINT ' + (j + 1) + ':';
        liTeacherPoints.textContent = obj['ratings'][j]['teacher'];
        ulTeacherPoints.appendChild(liTeacherPoints);
        divProfes.appendChild(ulTeacherPoints);
    };
    for (var j = 0; j < obj['ratings'].length; j++) {
        var ulJediPoints = document.createElement('ul');
        var liJediPoints = document.createElement('li');
        ulJediPoints.textContent = 'SPRINT ' + (j + 1) + ':';
        liJediPoints.textContent = obj['ratings'][j]['jedi'];
        ulJediPoints.appendChild(liJediPoints);
        divJedis.appendChild(ulJediPoints);
    };

    //Net Promoter Score 
    for (var j = 0; j < obj['ratings'].length; j++) {
        var nps = obj['ratings'][j]['nps'];
        var npsPromedioBySprint = nps['promoters'] - nps['detractors'];
        console.log(npsPromedioBySprint);
        var ulNps = document.createElement('ul');
        var liNps = document.createElement('li');
        ulNps.textContent = 'SPRINT ' + (j + 1) + ':';
        liNps.textContent = npsPromedioBySprint + '%';
        ulNps.appendChild(liNps);
        divNps.appendChild(ulNps);
        sumNps = sumNps + npsPromedioBySprint;
    };
    var promFinalNps = parseInt(sumNps / obj['ratings'].length);
    pNpsFinal.textContent = 'NPS promedio: ' + promFinalNps + '%';

    var jediPoints1 = obj['ratings'][0]['jedi'];
    var teacherPoints1 = obj['ratings'][0]['teacher'];
    var jediPoints2 = obj['ratings'][1]['jedi'];
    var teacherPoints2 = obj['ratings'][1]['teacher'];
    var jediPoints3 = obj['ratings'][2]['jedi'];
    var teacherPoints3 = obj['ratings'][2]['teacher'];
    var jediPoints4 = obj['ratings'][3]['jedi'];
    var teacherPoints4 = obj['ratings'][3]['teacher'];

    google.charts.load('current', { 'packages': ['bar'] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Sprint', 'Puntuación Yedis', 'Puntuación Profesores'],
            [1, jediPoints1, teacherPoints1],
            [2, jediPoints2, teacherPoints2],
            [3, jediPoints3, teacherPoints3],
            [4, jediPoints4, teacherPoints4]
        ]);

        var options = {
            chart: {
                title: 'Puntuación Yedis y Profesores',
                subtitle: 'Puntuación 1 - 5',
            }
        };

        var chart = new google.charts.Bar(document.getElementById('puntuacion'));

        chart.draw(data, google.charts.Bar.convertOptions(options));
    }
};

var clearContent = function(){
    Students.textContent = '';
    pStudentsDeserter.textContent = '';
    total.textContent = '';
    divNps.textContent = '';
    pNpsFinal.textContent = '';
    divMetas.textContent = '';
    divRatings.textContent = '';
    divProfes.textContent = '';
    divJedis.textContent = '';
    promedio70General.textContent = '';
};



window.onload = function () {

    elementTab[0].addEventListener('click', show);
    elementTab[1].addEventListener('click', show);
    selectSede.addEventListener('change', select);
    selectGeneration.addEventListener('change', generations);
    selectGeneration.addEventListener('change', showGeneration);

};


// --------------------*Obtener Estudiantes----------------------------------------------------------------
var studentsData = document.getElementById('students-data');
var sedeStudent = document.getElementById("sede");
var gener = document.getElementById("generation");
//studentsData.addEventListener('click', showStudentData);
gener.addEventListener('change',showStudentData);
console.log("en stud");
function showStudentData(e) {
     var names = document.getElementById('name-student');
     var techs = document.getElementById('tech-skills');
     var hses = document.getElementById('life-skills');
     names.textContent = '';
     techs.textContent = '';
     hses.textContent = '';


    var sedeOption = '';
    var generOption = '';
   if(sedeStudent.selectedIndex == 1){
      sedeOption = sede[2];
       if(gener.selectedIndex==1){
         generOption = gener[1].value;


       }else if(gener.selectedIndex==2){
         generOption = gener[2].value;


       }else if(gener.selectedIndex==3){
         generOption = gener[3].value;


       }

   } else if(sedeStudent.selectedIndex == 2){
    sedeOption = sede[0];
        if(gener.selectedIndex==1){
          generOption = gener[1].value;
        }else if(gener.selectedIndex==2){
          generOption = gener[2].value;
        }

   } else if(sedeStudent.selectedIndex == 3){
    sedeOption = sede[3];
          if(gener.selectedIndex==1){
            generOption = gener[1].value;
          }else if(gener.selectedIndex==2){
            generOption = gener[2].value;
          }else if(gener.selectedIndex==3){
            generOption = gener[3].value;
          }
   }else if(sedeStudent.selectedIndex == 4){
    sedeOption = sede[1];
        if(gener.selectedIndex==2){
          generOption = gener[2].value;
        }else if(gener.selectedIndex==3){
          generOption = gener[3].value;
        }
   }

  //var textSedeSelected = document.getElementById('sedeSelect').textContent;
 // var textGenerSelected = document.getElementById('generSelect').textContent;
//if (textSedeSelected && textGenerSelected) { // add if
  // e.target.setAttribute('href','#section');
  var sa = data[sedeOption][generOption]['students'];
  for (var j = 0;j < sa.length;j++) {
    if (sa[j]['active'] === true) {
      // var ss = data[textSedeSelected][textGenerSelected]["students"][j]["sprints"];
      var ss = sa[j]['sprints'];
      var sumSprintTotal = 0, sumSprintTotalH = 0;
      for (var i = 0 ; i < ss.length ;i++) {
        var scoreTech = ss[i]['score']['tech'];
        var scoreHse = ss[i]['score']['hse'];
        sumSprintTotal = sumSprintTotal + scoreTech;
        sumSprintTotalH = sumSprintTotalH + scoreHse;
      }
      // console.log((((sumSprintTotal/4)/1800)*100).toFixed(2));
      porcentajeTech = (((sumSprintTotal / ss.length) / 1800) * 100).toFixed(2);
      porcentajeHse = (((sumSprintTotalH / ss.length) / 1800) * 100).toFixed(2);
    }
    var sectionStudents = document.getElementById('section');
    var divStudent = document.createElement('div');
  /*  // Student Name
    var name = document.createElement('h2');
    var textName = document.createTextNode(sa[j]['name']);
    name.appendChild(textName);
    divStudent.appendChild(name);*/
    //student name ruthandre


    var titlename = document.createElement('div');
    titlename.textContent = sa[j]['name'];
    titlename.classList.add('squaren');

    if(names.nextSibling){
        names.parentNode.insertBefore(titlename,names.nextSibling);
    } else {
       names.parentNode.appendChild(titlename);
    }


    // porcentajeTech ruthandre


    var divtech = document.createElement('div');
    var spantech = document.createElement('span');
    var brtech = document.createElement('br');
    var spannametech = document.createElement('span');
    spannametech.textContent = 'TECH SKILLS';
    divtech.classList.add('squaret');

   // divtech.classList.add('porcentage');
    divtech.textContent = porcentajeTech + '% ' ;
    if(techs.nextSibling){
        techs.parentNode.insertBefore(divtech,techs.nextSibling);
    } else {
        techs.parentNode.appendChild(divtech);
    }


   // PorcentajeHse ruthname

        var titlehse = document.createElement('div');
        titlehse.textContent = porcentajeHse + '%';
        titlehse.classList.add('squareh');

        if(hses.nextSibling){
            hses.parentNode.insertBefore(titlehse,hses.nextSibling);
        } else {
            hses.parentNode.appendChild(titlehse);
        }
  }


}