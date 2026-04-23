// src/hooks/useMural.js
import { useState, useEffect } from 'react';
import {
  collection, addDoc, onSnapshot, updateDoc,
  doc, serverTimestamp, query, orderBy, where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export function useMuralItems(quintalId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quintalId) return;
    const q = query(
      collection(db, 'items'),
      where('quintalId', '==', quintalId),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, err => {
      console.error('Firestore error (may need composite index):', err);
      setLoading(false);
    });
    return unsub;
  }, [quintalId]);

  return { items, loading };
}

export async function addPhoto({ quintalId, user, file, x, y, music }) {
  const id = uuidv4();
  const storageRef = ref(storage, `quintals/${quintalId}/photos/${id}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return addDoc(collection(db, 'items'), {
    quintalId, type: 'photo', url, x, y,
    author: user.name, authorColor: user.color, authorId: user.id,
    music: music || null, createdAt: serverTimestamp(),
  });
}

export async function addDrawing({ quintalId, user, dataUrl, x, y }) {
  const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
  let finalData = { dataUrl, url: null };
  if (sizeKB > 200) {
    const blob = await fetch(dataUrl).then(r => r.blob());
    const storageRef = ref(storage, `quintals/${quintalId}/drawings/${uuidv4()}`);
    await uploadBytes(storageRef, blob);
    finalData = { dataUrl: null, url: await getDownloadURL(storageRef) };
  }
  return addDoc(collection(db, 'items'), {
    quintalId, type: 'drawing', ...finalData, x, y,
    author: user.name, authorColor: user.color, authorId: user.id,
    createdAt: serverTimestamp(),
  });
}

export async function addPin({ quintalId, user, text, x, y, music }) {
  return addDoc(collection(db, 'items'), {
    quintalId, type: 'pin', text, x, y,
    author: user.name, authorColor: user.color, authorId: user.id,
    music: music || null, createdAt: serverTimestamp(),
  });
}

export async function updateItemPosition(id, x, y) {
  return updateDoc(doc(db, 'items', id), { x, y });
}

export async function deleteItem(id) {
  const { deleteDoc } = await import('firebase/firestore');
  return deleteDoc(doc(db, 'items', id));
}
