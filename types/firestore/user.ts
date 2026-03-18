import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

export interface User {
  id: string
  codename: string
}

export const userConverter = {
  toFirestore: (data: Partial<User>): DocumentData => data,

  fromFirestore: (snapshot: QueryDocumentSnapshot): User => ({
    id: snapshot.id,
    ...snapshot.data(),
  } as User),
}
