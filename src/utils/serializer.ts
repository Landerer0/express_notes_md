export function serializeUser(user: any) {
  return {
    userId: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export function serializeNote(note: any) {
  return {
    noteId: note.id,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }
}

export const serializeUserNotes = (userNotes: {
  owned: any[]
  shared: any[]
}) => ({
  owned: userNotes.owned.map(serializeNote),
  shared: userNotes.shared.map(serializeNote),
})

export const serializeUserWithNotes = (user: any) => ({
  userId: user.id,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  notes: user.notes.map(serializeNote),
});

export function serializeRefreshToken(token: any) {
  return {
    refreshTokenId: token.id,
    tokenHash: token.tokenHash,
    createdAt: token.createdAt,
  };
}
