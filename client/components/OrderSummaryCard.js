import React from 'react'

export const OrderSummaryCard = props => {
  return (
    <table id="order-summary">
      <thead>
        <tr>
          <th>
            <h2>Order Summary</h2>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="order-sum-total">
          <td>Order Total</td>
          <td>
            ${props.cartItems.reduce((acc, curr) => {
              let itemTotal = curr.price * curr.cart.quantity
              return acc + itemTotal
            }, 0) / 100}
          </td>
        </tr>
        <tr>
          <td>
            <button id="checkout-btn" type="button">
              Checkout
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}