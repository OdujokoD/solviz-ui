let documentCopy = null

$('#topics').click(function(){
    $(this).addClass('active')
    $('#history').removeClass('active')

    // show all topics
    showTopics(documentCopy)
})

$("#history").click(function(){
    $(this).addClass('active')
    $('#topics').removeClass('active')

    // show all history
})

function showTopics(data){
    documentCopy = data;
    var listItem = '';
    for (var i = 0; i < data.length; i++) {
        listItem += '<li class="list-view"><span class="list-content">' + data[i]["topic"] + '</span></li>'
    }
    listItem = '<ul>' + listItem + '</ul>'
    $('.inner-content').html(listItem)
}

function showHistory(history){
    var listItem = '';
    for (var i = 0; i < history.length; i++) {
        listItem += '<li class="list-view"><span class="list-content">' + history[i] + '</span></li>'
    }
    listItem = '<ul>' + listItem + '</ul>'
    $('.inner-content').html(listItem)
}