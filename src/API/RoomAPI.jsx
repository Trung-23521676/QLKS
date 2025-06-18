// services/roomAPI.js

export const fetchRooms = async () => {
  try {
    const res = await fetch('/api/room');
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return await res.json();
  } catch (err) {
    console.error("Lỗi khi tải rooms:", err);
    return [];
  }
};

export const createRoom = async (newRoom) => {
  const res = await fetch('/api/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRoom),
  });
  if (!res.ok) throw new Error('Failed to create room');
  return await res.json();
};

export const updateRoom = async (roomId, updatedRoom) => {
  const res = await fetch(`/api/room/${roomId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedRoom),
  });
  if (!res.ok) throw new Error('Failed to update room');
  return await res.json();
};

export const deleteRoom = async (roomId) => {
  const res = await fetch(`/api/room/${roomId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete room');
  return await res.json();
};
