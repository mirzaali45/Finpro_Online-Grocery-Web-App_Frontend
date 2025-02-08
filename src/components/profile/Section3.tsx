import React, { useEffect, useState } from 'react'
import Modal from '../product-management/Modal'
import services3 from '@/services/profile/services3'
import CardOrderItems from './CardOrderItems'
import { Orders, OrdersItems } from '@/types/orders-types'

const Section3 = () => {
    const { load, ordersData } = services3()
    const [modalDetail, setModalDetail] = useState(false)
    const [dataDetail, setDataDetail] = useState<OrdersItems[]>([])
  
  return (
    <>
    <div className='mt-10 text-center'>
        <h1>My Order</h1>
    </div>
    <section className='mt-5 max-w-4xl text-white py-5 mx-auto px-8 pt-8 pb-16 bg-gray-800 rounded-md'>
        <div className='flex justify-between'>
            <h1>Track youre orders</h1>
        </div>
        <div className='flex flex-wrap mt-5 gap-3 w-full'>
            {ordersData.map((data, index) => (
                <div key={index} className='box-address bg-gray-700 px-5 rounded-md py-4 w-full'>
                    <h1><i className={`bi-postage-fill mr-3`}></i>{data.order_id}</h1>
                    <div className='flex justify-between my-2 items-end'>
                        <div className='w-full flex gap-3 flex-wrap'>
                            <p className='text-white bg-gray-600 w-auto py-1 px-4 text-sm rounded-md'>{data.total_price}</p>
                            <p className='text-white bg-gray-600 w-auto py-1 px-4 text-sm rounded-md'>x{data.OrderItem.length}</p>
                            <p className='text-white bg-gray-600 w-auto py-1 px-4 text-sm rounded-md'>{data.order_status}</p>
                        </div>
                        <button onClick={() => {
                            setModalDetail(true)
                            setDataDetail(data.OrderItem)
                        }} className='button hover:bg-opacity-100 hover:text-white transition-all ease-in-out bg-blue-500 rounded-md px-3 py-2 bg-opacity-20 text-blue-600'>
                            <i className='bi-eye-fill'></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
        <Modal isOpen={modalDetail} onClose={() => setModalDetail(false)} title='Order Items'>
            <CardOrderItems dataItems={dataDetail} />
        </Modal>
    </section>
    </>
  )
}

export default Section3