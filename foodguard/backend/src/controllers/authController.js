import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

export async function signup(req, res) {
  try {
    const { name, email, password, location } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) return res.status(409).json({ message: 'An account with this email already exists' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash, location })

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, location: user.location, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email?.toLowerCase() })
    if (!user) return res.status(401).json({ message: 'Invalid email or password' })

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(401).json({ message: 'Invalid email or password' })

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, location: user.location, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message })
  }
}

export async function me(req, res) {
  res.json({ user: req.user })
}
