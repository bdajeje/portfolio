$(document).ready(function() {
  // Click to show
  $('.click-to-show').click(function() {
    // Unbind to prevent future clicks
    $(this).unbind();

    var $self  = $(this);
    var target = $self.attr('target');
    var result = undefined;

    var waitForData = function() {
      if(result)
        $self.text( result ).fadeIn();
      else
        setTimeout(waitForData, 200);
    }

    // Send ajax query to retrieve data
    $.ajax({ url: target }).done(function( data ) {
      result = data;
    });

    // Fade text
    $self.fadeOut(function() {
      // Wait for data before showing new text
      waitForData();

      // Remove style
      $self.removeClass('click-to-show');
    });
  });
});
