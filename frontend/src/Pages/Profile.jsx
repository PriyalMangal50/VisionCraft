import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const AddressCard = ({ addr, onEdit, onDelete }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">{addr.fullName || 'Address'}</h4>
        {addr.isDefault && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-primary-50 text-primary-700 border border-primary-200">Default</span>
        )}
      </div>
      <div className="text-sm text-gray-600">
        <p>{addr.line1}</p>
        {addr.line2 && <p>{addr.line2}</p>}
        <p>{[addr.city, addr.state, addr.postalCode].filter(Boolean).join(', ')}</p>
        <p>{addr.country || 'India'}</p>
        {addr.phone && <p className="mt-1">Phone: {addr.phone}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => onEdit(addr)} className="button button-sm">Edit</button>
        <button onClick={() => onDelete(addr._id)} className="button button-sm button-outline">Delete</button>
      </div>
    </div>
  );
};

const emptyAddress = {
  fullName: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', phone: '', isDefault: false
};

export default function Profile() {
  const { token, user, updateProfile, saveAddress, removeAddress, fetchProfile } = useContext(ShopContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    // Ensure latest profile
    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  const addresses = useMemo(() => user?.addresses || [], [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({ name: form.name, phone: form.phone });
  };

  const startAddAddress = () => setEditingAddress({ ...emptyAddress });
  const startEditAddress = (addr) => setEditingAddress({ ...addr });
  const cancelAddress = () => setEditingAddress(null);
  const saveAddr = async (e) => {
    e.preventDefault();
    await saveAddress(editingAddress);
    setEditingAddress(null);
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">My Profile</h1>
        <Link to="/orders" className="button">View Orders</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile info */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
              <Field label="Name">
                <input className="input" value={form.name} onChange={e => setForm(v => ({...v, name: e.target.value}))} />
              </Field>
              <Field label="Email">
                <input className="input" value={form.email} disabled />
              </Field>
              <Field label="Phone">
                <input className="input" value={form.phone} onChange={e => setForm(v => ({...v, phone: e.target.value}))} />
              </Field>
              <div className="md:col-span-2">
                <button type="submit" className="button">Save Changes</button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Addresses */}
        <div>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Addresses</h2>
              <button onClick={startAddAddress} className="button button-sm">Add Address</button>
            </div>
            <div className="space-y-3">
              {addresses.length === 0 && (
                <p className="text-sm text-gray-600">No addresses saved yet.</p>
              )}
              {addresses.map(a => (
                <AddressCard key={a._id} addr={a} onEdit={startEditAddress} onDelete={removeAddress} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Address modal */}
      {editingAddress && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">{editingAddress._id ? 'Edit Address' : 'Add Address'}</h3>
              <button onClick={cancelAddress} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={saveAddr} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name"><input className="input" value={editingAddress.fullName} onChange={e=>setEditingAddress(v=>({...v, fullName:e.target.value}))} /></Field>
              <Field label="Phone"><input className="input" value={editingAddress.phone} onChange={e=>setEditingAddress(v=>({...v, phone:e.target.value}))} /></Field>
              <Field label="Address Line 1"><input className="input" value={editingAddress.line1} onChange={e=>setEditingAddress(v=>({...v, line1:e.target.value}))} /></Field>
              <Field label="Address Line 2"><input className="input" value={editingAddress.line2} onChange={e=>setEditingAddress(v=>({...v, line2:e.target.value}))} /></Field>
              <Field label="City"><input className="input" value={editingAddress.city} onChange={e=>setEditingAddress(v=>({...v, city:e.target.value}))} /></Field>
              <Field label="State"><input className="input" value={editingAddress.state} onChange={e=>setEditingAddress(v=>({...v, state:e.target.value}))} /></Field>
              <Field label="Postal Code"><input className="input" value={editingAddress.postalCode} onChange={e=>setEditingAddress(v=>({...v, postalCode:e.target.value}))} /></Field>
              <Field label="Country"><input className="input" value={editingAddress.country} onChange={e=>setEditingAddress(v=>({...v, country:e.target.value}))} /></Field>
              <div className="md:col-span-2 flex items-center gap-3">
                <input id="isDefault" type="checkbox" className="rounded border-gray-300" checked={!!editingAddress.isDefault} onChange={e=>setEditingAddress(v=>({...v, isDefault:e.target.checked}))} />
                <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default</label>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={cancelAddress} className="button button-outline">Cancel</button>
                <button type="submit" className="button">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
