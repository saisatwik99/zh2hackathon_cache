// Class Definition
const KTLogin = (function () {
  let _login;

  const _showForm = function (form) {
    const cls = `login-${form}-on`;
    var form = `kt_login_${form}_form`;

    _login.removeClass('login-forgot-on');
    _login.removeClass('login-signin-on');
    _login.removeClass('login-signup-on');

    _login.addClass(cls);

    KTUtil.animateClass(KTUtil.getById(form), 'animate__animated animate__backInUp');
  };

  const _handleSignInForm = function () {
    let validation;

    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    validation = FormValidation.formValidation(
      KTUtil.getById('kt_login_signin_form'),
      {
        fields: {
			email: {
            validators: {
              notEmpty: {
                message: 'Username is required'
              }
            }
          },
          password: {
            validators: {
              notEmpty: {
                message: 'Password is required'
              }
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          // defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // Uncomment this line to enable normal button submit after form validation
          bootstrap: new FormValidation.plugins.Bootstrap()
        }
      }
    );

    $('#kt_login_signin_submit').on('click', (e) => {
      e.preventDefault();

      validation.validate().then((status) => {
		        if (status == 'Valid') {
          swal.fire({
		                text: 'All is cool! Now you submit this form',
		                icon: 'success',
		                buttonsStyling: false,
		                confirmButtonText: 'Ok, got it!',
            customClass: {
    						confirmButton: 'btn font-weight-bold btn-light-primary'
    					}
		            }).then(() => {
            KTUtil.scrollTop();
          });
        } else {
          swal.fire({
		                text: 'Sorry, looks like there are some errors detected, please try again.',
		                icon: 'error',
		                buttonsStyling: false,
		                confirmButtonText: 'Ok, got it!',
            customClass: {
    						confirmButton: 'btn font-weight-bold btn-light-primary'
    					}
		            }).then(() => {
            KTUtil.scrollTop();
          });
        }
		    });
    });

    // Handle forgot button
    $('#kt_login_forgot').on('click', (e) => {
      e.preventDefault();
      _showForm('forgot');
    });

    // Handle signup
    $('#kt_login_signup').on('click', (e) => {
      e.preventDefault();
      _showForm('signup');
    });
  };

  const _handleSignUpForm = function (e) {
    let validation;
    const form = KTUtil.getById('kt_login_signup_form');

    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    validation = FormValidation.formValidation(
      form,
      {
        fields: {
          fullname: {
            validators: {
              notEmpty: {
                message: 'Username is required'
              }
            }
          },
          email: {
            validators: {
              notEmpty: {
                message: 'Email address is required'
              },
              emailAddress: {
                message: 'The value is not a valid email address'
              }
            }
          },
          password: {
            validators: {
              notEmpty: {
                message: 'The password is required'
              }
            }
          },
          cpassword: {
            validators: {
              notEmpty: {
                message: 'The password confirmation is required'
              },
              identical: {
                compare() {
                  return form.querySelector('[name="password"]').value;
                },
                message: 'The password and its confirm are not the same'
              }
            }
          },
          agree: {
            validators: {
              notEmpty: {
                message: 'You must accept the terms and conditions'
              }
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap()
        }
      }
    );

    $('#kt_login_signup_submit').on('click', (e) => {
      e.preventDefault();

      validation.validate().then((status) => {
		        if (status == 'Valid') {
          swal.fire({
		                text: 'All is cool! Now you submit this form',
		                icon: 'success',
		                buttonsStyling: false,
		                confirmButtonText: 'Ok, got it!',
            customClass: {
    						confirmButton: 'btn font-weight-bold btn-light-primary'
    					}
		            }).then(() => {
            KTUtil.scrollTop();
          });
        } else {
          swal.fire({
		                text: 'Sorry, looks like there are some errors detected, please try again.',
		                icon: 'error',
		                buttonsStyling: false,
		                confirmButtonText: 'Ok, got it!',
            customClass: {
    						confirmButton: 'btn font-weight-bold btn-light-primary'
    					}
		            }).then(() => {
            KTUtil.scrollTop();
          });
        }
		    });
    });

    // Handle cancel button
    $('#kt_login_signup_cancel').on('click', (e) => {
      e.preventDefault();

      _showForm('signin');
    });
  };

  const _handleForgotForm = function (e) {
    let validation;

    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    validation = FormValidation.formValidation(
      KTUtil.getById('kt_login_forgot_form'),
      {
        fields: {
          email: {
            validators: {
              notEmpty: {
                message: 'Email address is required'
              },
              emailAddress: {
                message: 'The value is not a valid email address'
              }
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap()
        }
      }
    );

    // Handle submit button
    $('#kt_login_forgot_submit').on('click', (e) => {
      e.preventDefault();

      validation.validate().then((status) => {
		        if (status == 'Valid') {
          // Submit form
          KTUtil.scrollTop();
        } else {
          swal.fire({
		                text: 'Sorry, looks like there are some errors detected, please try again.',
		                icon: 'error',
		                buttonsStyling: false,
		                confirmButtonText: 'Ok, got it!',
            customClass: {
    						confirmButton: 'btn font-weight-bold btn-light-primary'
    					}
		            }).then(() => {
            KTUtil.scrollTop();
          });
        }
		    });
    });

    // Handle cancel button
    $('#kt_login_forgot_cancel').on('click', (e) => {
      e.preventDefault();

      _showForm('signin');
    });
  };

  // Public Functions
  return {
    // public functions
    init() {
      _login = $('#kt_login');

      _handleSignInForm();
      _handleSignUpForm();
      _handleForgotForm();
    }
  };
}());

// Class Initialization
jQuery(document).ready(() => {
  KTLogin.init();
});
