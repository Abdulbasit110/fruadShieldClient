import authService from "./authService";
import fraudService from "./fraudService";
import transactionService from "./transactionService";
import userService from "./userService";

// Export all services
export { authService, fraudService, transactionService, userService };

// Export default as an object with all services
export default {
  auth: authService,
  fraud: fraudService,
  transaction: transactionService,
  user: userService,
};
