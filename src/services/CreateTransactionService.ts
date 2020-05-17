// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category: categoryTitle,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    // Check valid balance
    if (type === 'outcome') {
      const available = (await transactionsRepository.getBalance()).total;
      if (value > available) {
        throw new AppError('No available currency');
      }
    }

    // Category
    let category = await categoriesRepository.findOne({
      where: { title: categoryTitle },
    });
    if (!category) {
      category = categoriesRepository.create({ title: categoryTitle });
      await categoriesRepository.save(category);
    }

    const transaction = transactionsRepository.create({
      category_id: category.id,
      title,
      value,
      type,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
