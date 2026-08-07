import { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

const initialState = { items: [], open: false }

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((item) => item.id === action.product.id)
      const items = existing
        ? state.items.map((item) =>
            item.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...state.items, { ...action.product, quantity: 1 }]
      return { ...state, items, open: true }
    }
    case 'decrement': {
      const items = state.items
        .map((item) => (item.id === action.id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
      return { ...state, items }
    }
    case 'remove':
      return { ...state, items: state.items.filter((item) => item.id !== action.id) }
    case 'clear':
      return { ...state, items: [] }
    case 'toggle':
      return { ...state, open: action.open ?? !state.open }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo(() => {
    const count = state.items.reduce((total, item) => total + item.quantity, 0)
    const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0)

    return {
      items: state.items,
      open: state.open,
      count,
      subtotal,
      addItem: (product) => dispatch({ type: 'add', product }),
      decrement: (id) => dispatch({ type: 'decrement', id }),
      removeItem: (id) => dispatch({ type: 'remove', id }),
      clearCart: () => dispatch({ type: 'clear' }),
      setOpen: (open) => dispatch({ type: 'toggle', open }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
