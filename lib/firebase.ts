import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  projectId: 'pocket-heist-claude',
  appId: '1:267534963652:web:e91e7c67719ed3f948ca91',
  storageBucket: 'pocket-heist-claude.firebasestorage.app',
  apiKey: 'AIzaSyCNB3D6o4xqlzr8jJ_q8LqBo_-qGvlcAkU',
  authDomain: 'pocket-heist-claude.firebaseapp.com',
  messagingSenderId: '267534963652',
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
