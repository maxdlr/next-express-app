import { FormattedTransaction } from "@/services/TransactionService";
import Button from "../button/button";
import { redirect } from "next/navigation";

export default function Transactions(data: FormattedTransaction[]) {
  const seeDetails = (clickEvent) => {
    redirect("/transaction/" + clickEvent.target.id);
  };
  const create = () => redirect("/transaction/new");
  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <div className="mb-4 text-right">
        <Button label="faire une transaction" onClick={create} />
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Date{" "}
            </th>
            <th scope="col" className="px-6 py-3">
              Montant
            </th>
            <th scope="col" className="px-6 py-3">
              Détails
            </th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((transaction: FormattedTransaction, index: number) => (
            <tr className="bg-white border-b border-gray-200" key={index}>
              {Object.entries(transaction).map(
                (value: [string, string | number], index: number) => {
                  if (value[0] !== "id") {
                    return (
                      <td
                        key={index}
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                      >
                        {`${value[1]}${value[0] === "amount" ? " €" : ""}`}
                      </td>
                    );
                  }
                },
              )}
              <td>
                <Button label="voir" onClick={seeDetails} id={transaction.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
