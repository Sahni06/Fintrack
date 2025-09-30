"use client"
import React, { useEffect } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch";
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import useFetch from '@/app/hooks/use-fetch';
import { updateDefaultAccount } from '@/actions/accounts';
import { handleClientScriptLoad } from 'next/script';
import { toast } from 'sonner';


export default function AccountCard ({account}) {
  const{name, type, balance, id, isDefault }= account;

  const formatToINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
}; 

  const {//
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

const handleDefaultChange = async(event)=>{
event.stopPropagation(); 
  event.preventDefault();

    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return; // Don't allow toggling off the default account
    }

await updateDefaultFn(id)
}

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(()=>{
    if(error){
        toast.error(error.message || "Failed to update default account")
    }
  },[error])

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
          <Switch
           checked ={isDefault}
            className="absolute right-4 top-4 z-10"
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
          />
        <Link href={`/account/${id}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize">
            {name}
            </CardTitle>
    
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {formatToINR(parseFloat(balance))}
        </div>
        <p className='text-xs font-semibold text-gray-400 capitalize'>
          {type.charAt(0) + type.slice(1).toLowerCase()} Account
        </p>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground mt-2"> 
        <div className='flex items-center'>
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500 "/>
            Income
        </div>
        <div className='flex items-center'>
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500 "/>
            Expense
        </div>
      </CardFooter>
      </Link>
    </Card>
  )
}


