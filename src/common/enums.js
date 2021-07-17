export default class Enums {

  static OrderTypesEnum = {
    Digital_Signage: 1,
    Video_Ad: 2,
    Network_Sponsor: 3,
    PVS_Display: 4,
    Wexer: 5,
    Static: 6
  }

  static ZDUserTypes = {
    DashboardUser: 1,
    AspNetUser: 2
  }

  static DayNames = {
    0: {LongName:'Sunday'},
    1: {LongName:'Monday'},
    2: {LongName:'Tuesday'},
    3: {LongName:'Wednesday'},
    4: {LongName:'Thursday'},
    5: {LongName:'Friday'},
    6: {LongName:'Saturday'}
  }

  static ZMCAgreementDocumentType = {
    NA: 0,
    LOADetails: 1,
    AgreementContract: 2,
    CreditCardReceipt: 3,
    ACHReceipt: 4,
    AuthorizationConfirmation: 5,
    CreditCardReceiptNA: 9
  }

}
