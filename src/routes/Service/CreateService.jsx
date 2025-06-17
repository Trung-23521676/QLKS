import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CreateService({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    requestId: "",
    roomNumber: "",
    service: "",
    amount: 1,
    note: "",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setForm({
        requestId: "",
        roomNumber: "",
        service: "",
        amount: 1,
        note: "",
      });
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Math.max(1, Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.requestId ||
      !form.roomNumber ||
      !form.service ||
      !form.amount ||
      form.amount < 1
    )
      return;
    onSave({
      requestId: form.requestId,
      roomNumber: form.roomNumber,
      service: form.service,
      amount: Number(form.amount),
      note: form.note,
      status: "Awaiting",
    });
    onClose();
  };

  return (
    <>
      {/* Blur background */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"></div>
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center text-black">
        <div className="bg-white rounded-2xl p-8 w-[380px] max-w-full shadow-xl relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X size={28} />
          </button>
          <h2 className="text-2xl font-bold text-center mb-6">Create service</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold mb-1">Request ID</label>
              <input
                name="requestId"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-400 text-blue-500"
                value={form.requestId}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Room number</label>
              <input
                name="roomNumber"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
                value={form.roomNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Service</label>
              <select
                name="service"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
                value={form.service}
                onChange={handleChange}
                required
              >
                <option value="">Select service</option>
                <option value="hihihii">hihihii</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="F&B">F&amp;B</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Amount</label>
              <input
                name="amount"
                type="number"
                min={1}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Note</label>
              <textarea
                name="note"
                className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none"
                rows={2}
                placeholder="Type 1"
                value={form.note}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}