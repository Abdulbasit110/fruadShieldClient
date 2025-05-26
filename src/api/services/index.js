import authService from "./authService";
import fraudService from "./fraudService";
import transactionService from "./transactionService";
import customerTransactionService from "./customerTransactionService";
import userService from "./userService";

// Export all services
export {
  authService,
  fraudService,
  transactionService,
  customerTransactionService,
  userService,
};

// Export default as an object with all services
export default {
  auth: authService,
  fraud: fraudService,
  transaction: transactionService,
  customerTransaction: customerTransactionService,
  user: userService,
};
