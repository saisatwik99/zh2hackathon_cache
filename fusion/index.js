import fetch from 'node-fetch';
import ValidationError from '../utils/errors/validationError.js';

const FUSION_AUTH = () => process.env.FUSION_AUTH_TOKEN;
const BASE_URL = () => process.env.FUSION_BASE_URL;
const IFI_CODE = () => process.env.FUSION_IFI_CODE;
const BUNDLE_CODE = () => process.env.FUSION_BUNDLE_CODE;
const FORM_CODE = () => `Impact-${Math.floor(Math.random() * 90000) + 10000}`;

const createAccount = async (userDetails) => {
  const data = {
    ifiID: IFI_CODE(),
    formID: FORM_CODE(),
    applicationType: 'CREATE_ACCOUNT_HOLDER',
    spoolID: '123',
    individualType: 'REAL',
    salutation: userDetails?.salutation,
    firstName: userDetails?.firstName,
    middleName: userDetails?.middleName,
    lastName: userDetails?.lastName,
    profilePicURL: userDetails?.profilePicUrl ? userDetails?.profilePicUrl : '',
    dob: userDetails?.dob,
    gender: userDetails?.gender,
    mothersMaidenName: userDetails?.mothersName,
    kycDetails: {
      kycStatus: 'MINIMAL',
      kycStatusPostExpiry: 'KYC_EXPIRED',
      kycAttributes: {},
      authData: {
        PAN: userDetails?.panNumber
      },
      authType: 'PAN'
    },
    vectors: [
      {
        type: 'p',
        value: userDetails?.mobileNumber,
        isVerified: true
      }
    ],
    pops: []
  };
  const url = `${BASE_URL()}/ifi/${IFI_CODE()}/applications/newIndividual`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-Zeta-AuthToken': FUSION_AUTH()
    },
    body: JSON.stringify(data)
  };

  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    throw new ValidationError(json?.message);
  }

  return json && json.individualID;
};

const issueBundle = async ({ individualID, userDetails }) => {
  const url = `${BASE_URL()}/ifi/${IFI_CODE()}/bundles/${BUNDLE_CODE()}/issueBundle`;
  const data = {
    accountHolderID: individualID,
    disableCardFFCreation: false,
    disableFFCreation: false,
    disablePhoneFFCreation: false,
    name: `Bundle-${Math.floor(Math.random() * 9) + 10}`,
    phoneNumber: `${userDetails?.mobileNumber}`
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-Zeta-AuthToken': FUSION_AUTH()
    },
    body: JSON.stringify(data)
  };

  const response = await fetch(url, options);
  const json = await response.json();

  return json;
};

const getAccountBalance = async (accountId) => {
  const url = `${BASE_URL()}/ifi/${IFI_CODE()}/accounts/${accountId}/balance`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-Zeta-AuthToken': FUSION_AUTH()
    }
  };
  const response = await fetch(url, options);
  const json = await response.json();

  return json && json?.balance;
};

export default {
  createAccount,
  issueBundle,
  getAccountBalance
};
