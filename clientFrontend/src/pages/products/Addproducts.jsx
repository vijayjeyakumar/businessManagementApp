import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'
import { ROUTES } from '../../constants/routes'

const UNITS = ['kg', 'gram', 'litre', 'ml', 'piece', 'dozen', 'box', 'packet']
const GST_RATES = [0, 5, 12, 18, 28]

const AddProduct = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    itemCode: '',
    name: '',
    category: '',
    unit: '',
    price: '',
    includeTax: false,
    gst: 0,
    stock: '',
    lowStockAt: 25,
    sku: '',
    description: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('')
  }

  const finalPrice = () => {
    const price = parseFloat(formData.price) || 0
    if (!formData.includeTax || formData.gst === 0) return price.toFixed(2)
    return (price + (price * formData.gst) / 100).toFixed(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // validations
    if (!formData.itemCode.trim()) {
      setError('Item code is required')
      setLoading(false)
      return
    }
    if (!formData.unit) {
      setError('Please select a unit')
      setLoading(false)
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price')
      setLoading(false)
      return
    }
    if (formData.includeTax && formData.gst === 0) {
      setError('Please select a GST rate')
      setLoading(false)
      return
    }

    try {
      // TODO: replace with real API when backend ready
      // await axiosInstance.post('/products', formData)
      console.log('Product data:', formData)
      toast.success('Product added successfully!')
      navigate(ROUTES.PRODUCTS)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add product'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(ROUTES.PRODUCTS)}
          className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-xl font-medium text-gray-800 dark:text-white">Add Product</h1>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Row 1 — Item Code + Product Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Item Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleChange}
                placeholder="e.g. ITM001"
                required
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">Must be unique</p>
            </div>
            <div>
              <label className={labelClass}>Product Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Basmati Rice"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 2 — Category + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Grocery, Dairy, Beverages"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Unit <span className="text-red-500">*</span></label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select unit</option>
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3 — Price + Tax */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Pricing</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Sale Price (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Tax</label>
                <div className="flex items-center gap-3 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      name="includeTax"
                      checked={formData.includeTax}
                      onChange={handleChange}
                      className="w-4 h-4 accent-blue-600"
                    />
                    Include GST
                  </label>
                  {formData.includeTax && (
                    <select
                      name="gst"
                      value={formData.gst}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>Select GST</option>
                      {GST_RATES.filter(r => r > 0).map(r => (
                        <option key={r} value={r}>{r}%</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Final Price Display */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Final price:</span>
              <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
                ₹{finalPrice()}
              </span>
              {formData.includeTax && formData.gst > 0 && (
                <span className="text-xs text-gray-400">
                  (₹{parseFloat(formData.price || 0).toFixed(2)} + {formData.gst}% GST)
                </span>
              )}
            </div>
          </div>

          {/* Row 4 — Stock + Low Stock Threshold */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Stock Quantity <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Low Stock Alert Below</label>
              <input
                type="number"
                name="lowStockAt"
                value={formData.lowStockAt}
                onChange={handleChange}
                placeholder="25"
                min="1"
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">Default is 25 units</p>
            </div>
          </div>

          {/* Row 5 — SKU + Description */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>SKU / Barcode <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. 8901234567890"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief product description..."
                rows={3}
                className={inputClass}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.PRODUCTS)}
              className="px-5 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddProduct