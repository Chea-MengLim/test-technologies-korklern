import React from 'react'
import StripePaymentComponent from './components/StripePaymentComponent'
import Onboard from './stripe-create-account/onboard'
import CheckoutPage from './components/CheckoutPage'
import EventDetail from './components/EventDetail'

const HomePage = () => {
  return (
    <div>
      {/* <Onboard/> */}
      {/* <StripePaymentComponent/> */}
      <EventDetail/>
    </div>
  )
}

export default HomePage