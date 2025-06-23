import { InvestFundModel, ValorisationModel } from "../db-config/schema";
import { DepositRequestInterface } from "../interfaces/DepositRequestInterface";
import { formatDate } from "./utils";

export const deposit = (req: DepositRequestInterface): string | boolean => {
  try {
    req.allocation.forEach(
      async (allocation: { isin: string; percentage: number }) => {
        const fund = await InvestFundModel.findOne({
          isin: allocation.isin,
        }).exec();

        if (fund) {
          await ValorisationModel.create({
            date: formatDate(new Date()),
            value: req.amount * allocation.percentage,
            investFundIsin: allocation.isin,
          });
        } else {
          return "Can't find fund: " + allocation.isin;
        }
      },
    );
  } catch {
    return false;
  }
  return true;
};

// 1. Montant (en €, required)
// 2. Un RIB + BIC
// 3. Le choix des fonds avec la répartition (cf le fichier de ressource `fakeFunds.json` attaché plus bas. Tu y trouveras 10 fonds d’investissement fictifs, avec 2 mois de valorisations boursières).
// 4. L’allocation de son versement sur les fonds choisis. Une fois le choix des fonds fait, la personne peut faire une **allocation, ie répartir son versement en N% sur les fonds sélectionnés.** Exemple, si elle choisit de déposer 100€ sur 4 fonds, elle peut décider de déposer 3% sur le fonds A, 27% sur le fonds B, 50% sur le fonds C et 20% sur le fonds D, etc.
