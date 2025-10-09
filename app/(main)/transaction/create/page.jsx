import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/app/data/categories';
import React from 'react'
import AddTransactionForm from '../_components/transaction-form';
import { getTransaction } from '@/actions/transaction';

const AddTransactionPage = async ({searchParams}) => {
    const accounts = await getUserAccounts();
const { edit: editId } = await searchParams;

let initialData = null;
if (editId){
  const transaction = await getTransaction(editId);
  initialData = transaction;
}

  return (
    <div className='max-w-3xl mx-auto px-5'>
<h1 className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 mb-5 '>
  {editId? "Edit":"Add"}  Transaction
</h1>
<AddTransactionForm
accounts={accounts}
categories={defaultCategories}
editMode= {!!editId}
initialData={initialData}
/>
    </div>
  )
}

export default AddTransactionPage;
