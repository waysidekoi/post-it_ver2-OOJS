function Board(id, selector) {
  this.id = 0;
  this.selector = ".post_board";
  this.posts = [];
  // this.html = <div class="post_board"> posts[1].render</board>

  var self = this;
  function initialize(id, selector){
    self.id = id;
    self.selector = selector;
    self.handlePostIts();
    self.setupBoard();
    self.createLinkToBoard();
  }

  this.createLinkToBoard = function() {
    $('#board_list').append('<li><a>board <span>'+id+'</span></a></li>');
  }

  this.setupBoard = function() {
      //slice to remove initial '.' character
      $(self.selector).remove();
      var board_class_selector = self.selector.slice(1,self.selector.length);
      $('body').append('<div id="'+self.id+'" class="'+board_class_selector+'"></div>');
    }

    this.handlePostIts = function() {
      var self = this;
      $('body').on('click','#'+self.id, function(event){
        var x = event.offsetX;
        var y = event.offsetY;

        //save to board posts array
        self.posts.push( new PostIt(self.selector, x, y));
        self.renderPosts();//render all posts to page
      });
    }

    this.renderPosts = function(){
      for (var i = 0; i < this.posts.length; i++){
        this.posts[i].renderToPage();
      }
    }
    initialize(id, selector);
  };


  function PostIt(selector, x, y) {
    this.html = $('<div class="post-it"><div class="header"><a class="delete">X</a></div><p contenteditable="true" class="content"></p></div>');
    this.pos_x;
    this.pos_y;
    this.container;
    this.post_content;

    var self = this;

    function initialize(selector, x, y) {

      self.pos_x = x;
      self.pos_y = y;
      self.container = selector;
      self.updatePostContent();
      self.updatedPostPosition();
      self.makeCustomizable();
    }

    this.updatePostContent = function() {
      //save when input listener is triggered

      $(self.container).on("input", '.post-it', function(e){
        self.post_content = $(this).children('p').text();
      });
    }

    this.updatedPostPosition = function() {
      $(self.container).on("dragstop", '.post-it', function(event, ui){
          self.pos_x = ui.offset.left;
          self.pos_y = ui.offset.top;
      });
    }

    this.makeCustomizable = function() {
    $(self.html).draggable({handle: ".header"});

    self.html.click(function(event) {
      event.stopPropagation();
      $target = $(event.target);

      if ($target.is(".delete")) {
        self.html = $("");
        $(this).remove();
      }
    });
  }

  this.renderToPage = function() {
    self.makeCustomizable();
    self.html.css("top", self.pos_y).css("left", self.pos_x);
    self.html.appendTo(self.container);
  }

  initialize(selector, x, y);
};

$(document).ready(function() {
  boards = [];
  $('#board_selector').on('click', '#new_board', function(){
    boards.push(new Board(boards.length, ".post_board"));
     // $('#board').html(board1.html());

   });
  $('#board_selector').on('click', 'li', function(e) {
    boardClick = parseInt($(this).find('span').text());

    boards[boardClick].setupBoard();
    boards[boardClick].renderPosts();
  });

 $('#board_selector').on('click', '#load_samples', function(e) {
    board = new Board(boards.length, ".post_board");
    boards.push(board);
    for (var i = 0; i < SampleBoards["good_ideas"].length; i ++){
          var x = SampleBoards["good_ideas"][i].position.left;
          var y = SampleBoards["good_ideas"][i].position.top;
          var post = new PostIt('.post_board', x, y);
          post.post_content =  SampleBoards["good_ideas"][i].content;
          board.posts.push(post);
    };

    board2 = new Board(boards.length, ".post_board");
    boards.push(board2);
    for (var i = 0; i < SampleBoards["bad_ideas"].length; i ++){
          var x = SampleBoards["bad_ideas"][i].position.left;
          var y = SampleBoards["bad_ideas"][i].position.top;
          var post = new PostIt('.post_board', x, y);
          post.post_content =  SampleBoards["bad_ideas"][i].content;
          board2.posts.push(post);
    };
    $(this).hide();
  });
});





