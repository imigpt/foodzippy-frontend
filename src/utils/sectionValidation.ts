import {
  validateEmail,
  validateMobileNumber,
  validateGSTNumber,
  validateFSSAINumber,
  validateRequiredField,
  validateYear,
  validateNumber,
  validateDate,
  validateDropdown,
} from './validation';

export interface SectionErrors {
  [key: string]: string;
}

export const validateSection1 = (data: any): SectionErrors => {
  const errors: SectionErrors = {};

  if (!validateRequiredField(data.restaurantName)) {
    errors.restaurantName = 'Restaurant name is required';
  }

  if (!validateRequiredField(data.restaurantAddress)) {
    errors.restaurantAddress = 'Restaurant address is required';
  }

  if (!validateRequiredField(data.landmark)) {
    errors.landmark = 'Landmark is required';
  }

  if (!validateRequiredField(data.gstNumber)) {
    errors.gstNumber = 'GST number is required';
  } else if (!validateGSTNumber(data.gstNumber)) {
    errors.gstNumber = 'Invalid GST number format';
  }

  if (!validateRequiredField(data.fssaiNumber)) {
    errors.fssaiNumber = 'FSSAI number is required';
  } else if (!validateFSSAINumber(data.fssaiNumber)) {
    errors.fssaiNumber = 'FSSAI number must be 14 digits';
  }

  if (!validateRequiredField(data.yearStarted)) {
    errors.yearStarted = 'Year is required';
  } else if (!validateYear(data.yearStarted)) {
    errors.yearStarted = 'Please enter a valid year';
  }

  if (!validateRequiredField(data.avgOrdersPerDay)) {
    errors.avgOrdersPerDay = 'Average orders per day is required';
  } else if (!validateNumber(data.avgOrdersPerDay)) {
    errors.avgOrdersPerDay = 'Must be a valid number';
  }

  return errors;
};

export const validateSection2 = (data: any): SectionErrors => {
  const errors: SectionErrors = {};

  if (!validateRequiredField(data.ownerName)) {
    errors.ownerName = 'Owner name is required';
  }

  if (!validateRequiredField(data.ownerEmail)) {
    errors.ownerEmail = 'Email is required';
  } else if (!validateEmail(data.ownerEmail)) {
    errors.ownerEmail = 'Please enter a valid email address';
  }

  if (!validateRequiredField(data.ownerMobile)) {
    errors.ownerMobile = 'Mobile number is required';
  } else if (!validateMobileNumber(data.ownerMobile)) {
    errors.ownerMobile = 'Mobile number must be 10 digits';
  }

  return errors;
};

export const validateSection3 = (data: any): SectionErrors => {
  const errors: SectionErrors = {};

  if (!validateRequiredField(data.primaryContactName)) {
    errors.primaryContactName = 'Contact name is required';
  }

  if (!validateRequiredField(data.primaryContactMobile)) {
    errors.primaryContactMobile = 'Mobile number is required';
  } else if (!validateMobileNumber(data.primaryContactMobile)) {
    errors.primaryContactMobile = 'Mobile number must be 10 digits';
  }

  if (!validateRequiredField(data.alternateContactNumber)) {
    errors.alternateContactNumber = 'Alternate contact number is required';
  } else if (!validateMobileNumber(data.alternateContactNumber)) {
    errors.alternateContactNumber = 'Mobile number must be 10 digits';
  }

  if (!validateDropdown(data.preferredOrderMethod)) {
    errors.preferredOrderMethod = 'Please select a preferred method';
  }

  if (!validateDate(data.nextFollowUpDate)) {
    errors.nextFollowUpDate = 'Follow-up date is required';
  }

  return errors;
};

export const validateSection4 = (data: any): SectionErrors => {
  const errors: SectionErrors = {};

  if (!validateDropdown(data.documentSubmissionMethod)) {
    errors.documentSubmissionMethod = 'Please select a document submission method';
  }

  return errors;
};

export const validateSection5 = (data: any): SectionErrors => {
  const errors: SectionErrors = {};

  if (!validateRequiredField(data.accountHolderName)) {
    errors.accountHolderName = 'Account holder name is required';
  }

  if (!validateRequiredField(data.bankAccountNumber)) {
    errors.bankAccountNumber = 'Bank account number is required';
  }

  if (!validateRequiredField(data.bankName)) {
    errors.bankName = 'Bank name is required';
  }

  if (!validateRequiredField(data.ifscCode)) {
    errors.ifscCode = 'IFSC code is required';
  }

  return errors;
};

export const validateSection6 = (data: any): SectionErrors => {
  const errors: SectionErrors = {};

  if (!validateDropdown(data.zomatoListed)) {
    errors.zomatoListed = 'Please select yes or no';
  }

  if (data.zomatoListed === 'yes' && !validateRequiredField(data.zomatoMonths)) {
    errors.zomatoMonths = 'Please enter number of months';
  } else if (data.zomatoListed === 'yes' && !validateNumber(data.zomatoMonths)) {
    errors.zomatoMonths = 'Must be a valid number';
  }

  if (!validateDropdown(data.swiggyListed)) {
    errors.swiggyListed = 'Please select yes or no';
  }

  if (data.swiggyListed === 'yes' && !validateRequiredField(data.swiggyMonths)) {
    errors.swiggyMonths = 'Please enter number of months';
  } else if (data.swiggyListed === 'yes' && !validateNumber(data.swiggyMonths)) {
    errors.swiggyMonths = 'Must be a valid number';
  }

  return errors;
};

