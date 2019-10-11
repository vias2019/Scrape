//alert("connected");
$(document).ready(function () {
  console.log("Document ready!");

// $('.articles').empty('');
// $('.paragraph').empty('');


  $('#scrape').on('click', function () {
    // $.get('/', function (data) {
    //   console.log(data);
    //   return data;
    // }).then(function () {
    //   console.log(data);

    // });
    window.location.href = "http://localhost:3000/scrape";
   
  });

  $('.save').on('click', function (button) {

    var info={ 
      title: $(this).data('title'),
      summary: $(this).data('summary'),// || "No summary available",
      link: $(this).data('link')
    };
    
    $.post('/articles' , info, function (data) {
      console.log(data);
      if(data.msg) {
        alert(data.msg);
      } else {
        return data;

      }

      // alert("This article is already saved!");
    
    }).then(function () {
      console.log(data);
    });

  });

  $('.delete').on('click', function () {
    //   $.delete('/articles', function (data) {//ajax
    //     console.log(data);

    //     return data._id;
    //   }).then(function () {
    //     console.log(data);

    //   });
    // });
    var thingToDelete = {
      _id: $(this).data('id')
    };
    $.ajax({ url: '/articles', method: 'DELETE', data: thingToDelete
    })
      .then(function (data) {
        location.reload();
      });

  });

  $('.saveNote').on('click', function(){
    var noteToSave={
      //note: $(this).data('note')
      note: $('.userNote').val()
    };
    $.ajax({ url: '/articles/'+$(this).data("id"), method: 'PATCH', data: noteToSave
    })
      .then(function (data) {
        //location.reload();
      });
  });

});