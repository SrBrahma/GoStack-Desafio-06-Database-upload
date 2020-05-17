import csv from 'csvtojson';
import fs from 'fs';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    try {
      const createTransaction = new CreateTransactionService();
      const csvContent = await csv().fromFile(filePath);
      const newTransactions: Transaction[] = [];
      for (const obj of csvContent) {
        newTransactions.push(await createTransaction.execute(obj));
      }

      fs.unlinkSync(filePath);
      return newTransactions;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default ImportTransactionsService;
