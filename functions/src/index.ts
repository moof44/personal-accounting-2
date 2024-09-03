import {onDocumentWritten} from "firebase-functions/v2/firestore";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

export const updateSummary2 = onDocumentWritten(
  "/{collectionId}/{documentId}",
  async (event) => {
    // Check if the change occurred in one of the target collections
    const targetCollections = ["income", "expense", "purchase", "capital"];
    if (!targetCollections.includes(event.params.collectionId)) return null;

    const summaryDocRef = db.collection("summary").doc("YqKGuxxElDfLzGNO9JtZ");
    const summaryDoc = await summaryDocRef.get();
    const existingSummary = summaryDoc.exists ?
      summaryDoc.data() :
      {
        totalIncome: 0,
        totalExpense: 0,
        totalPurchases: 0,
        totalCapital: 0,
        netIncome: 0,
        remainingCapital: 0,
      };

    // Update summary based on the changed collection and document
    const updatedSummary = {...existingSummary};
    if (!event.data) return null;

    if (event.data.before.exists && event.data.after.exists) {
      // Document was updated
      const oldAmount = (event.data.before.data() as any).amount;
      const newAmount = (event.data.after.data() as any).amount;
      const amountDiff = newAmount - oldAmount;

      switch (event.params.collectionId) {
      case "income":
        updatedSummary.totalIncome += amountDiff;
        updatedSummary.netIncome += amountDiff;
        break;
      case "expense":
        updatedSummary.totalExpense += amountDiff;
        updatedSummary.netIncome -= amountDiff;
        break;
      case "capital":
        updatedSummary.totalCapital += amountDiff;
        updatedSummary.remainingCapital += amountDiff;
        break;
      case "purchase":
        updatedSummary.totalPurchases += amountDiff;
        updatedSummary.remainingCapital -= amountDiff;
        break;
      }
    } else if (event.data.after.exists) {
      // Document was created
      const newAmount = (event.data.after.data() as any).amount;

      switch (event.params.collectionId) {
      case "income":
        updatedSummary.totalIncome += newAmount;
        updatedSummary.netIncome += newAmount;
        break;
      case "expense":
        updatedSummary.totalExpense += newAmount;
        updatedSummary.netIncome -= newAmount;
        break;
      case "capital":
        updatedSummary.totalCapital += newAmount;
        updatedSummary.remainingCapital += newAmount;
        break;
      case "purchase":
        updatedSummary.totalPurchases += newAmount;
        updatedSummary.remainingCapital -= newAmount;
        break;
      }
    } else {
      // Document was deleted
      const oldAmount = (event.data.before.data() as any).amount;

      switch (event.params.collectionId) {
      case "income":
        updatedSummary.totalIncome -= oldAmount;
        updatedSummary.netIncome -= oldAmount;
        break;
      case "expense":
        updatedSummary.totalExpense -= oldAmount;
        updatedSummary.netIncome += oldAmount;
        break;
      case "capital":
        updatedSummary.totalCapital -= oldAmount;
        updatedSummary.remainingCapital -= oldAmount;
        break;
      case "purchase":
        updatedSummary.totalPurchases -= oldAmount;
        updatedSummary.remainingCapital += oldAmount;
        break;
      }
    }

    // Update the 'summary' document
    await summaryDocRef.set(updatedSummary);

    return null;
  }
);
