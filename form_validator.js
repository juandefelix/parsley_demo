window.Parsley
  .addValidator('phone', {
    requirementType: 'regexp',
    validateString: function(value, requirement) {
      var onlyNumbers = value.replace(/\D/g,'');
      return(requirement.test(onlyNumbers));
    },
    messages: { en: 'You need at least 10 numbers' }
  });

FormValidator = {};
FormValidator.validator = function(thisPhone, otherPhone) {
  var thisPhone = thisPhone;
  var otherPhone = otherPhone;

  this.checkForEmpty = function(){  // removed validation if empty, adds it if not empty
    if(!isEmpty(thisPhone)){
      thisPhone.attr('data-parsley-phone', "/[0-9]{10}/");
      thisPhone.attr('data-parsley-required', "true");
    } else if (isEmpty(thisPhone)  && hasValidations(otherPhone)){
      thisPhone.removeAttr('data-parsley-phone');
      thisPhone.removeAttr('data-parsley-required');
    }
  } 

  this.removeOtherValidation = function (){  // remove validation in other element if possible
    if (hasValidations(thisPhone) && thisPhone.parsley().isValid() && isEmpty(otherPhone)){
      otherPhone.removeAttr('data-parsley-phone');
      otherPhone.removeAttr('data-parsley-required');
    }
  }

  this.restoreValidations = function (){
    if (isEmpty(thisPhone) && isEmpty(otherPhone)){
      thisPhone.attr('data-parsley-phone', '/[0-9]{10}/');
      thisPhone.attr('data-parsley-required', 'true');
      otherPhone.attr('data-parsley-phone', '/[0-9]{10}/');
      otherPhone.attr('data-parsley-required', 'true');
    }
  }

  function isEmpty(input){
    return input.val() === "" || input.val().match(/^\s+$/);
  }

  function hasValidations(input){
    return input.attr('data-parsley-phone');
  }
};

$('document').ready(function(){
  $('#home, #mobile').keyup(function(){
    var thisPhone = $(this);
    var otherPhone = $('#home, #mobile').not(this);
    var validator = new FormValidator.validator(thisPhone, otherPhone);

    validator.checkForEmpty();
    validator.removeOtherValidation();
    validator.restoreValidations();
  });

  window.Parsley.on('form:validate', function() {
    $('.validation-errors').html('');
    $('.validation-errors').removeClass('validation-errors-active');
  });

  window.Parsley.on('field:error', function(fieldInstance){
    var messages = ParsleyUI.getErrorsMessages(fieldInstance);
    var fieldName = fieldInstance.$element.prev("label").text();
    for (var i in messages) {
        var $m = $('<li>' + fieldName + ': ' + messages[i] + '</li>');
        $('.validation-errors').append($m);
        $('.validation-errors').addClass('validation-errors-active');
    }
    $("html, body").animate({ scrollTop: 0 }, "fast");
  });  

  $('#example-form').submit(function(event){
    event.preventDefault();
    console.log('hi');
    $('h1').text("Thank you for submitting!");
  })      
})
