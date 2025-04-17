// src/pages/Account.jsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const Account = () => {
  const [email, setEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setEmail(user?.email || '')
    }
    getUser()
  }, [])

  const updateEmail = async () => {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) {
      alert("Error updating email: " + error.message)
    } else {
      alert("Email update requested. Check your inbox to confirm.")
    }
    setLoading(false)
  }

  const updatePassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      alert("Error updating password: " + error.message)
    } else {
      alert("Password updated successfully.")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Current Email:</label>
        <div className="bg-gray-100 p-2 rounded">{email}</div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">New Email:</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          onClick={updateEmail}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Update Email
        </button>
      </div>

      <hr className="my-6" />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">New Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Confirm New Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          onClick={updatePassword}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          Update Password
        </button>
      </div>
    </div>
  )
}

export default Account
