import { Valorisation, ValorisationModel } from "../db-config/schema";

const findByIsin = async (isin: string): Promise<Valorisation[] | false> => {
  const investFund = await ValorisationModel.find({
    investFundIsin: isin,
  }).exec();

  if (!investFund) return false;

  return investFund;
};

const findByManyIsins = async (isins: string[], asc: boolean = true) => {
  return await ValorisationModel.find({
    investFundIsin: { $in: isins },
  })
    .sort({ date: asc ? 1 : -1 })
    .exec();
};

const findLatestByIsin = async (isin: string) => {
  return await ValorisationModel.findOne({ investFundIsin: isin })
    .sort({ date: -1 })
    .exec();
};

const findAllLatests = async (
  isins: string[],
): Promise<Map<string, number>> => {
  const valos = new Map<string, number>();

  for (const isin of isins) {
    const latestValo = await findLatestByIsin(isin);
    if (latestValo) valos.set(isin, latestValo.value);
  }

  return valos;
};

export const ValorisationService = {
  findByIsin,
  findByManyIsins,
  findAllLatests,
};
