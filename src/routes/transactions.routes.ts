import { Router } from 'express';
import path from 'path';

import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import TransactionsRepository from '../repositories/TransactionsRepository';

const transactionsRouter = Router();

transactionsRouter.get('/', async (req, res) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  res.send({
    transactions: await transactionsRepository.getTransactions(),
    balance: await transactionsRepository.getBalance(),
  });
});

transactionsRouter.post('/', async (req, res) => {
  const { title, value, type, category } = req.body;
  return res.send(
    await new CreateTransactionService().execute({
      title,
      value,
      type,
      category,
    }),
  );
});

transactionsRouter.delete('/:id', async (req, res) => {
  await new DeleteTransactionService().execute(req.params.id);
  return res.status(204).send();
});

//
const upload = multer({
  dest: path.resolve(__dirname, '..', '..', 'tmp'),
}).single('file');

transactionsRouter.post('/import', upload, async (req, res) => {
  res.send(await new ImportTransactionsService().execute(req.file.path));
});

export default transactionsRouter;
