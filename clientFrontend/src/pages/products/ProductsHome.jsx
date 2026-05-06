import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { ROUTES } from '../../constants/routes'
import toast from 'react-hot-toast'

const mockProducts = [
  { id: 1, itemCode: 'ITM001', name: 'Basmati Rice', category: 'Grocery', unit: 'kg', price: 85, tax: 5, stock: 142, lowStockAt: 25, sku: 'SKU001' },
  { id: 2, itemCode: 'ITM002', name: 'Toned Milk', category: 'Dairy', unit: 'litre', price: 52, tax: 0, stock: 8, lowStockAt: 25, sku: 'SKU002' },
  { id: 3, itemCode: 'ITM003', name: 'Mineral Water', category: 'Beverages', unit: 'piece', price: 20, tax: 18, stock: 0, lowStockAt: 25, sku: 'SKU003' },
]

const getStockBadge = (stock, lowStockAt) => {
  if (stock === 0) return <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-700">Out of stock</span>
  if (stock <= lowStockAt) return <span className="px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-700">Low stock</span>
  return <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700">In stock</span>
}

const getTaxBadge = (tax) => (
  <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">{tax}%</span>
)

const Products = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState(mockProducts)
  const [globalFilter, setGlobalFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [unitFilter, setUnitFilter] = useState('')
  const [sorting, setSorting] = useState([])

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id))
    toast.success('Product deleted')
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        p.itemCode.toLowerCase().includes(globalFilter.toLowerCase())
      const matchCategory = categoryFilter ? p.category === categoryFilter : true
      const matchUnit = unitFilter ? p.unit === unitFilter : true
      return matchSearch && matchCategory && matchUnit
    })
  }, [products, globalFilter, categoryFilter, unitFilter])

  const categories = [...new Set(products.map(p => p.category))]
  const units = [...new Set(products.map(p => p.unit))]

  const columns = useMemo(() => [
    {
      header: 'Item Code',
      accessorKey: 'itemCode',
    },
    {
      header: 'Product Name',
      accessorKey: 'name',
    },
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Unit',
      accessorKey: 'unit',
    },
    {
      header: 'Price (₹)',
      accessorKey: 'price',
      cell: ({ row }) => {
        const { price, tax } = row.original
        const final = tax > 0 ? (price + (price * tax) / 100).toFixed(2) : price.toFixed(2)
        return (
          <div>
            <div className="text-gray-800 dark:text-white">₹{price.toFixed(2)}</div>
            {tax > 0 && (
              <div className="text-xs text-gray-400">+tax: ₹{final}</div>
            )}
          </div>
        )
      }
    },
    {
      header: 'GST',
      accessorKey: 'tax',
      cell: ({ getValue }) => getTaxBadge(getValue()),
    },
    {
      header: 'Stock',
      accessorKey: 'stock',
      cell: ({ row }) => (
        <div>
          <div className="text-gray-800 dark:text-white">{row.original.stock} {row.original.unit}</div>
        </div>
      )
    },
    {
      header: 'Status',
      cell: ({ row }) => getStockBadge(row.original.stock, row.original.lowStockAt),
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/products/edit/${row.original.id}`)}
            className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="w-7 h-7 flex items-center justify-center border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>
      )
    }
  ], [navigate, products])

  const table = useReactTable({
    data: filteredProducts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-800 dark:text-white">Products</h1>
        <button
          onClick={() => navigate(ROUTES.PRODUCTS_ADD)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3">
        <input
          type="text"
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search by name or item code..."
          className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={unitFilter}
          onChange={e => setUnitFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Units</option>
          {units.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-gray-400 text-sm">
                  No products found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-400">
            Showing {table.getRowModel().rows.length} of {filteredProducts.length} products
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Products