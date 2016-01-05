$(document).ready(function() {
  // Click to toggle a target
  $('.js-toggle-to').click(function() {
    var target = $(this).attr('js-toggle-target');
    $('#'+target).slideToggle();
  });
});
