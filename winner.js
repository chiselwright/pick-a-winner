var entrantCount = 0;
var ticketCount = 0;
var entrantList = [];
var reader = new FileReader();
var parsed_csv;

var reveal_after = 25 * 1000; // becomes seconds
    reveal_after = 5 * 1000;
var random_max   = (reveal_after + 3000) / 2;

var doc_width = $(document).width();
var doc_height = $(document).height();


jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top",
        Math.max(0,
            (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()
        ) + "px"
    );
    this.css("left",
        Math.max(0,
            (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()
        ) + "px"
    );
    return this;
}

window.onload = function() {
    $( "#winner" ) .hide();
    $( "#magicContainer" ) .hide();

    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            reader.onload = function(e) {
                $('#fileInputRow').fadeTo(1000, 0);
                parsed_csv=CSVToArray(reader.result);
                buildTicketList(parsed_csv);
                $('#magicContainer').center();
                $('#magicContainer').show();
            }

            reader.readAsText(file);
        }
    });

    $("#magicButton").click(function(e) {
        $("#magicContainer").fadeTo(1000,0);
        doTheMagic();
    });
}

function doTheMagic() {
    animateNames(parsed_csv);
    setTimeout(function(){
        winnerFromList(entrantList);
    }, reveal_after);
}

function winnerFromList (entrantList) {
    var winner = entrantList[Math.floor(Math.random()*entrantList.length)]
    $( "#winner" )
        .text(winner)
    ;

    $('#winner').center();

    $( "#winner" )
        .slideUp(5000)
        .delay(4000)
        .fadeIn(1000)
        .textAnimation({
            mode:'highlight',
            baseColor:'black',
            highlightColor:"#2FFF5F",
            delay:35,
            interval:0,
        })
    ;
}

function animateName(message){
    newdiv = $('<div/>')
    .css({
        'font-size':'2em',
        'font-weight':'bold',
        'background-color':'transparent',
        'border':'1px',
    });

    // make position sensitive to size and document's width
    var posx = Math.floor(Math.random() * (doc_width - 200));
    var posy = Math.floor(Math.random() * (doc_height - 50));

    $('#appendPoint')
        .append(newdiv)
    ;

    newdiv
        .hide()
        .html(message)
        .addClass('entrantName')
        .css({
            'position':'absolute',
            'left':posx+'px',
            'top':posy+'px',
        })
        .fadeTo(randomTimeout(), .75)
        .fadeOut(randomTimeout());
}

function randomTimeout() {
    return Math.floor( Math.random() * random_max );
}

function animateNames(parsed_csv) {
    for (var i in parsed_csv) {
        var line=parsed_csv[i];
        setTimeout(function(line) {
            animateName(line[0]);
        }, randomTimeout(), line);
    }
}

function buildTicketList (parsed_csv) {
    for (var i in parsed_csv) {
        entrantCount++;
        var line=parsed_csv[i];

        for (var count=1; count<=line[1]; count++) {
            entrantList.push(line[0]);
            ticketCount++;
        }
    }
    $('#entrantCount').html(entrantCount);
    $('#ticketCount').html(ticketCount);
}

function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

$(document).on('change', '.btn-file :file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  input.trigger('fileselect', [numFiles, label]);
});

$(document).ready( function() {
    $('.btn-file :file').on('fileselect', function(event, numFiles, label) {

        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }

    });
});
