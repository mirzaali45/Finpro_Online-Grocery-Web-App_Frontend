"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import ToastContainerElement from '@/components/ToastContainerElement';
import Section1 from '@/components/profile/Section1';
import Section2 from '@/components/profile/Section2';
import Section3 from '@/components/profile/Section3';

export default function ProfilePage() {
    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem('token')) {
          router.push("/login-user-customer");
        }
    }, [router])
    
  return (
    <div className='w-full bg-gray-900 py-20'>
        <div className='container mx-auto'>
            <div className='mx-auto container flex items-center max-w-4xl'>
                <h1 className='text-white text-center w-full mt-4'>My Profile</h1>
            </div>
            <main className='h-auto'>
                <Section1 />
                <Section2 />
                <Section3 />
            </main>
            <ToastContainerElement />
        </div>
    </div>
  )
}