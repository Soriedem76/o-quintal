import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./src/lib/firebase.js";

async function clearItems() {
  const snap = await getDocs(collection(db, "items"));

  const promises = snap.docs.map(d => deleteDoc(doc(db, "items", d.id)));

  await Promise.all(promises);

  console.log("🔥 Tudo apagado!");
}

clearItems();