export const validateSection7 = (data: any): SectionErrors => {
  const errors: SectionErrors = {};
  if (!validateRequiredField(data.agentName)) {
    errors.agentName = 'Agent name is required';
  }
 console.log("Section 7 data", data);
  return errors;
};

export const validateSection8 = (data: any): SectionErrors => {
  const errors: SectionErrors = {};

  if (!validateRequiredField(data.restaurantName)) {
    errors.restaurantName = 'Restaurant name is required';
  }

  if (!data.restaurantImage) {
    errors.restaurantImage = 'Restaurant image is required';
  }

  if (!validateDropdown(data.restaurantStatus)) {
    errors.restaurantStatus = 'Please select restaurant status';
  }

  if (!validateRequiredField(data.rating)) {
    errors.rating = 'Rating is required';
  }

  if (!validateRequiredField(data.approxDeliveryTime)) {
    errors.approxDeliveryTime = 'Approx delivery time is required';
  }

  if (!validateRequiredField(data.approxPriceForTwo)) {
    errors.approxPriceForTwo = 'Approx price for two is required';
  } else if (!validateNumber(data.approxPriceForTwo)) {
    errors.approxPriceForTwo = 'Approx price for two must be a valid number';
  }

  if (!validateRequiredField(data.certificateCode)) {
    errors.certificateCode = 'Certificate / license code is required';
  }

  if (!validateRequiredField(data.mobileNumber)) {
    errors.mobileNumber = 'Mobile number is required';
  }

  if (!validateRequiredField(data.shortDescription)) {
    errors.shortDescription = 'Short description is required';
  }

  if (!Array.isArray(data.services) || data.services.length === 0) {
    errors.services = 'Please select at least one restaurant service';
  }

  if (!validateDropdown(data.deliveryChargeType)) {
    errors.deliveryChargeType = 'Please select delivery charge type';
  }

  if (!validateRequiredField(data.fixedCharge)) {
    errors.fixedCharge = 'Fixed charge is required';
  } else if (!validateNumber(data.fixedCharge)) {
    errors.fixedCharge = 'Fixed charge must be a valid number';
  }

  if (!validateRequiredField(data.dynamicCharge)) {
    errors.dynamicCharge = 'Dynamic charge is required';
  } else if (!validateNumber(data.dynamicCharge)) {
    errors.dynamicCharge = 'Dynamic charge must be a valid number';
  }

  if (!validateRequiredField(data.storeCharge)) {
    errors.storeCharge = 'Store charge is required';
  } else if (!validateNumber(data.storeCharge)) {
    errors.storeCharge = 'Store charge must be a valid number';
  }

  if (!validateRequiredField(data.deliveryRadius)) {
    errors.deliveryRadius = 'Delivery radius is required';
  } else if (!validateNumber(data.deliveryRadius)) {
    errors.deliveryRadius = 'Delivery radius must be a valid number';
  }

  if (!validateRequiredField(data.minimumOrderPrice)) {
    errors.minimumOrderPrice = 'Minimum order price is required';
  } else if (!validateNumber(data.minimumOrderPrice)) {
    errors.minimumOrderPrice = 'Minimum order price must be a valid number';
  }

  if (!validateRequiredField(data.commissionRate)) {
    errors.commissionRate = 'Commission rate is required';
  } else if (!validateNumber(data.commissionRate)) {
    errors.commissionRate = 'Commission rate must be a valid number';
  }

  if (!validateRequiredField(data.bankName)) {
    errors.bankName = 'Bank name is required';
  }

  if (!validateRequiredField(data.bankCode)) {
    errors.bankCode = 'Bank code / IFSC is required';
  }

  if (!validateRequiredField(data.recipientName)) {
    errors.recipientName = 'Recipient name is required';
  }

  if (!validateRequiredField(data.accountNumber)) {
    errors.accountNumber = 'Account number is required';
  }

  if (!validateRequiredField(data.paypalId)) {
    errors.paypalId = 'PayPal ID is required';
  }

  if (!validateRequiredField(data.upiId)) {
    errors.upiId = 'UPI ID is required';
  }

  if (!validateRequiredField(data.searchLocation)) {
    errors.searchLocation = 'Search location is required';
  }

  if (!validateRequiredField(data.fullAddress)) {
    errors.fullAddress = 'Full address is required';
  }

  if (!validateRequiredField(data.pincode)) {
    errors.pincode = 'Pincode is required';
  }

  if (!validateRequiredField(data.landmark)) {
    errors.landmark = 'Landmark is required';
  }

  if (!validateRequiredField(data.latitude)) {
    errors.latitude = 'Latitude is required';
  }

  if (!validateRequiredField(data.longitude)) {
    errors.longitude = 'Longitude is required';
  }

  if (!validateRequiredField(data.loginEmail)) {
    errors.loginEmail = 'Login email is required';
  } else if (!validateEmail(data.loginEmail)) {
    errors.loginEmail = 'Please enter a valid email address';
  }

  if (!validateRequiredField(data.loginPassword)) {
    errors.loginPassword = 'Password is required';
  }

  if (!Array.isArray(data.categories) || data.categories.length === 0) {
    errors.categories = 'Please select at least one restaurant category';
  }

  return errors;
};
