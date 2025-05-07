import React from 'react'
import StripePaymentComponent from './components/StripePaymentComponent'
import Onboard from './stripe-create-account/onboard'
import CheckoutPage from './components/CheckoutPage'
import EventDetail from './components/EventDetail'
import TicketQRCode from './components/TicketQRCode'
import QRScanner from './components/QRScanner'

const HomePage = () => {
  return (
    <div>
      {/* <Onboard/> */}
      {/* <StripePaymentComponent/> */}
      {/* <EventDetail/> */}
      {/* <TicketQRCode /> */}
      <QRScanner />
    </div>
  )
}

export default HomePage