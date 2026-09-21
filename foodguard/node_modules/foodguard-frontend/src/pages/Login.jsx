import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const location = useLocation()

  // If URL is /signup, show signup page
  if (location.pathname === '/signup') {
    return <SignupPage />
  }

  return <LoginPage />
}

/* =====================================================
   LOGIN PAGE
===================================================== */

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(form.email, form.password)
      navigate('/profile')
    } catch (err) {
      setError(
        err.message || 'Unable to log in. Please check your details.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">

      <div className="login-background">
        <div className="background-glow glow-one" />
        <div className="background-glow glow-two" />

        <div className="leaf leaf-one" />
        <div className="leaf leaf-two" />
        <div className="leaf leaf-three" />
        <div className="leaf leaf-four" />
        <div className="leaf leaf-five" />
      </div>

      <div className="login-scene">

        <section className="login-card">

          {/* LEFT PANEL */}

          <div className="login-form-panel">

            <div className="login-content">

              {/* Brand */}

              <div className="login-brand">

                <div className="login-logo">
                  <span>🌿</span>
                </div>

                <div>
                  <p className="brand-name">
                    FoodGuard
                  </p>

                  <p className="brand-tagline">
                    Eat safe. Stay safe.
                  </p>
                </div>

              </div>

              {/* Heading */}

              <div className="login-heading">

                <p className="eyebrow">
                  WELCOME BACK
                </p>

                <h1>
                  Log in
                </h1>

                <p>
                  Continue your journey toward safer
                  and healthier food choices.
                </p>

              </div>

              {/* Error */}

              {error && (
                <div
                  className="login-error"
                  role="alert"
                >
                  <span className="error-icon">
                    !
                  </span>

                  <span>
                    {error}
                  </span>
                </div>
              )}

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="login-form"
              >

                <Field
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      email: value,
                    })
                  }
                />

                <div className="password-field">

                  <Field
                    label="Password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(value) =>
                      setForm({
                        ...form,
                        password: value,
                      })
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>

                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="login-button"
                >

                  <span>
                    {submitting
                      ? 'Logging in...'
                      : 'Log in'}
                  </span>

                  {!submitting && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  )}

                  {submitting && (
                    <span className="button-loader" />
                  )}

                </button>

              </form>

              {/* Signup */}

              <p className="signup-text">

                Don't have an account?{' '}

                <Link to="/signup">
                  Create account
                </Link>

              </p>

            </div>

            <div className="organic-edge">
              <span />
              <span />
              <span />
            </div>

          </div>


          {/* RIGHT ART */}

          <div className="login-art">

            <div className="art-overlay" />

            <div className="art-content">

              <div className="art-badge">

                <span>✓</span>

                Food safety starts with awareness

              </div>

              <h2>
                Make every
                <br />

                <strong>
                  food choice
                </strong>

                <br />

                safer.
              </h2>

              <p>
                Discover food safety information,
                track products, report concerns,
                and build healthier everyday habits.
              </p>

              <div className="art-stats">

                <div>
                  <strong>20+</strong>
                  <span>Food Guides</span>
                </div>

                <div>
                  <strong>30+</strong>
                  <span>Quiz Questions</span>
                </div>

                <div>
                  <strong>24/7</strong>
                  <span>Awareness</span>
                </div>

              </div>

            </div>

            <div className="art-leaf art-leaf-1">
              🌿
            </div>

            <div className="art-leaf art-leaf-2">
              🌱
            </div>

            <div className="art-leaf art-leaf-3">
              🍃
            </div>

          </div>

        </section>

        <p className="login-footer">
          © {new Date().getFullYear()} FoodGuard ·
          Safer food, healthier communities.
        </p>

      </div>

    </main>
  )
}


/* =====================================================
   CREATE ACCOUNT PAGE
===================================================== */

function SignupPage() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  function handleSignup(e) {

    e.preventDefault()

    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (form.phone.length < 10) {
      setError('Please enter a valid mobile number.')
      return
    }

    localStorage.setItem(
      'foodguard_signup',
      JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
      })
    )

    alert('Account created successfully! 🌿')

    navigate('/login')
  }

  return (

    <main className="login-page">

      <div className="login-background">

        <div className="background-glow glow-one" />
        <div className="background-glow glow-two" />

        <div className="leaf leaf-one" />
        <div className="leaf leaf-two" />
        <div className="leaf leaf-three" />

      </div>


      <div className="login-scene">

        <section className="login-card">

          <div className="login-form-panel">

            <div className="login-content">

              {/* Brand */}

              <div className="login-brand">

                <div className="login-logo">
                  <span>🌿</span>
                </div>

                <div>
                  <p className="brand-name">
                    FoodGuard
                  </p>

                  <p className="brand-tagline">
                    Eat safe. Stay safe.
                  </p>
                </div>

              </div>


              {/* Heading */}

              <div className="login-heading">

                <p className="eyebrow">
                  JOIN FOODGUARD
                </p>

                <h1>
                  Create account
                </h1>

                <p>
                  Start your journey toward safer
                  and healthier food choices.
                </p>

              </div>


              {/* Error */}

              {error && (

                <div
                  className="login-error"
                  role="alert"
                >

                  <span className="error-icon">
                    !
                  </span>

                  <span>
                    {error}
                  </span>

                </div>

              )}


              {/* Signup Form */}

              <form
                onSubmit={handleSignup}
                className="login-form"
              >

                <Field
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={form.name}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      name: value,
                    })
                  }
                />


                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={form.email}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      email: value,
                    })
                  }
                />


                <Field
                  label="Mobile Number"
                  name="phone"
                  type="tel"
                  placeholder="Enter your mobile number"
                  required
                  value={form.phone}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      phone: value,
                    })
                  }
                />


                <Field
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={form.password}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      password: value,
                    })
                  }
                />


                <Field
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={form.confirmPassword}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      confirmPassword: value,
                    })
                  }
                />


                <button
                  type="submit"
                  className="login-button"
                >

                  <span>
                    Create account
                  </span>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>

                </button>

              </form>


              {/* Login link */}

              <p className="signup-text">

                Already have an account?{' '}

                <Link to="/login">
                  Log in
                </Link>

              </p>

            </div>


            <div className="organic-edge">
              <span />
              <span />
              <span />
            </div>

          </div>


          {/* Right panel */}

          <div className="login-art">

            <div className="art-overlay" />

            <div className="art-content">

              <div className="art-badge">

                <span>✓</span>

                Welcome to FoodGuard

              </div>

              <h2>

                Protect your
                <br />

                <strong>
                  food & health
                </strong>

                <br />

                every day.

              </h2>

              <p>
                Learn about food safety, track
                expiry dates and report food concerns.
              </p>

            </div>

            <div className="art-leaf art-leaf-1">
              🌿
            </div>

            <div className="art-leaf art-leaf-2">
              🌱
            </div>

            <div className="art-leaf art-leaf-3">
              🍃
            </div>

          </div>

        </section>


        <p className="login-footer">
          © {new Date().getFullYear()} FoodGuard ·
          Safer food, healthier communities.
        </p>

      </div>

    </main>
  )
}


/* =====================================================
   REUSABLE FIELD
===================================================== */

function Field({ label, ...props }) {

  return (

    <label className="login-field">

      <span>
        {label}
      </span>

      <input
        {...props}
        value={props.value}
        onChange={(e) =>
          props.onChange(e.target.value)
        }
      />

    </label>

  )
}