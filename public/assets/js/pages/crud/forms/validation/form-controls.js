// Class definition
var KTFormControls = function () {
	// Private functions
	var _initDemo1 = function () {
		FormValidation.formValidation(
			document.getElementById('kt_form_1'),
			{
				fields: {
					name: {
						validators: {
							notEmpty: {
								message: 'Goal name is required'
							}
						}
					},
					timePeriod: {
						validators: {
							notEmpty: {
								message: 'Time Period is required'
							},
							digits: {
								message: 'The value is not valid '
							}
						}
					},
					targetAmount: {
						validators: {
							notEmpty: {
								message: 'Target Amount is required'
							},
							digits: {
								message: 'The value is not valid '
							}
						}
					},

					description: {
						validators: {
							stringLength: {
								min:10,
								max:250,
								message: 'Please enter a menu within text length range 10 and 250'
							}
						}
					}
				},

				plugins: { //Learn more: https://formvalidation.io/guide/plugins
					trigger: new FormValidation.plugins.Trigger(),
					// Bootstrap Framework Integration
					bootstrap: new FormValidation.plugins.Bootstrap(),
					// Validate fields when clicking the Submit button
					submitButton: new FormValidation.plugins.SubmitButton(),
            		// Submit the form when all fields are valid
            		defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
				}
			}
		);
	}

	var _initDemo2 = function () {
		FormValidation.formValidation(
			document.getElementById('kt_form_2'),
			{
				fields: {
					billing_card_name: {
						validators: {
							notEmpty: {
								message: 'Card Holder Name is required'
							}
						}
					},
					billing_card_number: {
						validators: {
							notEmpty: {
								message: 'Credit card number is required'
							},
							creditCard: {
								message: 'The credit card number is not valid'
							}
						}
					},
					billing_card_exp_month: {
						validators: {
							notEmpty: {
								message: 'Expiry Month is required'
							}
						}
					},
					billing_card_exp_year: {
						validators: {
							notEmpty: {
								message: 'Expiry Year is required'
							}
						}
					},
					billing_card_cvv: {
						validators: {
							notEmpty: {
								message: 'CVV is required'
							},
							digits: {
								message: 'The CVV velue is not a valid digits'
							}
						}
					},

					billing_address_1: {
						validators: {
							notEmpty: {
								message: 'Address 1 is required'
							}
						}
					},
					billing_city: {
						validators: {
							notEmpty: {
								message: 'City 1 is required'
							}
						}
					},
					billing_state: {
						validators: {
							notEmpty: {
								message: 'State 1 is required'
							}
						}
					},
					billing_zip: {
						validators: {
							notEmpty: {
								message: 'Zip Code is required'
							},
							zipCode: {
								country: 'US',
								message: 'The Zip Code value is invalid'
							}
						}
					},

					billing_delivery: {
						validators: {
							choice: {
								min:1,
								message: 'Please kindly select delivery type'
							}
						}
					},
					package: {
						validators: {
							choice: {
								min:1,
								message: 'Please kindly select package type'
							}
						}
					}
				},

				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					// Validate fields when clicking the Submit button
					submitButton: new FormValidation.plugins.SubmitButton(),
            		// Submit the form when all fields are valid
            		defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
					// Bootstrap Framework Integration
					bootstrap: new FormValidation.plugins.Bootstrap({
						eleInvalidClass: '',
						eleValidClass: '',
					})
				}
			}
		);
	}
	var _initDemo3 = function () {
		FormValidation.formValidation(
			document.getElementById('kt_form_23'),
			{
				fields: {
					name: {
						validators: {
							notEmpty: {
								message: 'Goal name is required'
							}
						}
					},
					description: {
						validators: {
							notEmpty: {
								message: 'Goal Description is required'
							}
						}
					},
					targetAmount: {
						validators: {
							notEmpty: {
								message: 'Target Amount is required'
							},
							digits: {
								message: 'Target Amount must be number'
							}
						}
					},
					timePeriod: {
						validators: {
							notEmpty: {
								message: 'Time Period is required'
							},
							digits: {
								message: 'Time Period must be number'
							}
						}
					}
				},

				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					// Validate fields when clicking the Submit button
					submitButton: new FormValidation.plugins.SubmitButton(),
            		// Submit the form when all fields are valid
            		defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
					// Bootstrap Framework Integration
					bootstrap: new FormValidation.plugins.Bootstrap({
						eleInvalidClass: '',
						eleValidClass: '',
					})
				}
			}
		);
	}
	var _initDemo4 = function () {
		FormValidation.formValidation(
			document.getElementById('kt_form_5'),
			{
				fields: {
					amount: {
						validators: {
							notEmpty: {
								message: 'Amount is required'
							},
							digits: {
								message: 'The value is not valid '
							}
						}
					},
					paymentDetails: {
						validators: {
							notEmpty: {
								message: 'Time Period is required'
							}
						}
					}
				},

				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					// Validate fields when clicking the Submit button
					submitButton: new FormValidation.plugins.SubmitButton(),
            		// Submit the form when all fields are valid
            		defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
					// Bootstrap Framework Integration
					bootstrap: new FormValidation.plugins.Bootstrap({
						eleInvalidClass: '',
						eleValidClass: '',
					})
				}
			}
		);
	}

	return {
		// public functions
		init: function() {
			_initDemo1();
			_initDemo2();
			_initDemo3();
			_initDemo4();
		}
	};
}();

jQuery(document).ready(function() {
	KTFormControls.init();
});
