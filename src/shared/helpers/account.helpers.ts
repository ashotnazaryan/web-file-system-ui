import { CURRENCIES } from 'shared/constants';
import { Account, AccountDTO, IconType } from 'shared/models';
import { mapNumberToCurrencyString } from './common.helpers';

export const mapAccounts = (accounts: AccountDTO[], showDecimals = false): Account[] => {
  return accounts.map((account) => {
    return mapAccount(account, showDecimals);
  });
};

export const mapAccount = (account: AccountDTO, showDecimals = false): Account => {
  return {
    ...account,
    balance: mapNumberToCurrencyString(account.balance, account.currencyIso, showDecimals),
    icon: IconType[account.icon],
    currencySymbol: CURRENCIES.find(({iso}) => iso === account.currencyIso)?.symbol || '$'
  };
};
