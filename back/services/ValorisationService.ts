import { ValorisationModel } from "../db-config/schema";
import { ApiResponse } from "../interfaces/ApiResponse";

const findByIsin = async (isin: string): Promise<ApiResponse> => {
  const investFund = await ValorisationModel.find({
    investFundIsin: isin,
  }).exec();

  if (!investFund) {
    return new ApiResponse().asNotFound(
      "Can't find invest funds with isin: " + isin,
    );
  }

  return new ApiResponse(investFund).asSuccess("Invest funds found");
};

export const ValorisationService = {
  findByIsin,
};
