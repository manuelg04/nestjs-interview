import React, { useState } from 'react';

export const NotesModal = ({ isOpen, onSave, onClose, initialNotes = "" }) => {
  const [notes, setNotes] = useState(initialNotes);

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full z-50">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Timesheet Notes</h2>
          <p className="text-gray-600">Here you can add or edit notes for this timesheet.</p>
        </div>
        <textarea
          className="form-textarea mt-1 block w-full p-2 border rounded-md"
          rows={5} 
          placeholder="Write your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
