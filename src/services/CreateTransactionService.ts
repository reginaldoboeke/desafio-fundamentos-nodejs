import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    if (!title) {
      throw Error('Transaction title not informed.');
    }

    if (typeof value !== 'number') {
      throw Error('Transaction value not is a number.');
    }

    if (!type || (type !== 'income' && type !== 'outcome')) {
      throw Error('Transaction type is invalid or not informed.');
    }

    const { total } = this.transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw Error('The transaction cannot be completed. Insufficients funds.');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
