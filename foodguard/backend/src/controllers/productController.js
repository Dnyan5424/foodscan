import Product from '../models/Product.js'

export async function listProducts(req, res) {
  const products = await Product.find({ user: req.user._id }).sort({ expiryDate: 1 })
  res.json(products)
}

export async function createProduct(req, res) {
  try {
    const product = await Product.create({ ...req.body, user: req.user._id })
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: 'Could not create product', error: err.message })
  }
}

export async function updateProduct(req, res) {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  )
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json(product)
}

export async function deleteProduct(req, res) {
  const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ message: 'Deleted' })
}
