import { TransactionModel } from "../db-config/schema";
import { DepositRequestInterface } from "../interfaces/DepositRequestInterface";
import { ApiResponse } from "../interfaces/ApiResponse";
import { AllocationService } from "./AllocationService";
import { formatDate } from "./utils";

const deposit = async (req: DepositRequestInterface): Promise<ApiResponse> => {
  try {
    const transaction = new TransactionModel({
      amount: req.amount,
      date: formatDate(new Date()),
    });

    if (!AllocationService.validateAllocationRequest(req.allocations)) {
      return new ApiResponse().asBadRequest(
        "Total allocations don't add up to 1",
      );
    }

    const allocated: true | string = await AllocationService.allocate(
      req.amount,
      req.allocations,
      transaction._id,
    );

    if (allocated !== true) {
      return new ApiResponse().asNotFound(allocated);
    }

    await transaction.save();
    return new ApiResponse().asCreated(
      "Money has been deposited and allocated",
    );
  } catch (err) {
    return new ApiResponse().asServerFailure(
      "Can't deposit money: " + err.message,
    );
  }
};

export const TransactionService = {
  deposit,
};
